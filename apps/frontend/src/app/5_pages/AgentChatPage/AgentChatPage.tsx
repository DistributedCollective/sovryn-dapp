import React, { FC, useState, useCallback, useEffect, useRef } from 'react';

import { Helmet } from 'react-helmet-async';
import { io, Socket } from 'socket.io-client';

import {
  Button,
  ButtonStyle,
  ButtonType,
  Heading,
  Input,
  Paragraph,
  ParagraphSize,
} from '@sovryn/ui';

import { useAccount } from '../../../hooks/useAccount';
import { ChatBubble } from './components/ChatBubble';
import { TransactionConfirmModal } from './components/TransactionConfirmModal';
import { Message, Sender, RawTransaction } from './types';

const SOCKET_URL = 'http://localhost:3000';

// ElizaOS default bus channel - agents are automatically registered to this channel
const DEFAULT_BUS_CHANNEL = '00000000-0000-0000-0000-000000000000';

// Socket message types from @elizaos/core
enum SOCKET_MESSAGE_TYPE {
  ROOM_JOINING = 1,
  SEND_MESSAGE = 2,
}

const AgentChatPage: FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userId] = useState(() => crypto.randomUUID());
  const [roomId, setRoomId] = useState(() => crypto.randomUUID());
  const [dmChannelId] = useState(() => crypto.randomUUID()); // Unique DM channel ID
  const socketRef = useRef<Socket | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingTransactions, setPendingTransactions] = useState<
    RawTransaction[]
  >([]);
  const { signer } = useAccount();

  const clearChat = useCallback(() => {
    setMessages([]);
    setIsLoading(false);
  }, []);

  const handleNewChat = useCallback(() => {
    // Generate new room ID for fresh conversation
    setRoomId(crypto.randomUUID());
    setMessages([]);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    // Initialize Socket.IO connection
    const socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      withCredentials: true,
    });
    socketRef.current = socket;

    socket.on('connect', () => {
      socket.emit('message', {
        type: SOCKET_MESSAGE_TYPE.ROOM_JOINING,
        payload: {
          channelId: dmChannelId, // Use unique DM channel
          roomId: roomId,
          entityId: userId,
        },
      });
    });

    socket.on('message', (data: any) => {
      const payload = data.payload || data;

      if (payload.senderId === userId) return;

      // Extract transaction data
      let transactions: RawTransaction[] | undefined = undefined;

      const txData =
        payload.content?.data?.txData ||
        payload.rawMessage?.content?.data?.txData ||
        payload.data?.txData ||
        null;

      if (txData && txData.approvalTx && txData.swapTx) {
        transactions = [
          {
            ...txData.approvalTx,
            description: 'Approve Token',
            gasLimit: txData.approvalTx.gasLimit || txData.approvalTx.gas,
          },
          {
            ...txData.swapTx,
            description: 'Execute Swap',
            gasLimit: txData.swapTx.gasLimit || txData.swapTx.gas,
          },
        ];
      }

      // Extract text from various possible locations
      const messageText =
        payload.text ||
        payload.message ||
        payload.content?.text ||
        payload.content?.message ||
        'Received message';

      const agentMessage: Message = {
        id: payload.id || Date.now().toString(),
        sender: Sender.Agent,
        text: messageText,
        transactions: transactions,
        timestamp: Date.now(),
      };

      setMessages(prev => {
        if (prev.some(m => m.id === agentMessage.id)) return prev;
        return [...prev, agentMessage];
      });
      setIsLoading(false);
    });

    // Listen for agent responses via messageBroadcast event
    socket.on('messageBroadcast', (data: any) => {
      // The data is an array with the message object
      const message = Array.isArray(data) ? data[0] : data;

      // Ignore messages sent by us
      if (message?.senderId === userId) return;

      // Extract text from the message - prioritize user-facing text
      const messageText =
        message?.text ||
        message?.rawMessage?.text ||
        message?.content?.text ||
        message?.content?.message ||
        message?.thought ||
        'Received response';

      // Extract transaction data from message
      let transactions: RawTransaction[] | undefined = undefined;

      const txData =
        message?.data?.txData ||
        message?.rawMessage?.actionResult?.data?.txData ||
        null;

      if (txData && txData.approvalTx && txData.swapTx) {
        transactions = [
          {
            ...txData.approvalTx,
            description: 'Approve Token',
            gasLimit: txData.approvalTx.gasLimit || txData.approvalTx.gas,
          },
          {
            ...txData.swapTx,
            description: 'Execute Swap',
            gasLimit: txData.swapTx.gasLimit || txData.swapTx.gas,
          },
        ];
      }

      const agentMessage: Message = {
        id: message?.id || Date.now().toString(),
        sender: Sender.Agent,
        text: messageText,
        transactions: transactions,
        timestamp: Date.now(),
      };

      setMessages(prev => {
        const existingIndex = prev.findIndex(m => m.id === agentMessage.id);
        if (existingIndex !== -1) {
          // Update existing message with transaction data
          const updated = [...prev];
          updated[existingIndex] = {
            ...updated[existingIndex],
            ...agentMessage,
            transactions:
              agentMessage.transactions || updated[existingIndex].transactions,
          };
          return updated;
        }
        return [...prev, agentMessage];
      });
      setIsLoading(false);
    });

    socket.on('disconnect', () => {
      console.warn('Disconnected from backend');
    });

    socket.on('error', (error: any) => {
      console.error('Socket.IO error:', error);
    });

    socket.on('connect_error', (error: any) => {
      console.error('Connection error:', error);
    });

    return () => {
      socket.disconnect();
    };
  }, [userId, roomId, dmChannelId]);

  const handleSendMessage = useCallback(async () => {
    if (!inputValue.trim() || !socketRef.current) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: Sender.User,
      text: inputValue,
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      socketRef.current.emit('message', {
        type: SOCKET_MESSAGE_TYPE.SEND_MESSAGE,
        payload: {
          senderId: userId,
          senderName: 'User',
          message: userMessage.text,
          channelId: dmChannelId, // Use unique DM channel
          roomId: roomId,
          serverId: DEFAULT_BUS_CHANNEL,
          source: 'client_chat',
          metadata: {
            isDm: true,
            channelType: 'DM',
            targetUserId: '51f0dfb7-88b4-0802-bc8d-818a2a18070c', // Aegis AI agent ID
          },
        },
      });
    } catch (error) {
      console.error('Error sending message:', error);
      setIsLoading(false);
    }
  }, [inputValue, userId, roomId, dmChannelId]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      <Helmet>
        <title>AI Agent Chat</title>
      </Helmet>

      <div className="w-full max-w-4xl mx-auto flex flex-col h-[calc(100vh-200px)]">
        <div className="flex justify-between items-center mb-4">
          <Heading className="text-center flex-1">AI Agent Chat</Heading>
          <div className="flex gap-2">
            <Button
              text="New Chat"
              onClick={handleNewChat}
              style={ButtonStyle.primary}
              type={ButtonType.button}
            />
            <Button
              text="Clear Chat"
              onClick={clearChat}
              style={ButtonStyle.secondary}
              type={ButtonType.button}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto bg-gray-90 rounded p-4 mb-4 space-y-4">
          {messages.length === 0 && (
            <Paragraph
              className="text-center text-gray-30 mt-10"
              size={ParagraphSize.base}
            >
              Start a conversation with the AI Agent...
            </Paragraph>
          )}

          {messages.map(msg => (
            <div
              key={msg.id}
              className={`flex flex-col ${
                msg.sender === Sender.User ? 'items-end' : 'items-start'
              }`}
            >
              <ChatBubble message={msg} />
              {msg.transactions && msg.transactions.length > 0 && (
                <div className="mt-2 max-w-md w-full">
                  <Button
                    text={
                      signer
                        ? `Sign ${msg.transactions.length} Transaction${
                            msg.transactions.length > 1 ? 's' : ''
                          }`
                        : 'Connect Wallet to Sign'
                    }
                    onClick={() => {
                      if (signer) {
                        setPendingTransactions(msg.transactions!);
                        setIsModalOpen(true);
                      }
                    }}
                    style={signer ? ButtonStyle.primary : ButtonStyle.secondary}
                    type={ButtonType.button}
                    className="w-full"
                    disabled={!signer}
                  />
                  {!signer && (
                    <Paragraph
                      size={ParagraphSize.small}
                      className="text-warning text-center mt-2"
                    >
                      Please connect your wallet to sign transactions.
                    </Paragraph>
                  )}
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-80 rounded-lg p-3 text-gray-30 animate-pulse">
                Typing...
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChangeText={setInputValue}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="flex-1"
            disabled={isLoading}
          />
          <Button
            text="Send"
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            style={ButtonStyle.primary}
            type={ButtonType.button}
          />
        </div>
      </div>

      <TransactionConfirmModal
        transactions={pendingTransactions}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default AgentChatPage;

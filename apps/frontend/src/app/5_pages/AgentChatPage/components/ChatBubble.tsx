import React, { FC } from 'react';

import classNames from 'classnames';

import { Paragraph, ParagraphSize } from '@sovryn/ui';

import { Message, Sender } from '../types';

interface ChatBubbleProps {
  message: Message;
}

export const ChatBubble: FC<ChatBubbleProps> = ({ message }) => {
  const isUser = message.sender === Sender.User;

  return (
    <div
      className={classNames('max-w-[80%] rounded-lg p-3 mb-1', {
        'bg-primary-10 text-gray-90 rounded-br-none': isUser,
        'bg-gray-70 text-gray-10 rounded-bl-none': !isUser,
      })}
    >
      <Paragraph
        size={ParagraphSize.base}
        className="break-words whitespace-pre-wrap"
      >
        {message.text}
      </Paragraph>
      <div
        className={classNames('text-xs mt-1 opacity-70', {
          'text-right': isUser,
          'text-left': !isUser,
        })}
      >
        {new Date(message.timestamp).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        })}
      </div>
    </div>
  );
};

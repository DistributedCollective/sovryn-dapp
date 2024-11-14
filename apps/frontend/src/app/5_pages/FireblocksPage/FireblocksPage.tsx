import {
  FireblocksWeb3Provider,
  ChainId,
  ApiBaseUrl,
} from '@fireblocks/fireblocks-web3-provider';

import React, { FC, useCallback } from 'react';

import { ethers } from 'ethers';
import { readFileSync } from 'fs';
import { Helmet } from 'react-helmet-async';

import { ERC20_ABI } from '@sovryn/sdex';
import { Button, ButtonStyle, Heading } from '@sovryn/ui';

import { useAccount } from '../../../hooks/useAccount';

// Sepolia USDC Contract Address
const CONTRACT_ADDRESS = '0x0F004Fd9e9e1f884975908137F5494C3cA1D9914';

const FireblocksPage: FC = () => {
  const { account } = useAccount();

  const approveTransaction = useCallback(async () => {
    try {
      const eip1193Provider = new FireblocksWeb3Provider({
        apiBaseUrl: ApiBaseUrl.Sandbox,
        privateKey: process.env.FIREBLOCKS_API_KEY || '',
        apiKey: readFileSync(
          process.env.FIREBLOCKS_API_PRIVATE_KEY_PATH || '',
          'utf8',
        ),
        vaultAccountIds: 0,
        chainId: ChainId.SEPOLIA,
      });

      const provider = new ethers.providers.Web3Provider(eip1193Provider);
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        ERC20_ABI,
        provider.getSigner(),
      );
      // 1 USDC to approve
      const amount = 1e6;

      // Invoke approve method
      const tx = await contract.approve(account, amount);

      console.log('Transaction:', JSON.stringify(tx, null, 2));
    } catch (error) {
      console.error('Error approving transaction:', error);
    }
  }, [account]);

  return (
    <>
      <Helmet>
        <title>Fireblocks test page</title>
      </Helmet>

      <div className="w-full flex flex-col items-center text-gray-10 mt-9 mb-14 md:px-20">
        <Heading className="text-center lg:text-2xl">
          Fireblocks Test Page
        </Heading>

        <div className="md:bg-gray-90 flex flex-col items-center justify-center max-w-2xl px-3 py-4 w-full mt-8">
          <Button
            text="Approve Transaction"
            style={ButtonStyle.primary}
            onClick={approveTransaction}
          />
        </div>
      </div>
    </>
  );
};

export default FireblocksPage;

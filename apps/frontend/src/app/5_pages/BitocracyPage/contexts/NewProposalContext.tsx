import React, {
  FC,
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useState,
} from 'react';

import { Contract } from 'ethers';
import { t } from 'i18next';

import { noop } from '@sovryn/ui';

import { RSK_CHAIN_ID } from '../../../../config/chains';

import {
  TransactionCallbacks,
  TransactionType,
} from '../../../3_organisms/TransactionStepDialog/TransactionStepDialog.types';
import { GAS_LIMIT } from '../../../../constants/gasLimits';
import { useTransactionContext } from '../../../../contexts/TransactionContext';
import { useAccount } from '../../../../hooks/useAccount';
import { translations } from '../../../../locales/i18n';
import {
  ProposalContextValue,
  ProposalCreationDetails,
  ProposalCreationStep,
  ProposalCreationType,
} from './ProposalContext.types';
import { getAssetData } from '@sovryn/contracts';
import { COMMON_SYMBOLS } from '../../../../utils/asset';

const defaultContextValue: ProposalContextValue = {
  step: ProposalCreationStep.SelectType,
  setStep: noop,
  type: ProposalCreationType.Parameters,
  setType: noop,
  details: {
    title: '',
    link: '',
    summary: '',
    text: '',
  },
  setDetails: noop,
  governor: null,
  setGovernor: noop,
  parameters: [],
  setParameters: noop,
  submit: noop,
  reset: noop,
};

const ProposalContext =
  createContext<ProposalContextValue>(defaultContextValue);

export const useProposalContext = () =>
  useContext(ProposalContext) as ProposalContextValue;

export const ProposalContextProvider: FC<PropsWithChildren> = ({
  children,
}) => {
  const { signer } = useAccount();
  const { setTransactions, setIsOpen, setTitle } = useTransactionContext();

  const [step, setStep] = useState<ProposalCreationStep>(
    defaultContextValue.step,
  );
  const [type, setType] = useState<ProposalCreationType>(
    defaultContextValue.type,
  );
  const [details, setDetails] = useState<ProposalCreationDetails>(
    defaultContextValue.details,
  );
  const [governor, setGovernor] = useState<string | null>(
    defaultContextValue.governor,
  );
  const [parameters, setParameters] = useState<
    ProposalContextValue['parameters']
  >(defaultContextValue.parameters);

  const submit = useCallback(
    async (callbacks?: Partial<TransactionCallbacks>) => {
      if (!signer) {
        throw new Error('No signer');
      }

      if (!governor) {
        throw new Error('No governor selected');
      }

      var actions = parameters;

      if (type === ProposalCreationType.Proclamation) {
        // make proclamation "non-executable" proposal.
        const { address } = await getAssetData(
          COMMON_SYMBOLS.SOV,
          RSK_CHAIN_ID,
        );
        actions = [
          {
            target: address,
            signature: 'symbol()',
            value: '0x00',
            calldata: '0x00',
          },
        ];
      }

      const contract = new Contract(
        governor,
        [
          {
            constant: false,
            inputs: [
              {
                internalType: 'address[]',
                name: 'targets',
                type: 'address[]',
              },
              {
                internalType: 'uint256[]',
                name: 'values',
                type: 'uint256[]',
              },
              {
                internalType: 'string[]',
                name: 'signatures',
                type: 'string[]',
              },
              {
                internalType: 'bytes[]',
                name: 'calldatas',
                type: 'bytes[]',
              },
              {
                internalType: 'string',
                name: 'description',
                type: 'string',
              },
            ],
            name: 'propose',
            outputs: [
              {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
              },
            ],
            payable: false,
            stateMutability: 'nonpayable',
            type: 'function',
          },
        ],
        signer,
      );

      const args = [
        actions.map(item => item.target),
        actions.map(item => item.value).map(item => item || '0x00'),
        actions.map(item => item.signature),
        actions.map(item => item.calldata).map(item => item || '0x00'),
        `${details.title}\n${details.link}\n${details.summary}\n---\n${details.text}`,
      ];

      setTitle(details.title || t(translations.newProposalTx.title));
      setTransactions([
        {
          title: t(translations.newProposalTx.title),
          subtitle:
            details.summary || t(translations.newProposalTx.description),
          request: {
            type: TransactionType.signTransaction,
            contract: contract,
            fnName: 'propose',
            args,
            gasLimit: GAS_LIMIT.GOVERNOR_PROPOSE,
          },
          ...callbacks,
        },
      ]);
      setIsOpen(true);
    },
    [
      signer,
      governor,
      parameters,
      type,
      details.title,
      details.link,
      details.summary,
      details.text,
      setTitle,
      setTransactions,
      setIsOpen,
    ],
  );

  const reset = useCallback(() => {
    setStep(defaultContextValue.step);
    setType(defaultContextValue.type);
    setDetails(defaultContextValue.details);
    setGovernor(defaultContextValue.governor);
    setParameters(defaultContextValue.parameters);
  }, []);

  return (
    <ProposalContext.Provider
      value={{
        step,
        setStep,
        type,
        setType,
        details,
        setDetails,
        governor,
        setGovernor,
        parameters,
        setParameters,
        submit,
        reset,
      }}
    >
      {children}
    </ProposalContext.Provider>
  );
};

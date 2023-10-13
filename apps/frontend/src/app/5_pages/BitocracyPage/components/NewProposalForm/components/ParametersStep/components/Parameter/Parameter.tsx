import React, { FC, useMemo, useState } from 'react';

import { t } from 'i18next';

import {
  FormGroup,
  Input,
  Select,
  SimpleTable,
  SimpleTableRow,
} from '@sovryn/ui';

import { translations } from '../../../../../../../../../locales/i18n';
import { ProposalCreationParameter } from '../../../../../../contexts/ProposalContext.types';
import { PROPOSAL_CONTRACT_OPTIONS } from '../../../../NewProposalForm.constants';

// TODO: Add real parameters
const parameterOptions = [
  {
    value: 'Placeholder',
    label: 'Placeholder',
  },
];

type ParameterProps = {
  parameter: ProposalCreationParameter;
};

export const Parameter: FC<ParameterProps> = ({ parameter }) => {
  //const { setParameters } = useProposalContext();
  const [proposalContract, setProposalContract] = useState('');
  //const [parameter, setParameter] = useState('');
  const [newValue, setNewValue] = useState('');

  const [customAddress, setCustomAddress] = useState('');
  const [customValue, setCustomValue] = useState('');
  const [customContract, setCustomContract] = useState('');
  const [customCalldata, setCustomCalldata] = useState('');

  const isCustomContract = useMemo(
    () => proposalContract === 'Custom',
    [proposalContract],
  );

  const customContractSection = useMemo(
    () => (
      <>
        <FormGroup
          label={t(translations.proposalPage.customContract.address)}
          className="mt-4"
        >
          <Input value={customAddress} onChangeText={setCustomAddress} />
        </FormGroup>

        <FormGroup
          label={t(translations.proposalPage.customContract.value)}
          className="mt-4"
        >
          <Input value={customValue} onChangeText={setCustomValue} />
        </FormGroup>

        <FormGroup
          label={t(translations.proposalPage.customContract.signature)}
          className="mt-4"
        >
          <Input value={customContract} onChangeText={setCustomContract} />
        </FormGroup>

        <FormGroup
          label={t(translations.proposalPage.customContract.calldata)}
          className="mt-4"
        >
          <Input value={customCalldata} onChangeText={setCustomCalldata} />
        </FormGroup>
      </>
    ),
    [customAddress, customCalldata, customContract, customValue],
  );

  return (
    <div className="p-3 mt-4 rounded bg-gray-90">
      <FormGroup label={t(translations.proposalPage.contract)}>
        <Select
          value={proposalContract}
          onChange={setProposalContract}
          options={PROPOSAL_CONTRACT_OPTIONS}
          className="w-full"
        />
      </FormGroup>

      {isCustomContract ? (
        customContractSection
      ) : (
        <FormGroup
          label={t(translations.proposalPage.parameter)}
          className="mt-6"
        >
          <Select
            value={'parameter'}
            onChange={() => {
              console.log(`test`);
            }}
            options={parameterOptions}
            className="w-full"
          />

          <SimpleTable className="mt-8">
            <SimpleTableRow
              label={t(translations.proposalPage.currentValue)}
              value={5}
            />
          </SimpleTable>

          <div className="flex items-center justify-between mt-4">
            <div className="whitespace-nowrap mr-4">
              {t(translations.proposalPage.newValue)}
            </div>
            <Input
              value={newValue}
              onChangeText={setNewValue}
              className="max-w-none"
            />
          </div>
        </FormGroup>
      )}
    </div>
  );
};

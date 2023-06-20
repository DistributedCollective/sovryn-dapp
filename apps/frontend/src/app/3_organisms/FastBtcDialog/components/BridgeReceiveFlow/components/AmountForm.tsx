import React, { useCallback, useContext, useMemo, useReducer } from 'react';

import { t } from 'i18next';

import {
  Accordion,
  AmountInput,
  Button,
  ButtonStyle,
  FormGroup,
  Heading,
  HeadingType,
  Paragraph,
  SimpleTable,
  SimpleTableRow,
} from '@sovryn/ui';

import { MaxButton } from '../../../../../2_molecules/MaxButton/MaxButton';
import { useAmountInput } from '../../../../../../hooks/useAmountInput';
import { useWeiAmountInput } from '../../../../../../hooks/useWeiAmountInput';
import { translations } from '../../../../../../locales/i18n';
import { ReceiveContext, ReceiveStep } from '../../../contexts/receive-context';
import { getNetwork } from '../../../utils/networks';

const translation = translations.fastBtc.receive.amountFormScreen;

// todo: replace with real data
const policies = [
  {
    title: t(translation.policies.minimum),
    value: '50 BUSD',
  },
  {
    title: t(translation.policies.conversion),
    value: '2 BUSD',
  },
  {
    title: t(translation.policies.fee),
    value: '3 BUSD',
  },
];

export const AmountForm = () => {
  const { set, originNetwork, asset } = useContext(ReceiveContext);

  const [amount, setAmount] = useWeiAmountInput('0');
  const [slippage, setSlippage] = useAmountInput('0.5');

  const [slippageOpen, toggleSlippage] = useReducer(v => !v, false);
  const [policiesOpen, togglePolicies] = useReducer(v => !v, false);

  // todo: replace with real data
  const maxAmount = '12.345';
  const handleMaxButtonClick = useCallback(
    () => setAmount(maxAmount),
    [setAmount],
  );

  const networkName = useMemo(
    () => getNetwork(originNetwork!).label,
    [originNetwork],
  );

  const onContinueClick = useCallback(
    () =>
      set(prevState => ({
        ...prevState,
        step: ReceiveStep.DETAILS,
      })),
    [set],
  );

  return (
    <div className="text-center">
      <Heading type={HeadingType.h2} className="font-medium mb-4">
        {t(translation.title, {
          network: networkName,
          asset: asset.toUpperCase(),
        })}
      </Heading>
      <Paragraph className="mb-8 text-center">
        {t(translation.description__dllr, { asset: asset.toUpperCase() })}
      </Paragraph>

      <FormGroup className="mb-8">
        <div className="w-full flex flex-row justify-between gap-4 items-center mb-1">
          <Paragraph>{t(translation.amount.title)}</Paragraph>

          <MaxButton
            onClick={handleMaxButtonClick}
            value={maxAmount}
            token={asset!}
            dataAttribute="funding-receiver-max"
          />
        </div>
        <AmountInput
          value={amount}
          onChangeText={setAmount}
          placeholder="0.00"
          dataAttribute="funding-receiver-amount"
          label={t(translation.amount.label)}
        />
      </FormGroup>

      <Accordion
        className="mb-8"
        label={t(translation.slippage.title)}
        open={slippageOpen}
        onClick={toggleSlippage}
      >
        <FormGroup>
          <AmountInput
            value={slippage}
            onChangeText={setSlippage}
            placeholder="%"
            dataAttribute="funding-receiver-slippage"
            label={t(translation.slippage.label)}
          />
        </FormGroup>
      </Accordion>

      <Accordion
        className="mb-8"
        label={t(translation.policies.title)}
        open={policiesOpen}
        onClick={togglePolicies}
      >
        <SimpleTable>
          {policies.map(policy => (
            <SimpleTableRow
              key={policy.title}
              label={policy.title}
              value={policy.value}
              className="text-left"
            />
          ))}
        </SimpleTable>
      </Accordion>

      <Heading type={HeadingType.h2} className="text-left mb-2">
        {t(translation.summary.title)}
      </Heading>

      <SimpleTable>
        <SimpleTableRow
          label={t(translation.summary.expectedToReceive)}
          value="500 BUSD"
          className="text-left"
          valueClassName="text-right text-yellow-1"
        />
        <SimpleTableRow
          label={t(translation.summary.minimumReceived)}
          value="500 BUSD"
          className="text-left"
          valueClassName="text-right text-yellow-1"
        />
      </SimpleTable>

      <Button
        onClick={onContinueClick}
        text={t(translations.common.buttons.continue)}
        className="w-full mt-8"
        style={ButtonStyle.secondary}
        dataAttribute="funding-receiver-sender-asset"
      />
    </div>
  );
};

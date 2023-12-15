import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  validate,
  getAddressInfo,
  AddressType,
} from 'bitcoin-address-validation';
import { t } from 'i18next';

import {
  AmountInput,
  Button,
  ButtonStyle,
  ErrorBadge,
  ErrorLevel,
  Heading,
  HeadingType,
  TextArea,
  Paragraph,
  ParagraphSize,
} from '@sovryn/ui';

import { useGetProtocolContract } from '../../../../../../hooks/useGetContract';
import { useMaintenance } from '../../../../../../hooks/useMaintenance';
import { translations } from '../../../../../../locales/i18n';
import { currentNetwork } from '../../../../../../utils/helpers';
import {
  WithdrawBoltzContext,
  WithdrawBoltzStep,
} from '../../../contexts/withdraw-boltz-context';
import {
  BITCOIN,
  BTC_RENDER_PRECISION,
} from '../../../../../../constants/currencies';

enum AddressValidationState {
  NONE = 'NONE',
  LOADING = 'LOADING',
  VALID = 'VALID',
  INVALID = 'INVALID',
}

export const InvoiceForm: React.FC = () => {
  const { amount, invoice, set } = useContext(WithdrawBoltzContext);

  const fastBtcBridgeContract = useGetProtocolContract('fastBtcBridge');

  const { checkMaintenance, States } = useMaintenance();
  const fastBtcLocked = checkMaintenance(States.FASTBTC_SEND);

  const [addressValidationState, setAddressValidationState] = useState(
    AddressValidationState.NONE,
  );
  const [value, setValue] = useState(invoice);

  const invalidInvoice = useMemo(
    () => addressValidationState === AddressValidationState.INVALID,
    [addressValidationState],
  );

  const onContinueClick = useCallback(
    () =>
      set(prevState => ({
        ...prevState,
        invoice: value,
        step: WithdrawBoltzStep.REVIEW,
      })),
    [set, value],
  );

  const validateAddress = useCallback(
    (address: string) => {
      setAddressValidationState(AddressValidationState.LOADING);
      const isValidBtcAddress = validate(address);

      if (!fastBtcBridgeContract) {
        return;
      }

      const isValid = fastBtcBridgeContract.isValidBtcAddress(address);

      if (isValidBtcAddress && isValid) {
        const { type, network } = getAddressInfo(address);
        const isNetworkValid =
          network.toLowerCase() === currentNetwork.toLowerCase();
        const isTypeValid = type.toLowerCase() !== AddressType.p2tr;

        setAddressValidationState(
          isNetworkValid && isTypeValid
            ? AddressValidationState.VALID
            : AddressValidationState.INVALID,
        );
      } else {
        setAddressValidationState(AddressValidationState.INVALID);
      }
    },
    [fastBtcBridgeContract],
  );

  useEffect(() => {
    if (value && value !== '') {
      setAddressValidationState(AddressValidationState.LOADING);
      validateAddress(value);
    } else {
      setAddressValidationState(AddressValidationState.NONE);
    }
  }, [value, validateAddress]);

  const isSubmitDisabled = useMemo(
    () => invalidInvoice || fastBtcLocked || !value || value === '',
    [fastBtcLocked, invalidInvoice, value],
  );

  return (
    <div className="text-center">
      <Heading type={HeadingType.h2} className="font-medium mb-8">
        {t(translations.boltz.send.invoice.title)}
      </Heading>

      <Paragraph
        size={ParagraphSize.small}
        className="font-medium mb-3 text-left"
      >
        {t(translations.boltz.send.invoice.description)}
      </Paragraph>
      <AmountInput
        label={t(translations.common.amount)}
        readOnly
        unit={BITCOIN}
        value={amount}
        decimalPrecision={BTC_RENDER_PRECISION}
        className="max-w-none"
      />

      <div className="mt-4 text-left">
        <Paragraph size={ParagraphSize.base} className="font-medium mb-3">
          {t(translations.boltz.send.invoice.invoiceLabel)}
        </Paragraph>
        <TextArea
          onChangeText={setValue}
          value={value}
          invalid={invalidInvoice}
          className="max-w-none"
          rows={9}
        />
        {invalidInvoice && (
          <ErrorBadge
            level={ErrorLevel.Critical}
            message={t(translations.boltz.send.invoice.invalidInvoice)}
          />
        )}
      </div>

      <Button
        text={t(translations.common.buttons.continue)}
        onClick={onContinueClick}
        disabled={isSubmitDisabled}
        style={ButtonStyle.secondary}
        className="mt-10 w-full"
        dataAttribute="funding-send-address-confirm"
      />

      {fastBtcLocked && (
        <ErrorBadge
          level={ErrorLevel.Warning}
          message={t(translations.maintenanceMode.fastBtc)}
        />
      )}
    </div>
  );
};

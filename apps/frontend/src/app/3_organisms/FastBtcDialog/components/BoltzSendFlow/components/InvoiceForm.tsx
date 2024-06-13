import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

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

import {
  BITCOIN,
  BTC_RENDER_PRECISION,
} from '../../../../../../constants/currencies';
import { useClipboard } from '../../../../../../hooks/useClipboard';
import { useMaintenance } from '../../../../../../hooks/useMaintenance';
import { translations } from '../../../../../../locales/i18n';
import { decimalic } from '../../../../../../utils/math';
import {
  WithdrawBoltzContext,
  WithdrawBoltzStep,
} from '../../../contexts/withdraw-boltz-context';
import { boltz } from '../../../utils/boltz/boltz.client';

enum InvoiceValidationState {
  NONE = 'NONE',
  LOADING = 'LOADING',
  VALID = 'VALID',
  INVALID = 'INVALID',
  EXPIRED = 'EXPIRED',
  BALANCE = 'BALANCE',
}

export const InvoiceForm: React.FC = () => {
  const { amount, invoice, set } = useContext(WithdrawBoltzContext);

  const { checkMaintenance, States } = useMaintenance();
  const boltzLocked = checkMaintenance(States.BOLTZ_SEND);

  const [invoiceValidationState, setInvoiceValidationState] = useState(
    InvoiceValidationState.NONE,
  );
  const [value, setValue] = useState(invoice);

  const invalidInvoice = useMemo(
    () =>
      [
        InvoiceValidationState.INVALID,
        InvoiceValidationState.EXPIRED,
        InvoiceValidationState.BALANCE,
      ].includes(invoiceValidationState),
    [invoiceValidationState],
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

  const validateInvoice = useCallback(
    (invoice: string) => {
      try {
        setInvoiceValidationState(InvoiceValidationState.LOADING);
        const decoded = boltz.decodeInvoice(invoice);
        if (decoded) {
          if ((decoded.expiry ?? 0) < Date.now() / 1000) {
            setInvoiceValidationState(InvoiceValidationState.EXPIRED);
            return;
          }

          if (!decimalic(amount).eq(decimalic(decoded.satoshis).div(1e8))) {
            setInvoiceValidationState(InvoiceValidationState.BALANCE);
            return;
          }

          setInvoiceValidationState(InvoiceValidationState.VALID);
        } else {
          setInvoiceValidationState(InvoiceValidationState.INVALID);
        }
      } catch (e) {
        setInvoiceValidationState(InvoiceValidationState.INVALID);
      }
    },
    [amount],
  );

  useEffect(() => {
    if (value && value !== '') {
      setInvoiceValidationState(InvoiceValidationState.LOADING);
      validateInvoice(value);
    } else {
      setInvoiceValidationState(InvoiceValidationState.NONE);
    }
  }, [value, validateInvoice]);

  const isSubmitDisabled = useMemo(
    () => invalidInvoice || boltzLocked || !value || value === '',
    [boltzLocked, invalidInvoice, value],
  );

  const { write } = useClipboard();

  const handleAmountClick = useCallback(() => write(amount), [amount, write]);

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
      <div onClick={handleAmountClick} className="cursor-pointer">
        <AmountInput
          label={t(translations.common.amount)}
          readOnly
          unit={BITCOIN}
          value={amount}
          decimalPrecision={BTC_RENDER_PRECISION}
          className="max-w-none"
        />
      </div>

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
            message={t(
              translations.boltz.send.invoice.invalidInvoice[
                invoiceValidationState
              ],
            )}
          />
        )}
      </div>

      {boltzLocked ? (
        <ErrorBadge
          level={ErrorLevel.Warning}
          message={t(translations.maintenanceMode.boltz)}
        />
      ) : (
        <Button
          text={t(translations.common.buttons.continue)}
          onClick={onContinueClick}
          disabled={isSubmitDisabled}
          style={ButtonStyle.secondary}
          className="mt-10 w-full"
          dataAttribute="funding-send-address-confirm"
        />
      )}
    </div>
  );
};

import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { getAddressInfo, validate } from 'bitcoin-address-validation';
import { t } from 'i18next';

import {
  Button,
  ButtonStyle,
  ErrorBadge,
  ErrorLevel,
  Heading,
  HeadingType,
  Input,
  Paragraph,
  ParagraphSize,
} from '@sovryn/ui';

import { translations } from '../../../../../../locales/i18n';
import {
  currentBtcNetwork,
  currentNetwork,
} from '../../../../../../utils/helpers';
import {
  AddressValidationState,
  SendFlowStep,
  useSendFlowContext,
} from '../../../contexts/sendflow';
import { useRuneBridgeLocked } from '../../../hooks/useRuneBridgeLocked';

export const AddressForm: React.FC = () => {
  const { address, set, addressValidationState } = useSendFlowContext();
  const runeBridgeLocked = useRuneBridgeLocked();
  const [value, setValue] = useState(address);

  const onContinueClick = useCallback(
    () =>
      set(prevState => ({
        ...prevState,
        address: value,
        step: SendFlowStep.REVIEW,
      })),
    [set, value],
  );
  const invalidAddress = useMemo(
    () => addressValidationState === AddressValidationState.INVALID,
    [addressValidationState],
  );
  const setAddressValidationState = useCallback(
    (state: AddressValidationState) => {
      set(prevState => ({
        ...prevState,
        addressValidationState: state,
      }));
    },
    [set],
  );
  const validateAddress = useCallback(
    (address: string) => {
      setAddressValidationState(AddressValidationState.LOADING);
      const isValidBtcAddress = validate(address, currentBtcNetwork);

      // smart contract side validation could be done here too

      if (isValidBtcAddress) {
        const { network } = getAddressInfo(address);
        const isNetworkValid =
          network.toLowerCase() === currentNetwork.toLowerCase();

        setAddressValidationState(
          isNetworkValid
            ? AddressValidationState.VALID
            : AddressValidationState.INVALID,
        );
      } else {
        setAddressValidationState(AddressValidationState.INVALID);
      }
    },
    [setAddressValidationState],
  );

  useEffect(() => {
    if (value && value !== '') {
      setAddressValidationState(AddressValidationState.LOADING);
      validateAddress(value);
    } else {
      setAddressValidationState(AddressValidationState.NONE);
    }
  }, [value, validateAddress, setAddressValidationState]);
  const isSubmitDisabled = useMemo(
    () => invalidAddress || runeBridgeLocked || !value || value === '',
    [runeBridgeLocked, invalidAddress, value],
  );

  return (
    <div className="text-center">
      <Heading type={HeadingType.h2} className="font-medium mb-8">
        {t(translations.runeBridge.send.addressForm.title)}
      </Heading>

      <div className="text-left">
        <Paragraph size={ParagraphSize.base} className="font-medium mb-3">
          {t(translations.runeBridge.send.addressForm.addressLabel)}
        </Paragraph>
        <Input
          onChangeText={setValue}
          value={value}
          invalid={invalidAddress}
          className="max-w-none"
        />
        {invalidAddress && (
          <ErrorBadge
            level={ErrorLevel.Critical}
            message={t(translations.runeBridge.send.addressForm.invalidAddress)}
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

      {runeBridgeLocked && (
        <ErrorBadge
          level={ErrorLevel.Warning}
          message={t(translations.maintenanceMode.runeBridge)}
        />
      )}
    </div>
  );
};

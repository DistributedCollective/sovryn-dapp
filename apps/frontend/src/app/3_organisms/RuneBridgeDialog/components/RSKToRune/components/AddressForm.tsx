import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  AddressType,
  getAddressInfo,
  validate,
} from 'bitcoin-address-validation';
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

import { useGetProtocolContract } from '../../../../../../hooks/useGetContract';
import { useMaintenance } from '../../../../../../hooks/useMaintenance';
import { translations } from '../../../../../../locales/i18n';
import {
  currentBTCNetwork,
  currentNetwork,
} from '../../../../../../utils/helpers';
import {
  AddressValidationState,
  SendFlowContext,
  SendFlowStep,
} from '../../../contexts/sendflow';

export const AddressForm: React.FC = () => {
  const { address, set, addressValidationState } = useContext(SendFlowContext);
  const { checkMaintenance, States } = useMaintenance();
  const fastBtcLocked = checkMaintenance(States.FASTBTC_SEND);
  const fastBtcBridgeContract = useGetProtocolContract('fastBtcBridge');
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
      const isValidBtcAddress = validate(address, currentBTCNetwork);

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
    [fastBtcBridgeContract, setAddressValidationState],
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
    () => invalidAddress || fastBtcLocked || !value || value === '',
    [fastBtcLocked, invalidAddress, value],
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

      {fastBtcLocked && (
        <ErrorBadge
          level={ErrorLevel.Warning}
          message={t(translations.maintenanceMode.fastBtc)}
        />
      )}
    </div>
  );
};

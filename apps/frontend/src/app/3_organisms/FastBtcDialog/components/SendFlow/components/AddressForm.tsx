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
import debounce from 'lodash.debounce';

import {
  Button,
  ButtonStyle,
  Heading,
  HeadingType,
  Input,
  Paragraph,
  ParagraphSize,
} from '@sovryn/ui';

import { useGetProtocolContract } from '../../../../../../hooks/useGetContract';
import { useMaintenance } from '../../../../../../hooks/useMaintenance';
import { translations } from '../../../../../../locales/i18n';
import { currentNetwork } from '../../../../../../utils/helpers';
import {
  WithdrawContext,
  WithdrawStep,
} from '../../../contexts/withdraw-context';

enum AddressValidationState {
  NONE,
  LOADING,
  VALID,
  INVALID,
}

export const AddressForm: React.FC = () => {
  const { address, set } = useContext(WithdrawContext);

  const fastBtcBridgeContract = useGetProtocolContract('fastBtcBridge');

  const { checkMaintenance, States } = useMaintenance();
  const fastBtcLocked = checkMaintenance(States.FASTBTC);

  const [addressValidationState, setAddressValidationState] = useState(
    AddressValidationState.NONE,
  );
  const [value, setValue] = useState(address);

  const invalid = useMemo(
    () => addressValidationState === AddressValidationState.INVALID,
    [addressValidationState],
  );

  const onContinueClick = useCallback(
    () =>
      set(prevState => ({
        ...prevState,
        address: value,
        step: WithdrawStep.REVIEW,
      })),
    [set, value],
  );

  const validateAddress = useCallback(
    async (address: string) => {
      setAddressValidationState(AddressValidationState.LOADING);
      let result = false;
      const isValidBtcAddress = validate(address);

      if (!fastBtcBridgeContract) {
        return;
      }
      const isValid = fastBtcBridgeContract.isValidBtcAddress(address);

      if (isValidBtcAddress && isValid) {
        const { network, type } = getAddressInfo(address);
        if (
          network.toLowerCase() === currentNetwork.toLowerCase() &&
          type.toLowerCase() !== AddressType.p2tr
        ) {
          result = true;
        }
      }

      setAddressValidationState(
        result ? AddressValidationState.VALID : AddressValidationState.INVALID,
      );
    },
    [fastBtcBridgeContract],
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const delayedOnChange = useCallback(
    debounce(addressToValidate => validateAddress(addressToValidate), 300),
    [validateAddress],
  );

  useEffect(() => {
    if (value) {
      setAddressValidationState(AddressValidationState.NONE);
      delayedOnChange(value);
    }
  }, [delayedOnChange, value]);

  const isSubmitDisabled = useMemo(
    () => invalid || fastBtcLocked || !value || value === '',
    [fastBtcLocked, invalid, value],
  );

  return (
    <div className="text-center">
      <Heading type={HeadingType.h2} className="font-medium mb-8">
        {t(translations.fastBtc.send.addressForm.title)}
      </Heading>

      <div className="text-left">
        <Paragraph size={ParagraphSize.base} className="font-medium mb-3">
          {t(translations.fastBtc.send.addressForm.addressLabel)}
        </Paragraph>

        <Input onChangeText={setValue} value={value} className="max-w-none" />
      </div>

      <Button
        text={t(translations.common.buttons.continue)}
        onClick={onContinueClick}
        disabled={isSubmitDisabled}
        style={ButtonStyle.secondary}
        className="mt-10 w-full"
        dataAttribute="funding-send-address-confirm"
      />

      {fastBtcLocked && <div>{t(translations.maintenanceMode.fastBtc)}</div>}
    </div>
  );
};

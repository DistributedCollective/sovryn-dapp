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
import debounce from 'lodash.debounce';

import { Button, FormGroup, Heading, Input } from '@sovryn/ui';

import { useGetProtocolContract } from '../../../../../../hooks/useGetContract';
import { useMaintenance } from '../../../../../../hooks/useMaintenance';
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

  return (
    <>
      <Heading>Enter recipient's bitcoin address</Heading>

      <FormGroup label="Address">
        <Input onChangeText={setValue} />
      </FormGroup>

      <Button
        text="Continue"
        onClick={onContinueClick}
        disabled={invalid || fastBtcLocked}
      />
      {fastBtcLocked && <div>Fast BTC is in maintenance mode</div>}
    </>
  );
};

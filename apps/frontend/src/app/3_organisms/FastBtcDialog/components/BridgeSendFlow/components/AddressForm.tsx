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
import { Trans } from 'react-i18next';

import {
  Button,
  ButtonStyle,
  Checkbox,
  ErrorBadge,
  ErrorLevel,
  Heading,
  HeadingType,
  Input,
  Link,
  Paragraph,
  ParagraphSize,
} from '@sovryn/ui';

import { WIKI_LINKS } from '../../../../../../constants/links';
import { useGetProtocolContract } from '../../../../../../hooks/useGetContract';
import { useMaintenance } from '../../../../../../hooks/useMaintenance';
import { translations } from '../../../../../../locales/i18n';
import { currentNetwork } from '../../../../../../utils/helpers';
import { SendContext, SendStep } from '../../../contexts/send-context';
import { getNetwork } from '../../../utils/networks';

enum AddressValidationState {
  NONE,
  LOADING,
  VALID,
  INVALID,
}

const translation = translations.fastBtc.send.addressForm;

export const AddressForm: React.FC = () => {
  const { address, set, originNetwork } = useContext(SendContext);
  const [isConfirmed, setIsConfirmed] = useState(false);

  const networkName = useMemo(
    () => getNetwork(originNetwork!).label,
    [originNetwork],
  );

  const fastBtcBridgeContract = useGetProtocolContract('fastBtcBridge');

  const { checkMaintenance, States } = useMaintenance();
  const fastBtcLocked = checkMaintenance(States.FASTBTC_SEND);

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
        step: SendStep.SENDER_ASSET,
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
        {t(translation.title, {
          network: networkName,
        })}
      </Heading>

      <div className="text-left">
        <Paragraph size={ParagraphSize.base} className="font-medium mb-3">
          {t(translation.addressLabel)}
        </Paragraph>

        <Input
          onChangeText={setValue}
          value={value}
          placeholder={t(translation.addressPlaceholder)}
          className="max-w-none"
        />

        <div className="mt-4">
          <Checkbox
            label={
              <Trans
                i18nKey={translation.confirmationLabel}
                components={[
                  <Link
                    text={t(translation.confirmationLabelCTA)}
                    href={WIKI_LINKS.BRIDGE_ADDRESS}
                  />,
                ]}
              />
            }
            checked={isConfirmed}
            onChange={() => setIsConfirmed(!isConfirmed)}
            dataAttribute="funding-send-address-confirm-checkbox"
          />
        </div>
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

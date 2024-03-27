import React, { useCallback, useContext, useMemo, useState } from 'react';

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

import { useMaintenance } from '../../../../../../hooks/useMaintenance';
import { translations } from '../../../../../../locales/i18n';
import { SendFlowContext, SendFlowStep } from '../../../contexts/sendflow';

export const AddressForm: React.FC = () => {
  const { address, set } = useContext(SendFlowContext);
  const { checkMaintenance, States } = useMaintenance();
  const fastBtcLocked = checkMaintenance(States.FASTBTC_SEND);

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

  const isSubmitDisabled = useMemo(() => !value || value === '', [value]);

  return (
    <div className="text-center">
      <Heading type={HeadingType.h2} className="font-medium mb-8">
        {t(translations.fastBtc.send.addressForm.title)}
      </Heading>

      <div className="text-left">
        <Paragraph size={ParagraphSize.base} className="font-medium mb-3">
          {t(translations.runeBridge.send.addressForm.addressLabel)}
        </Paragraph>
        <Input
          onChangeText={setValue}
          value={value}
          // invalid={invalidAddress}
          className="max-w-none"
        />
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

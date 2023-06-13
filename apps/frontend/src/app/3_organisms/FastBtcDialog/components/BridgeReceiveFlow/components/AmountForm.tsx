import React, { useCallback, useContext, useMemo } from 'react';

import { t } from 'i18next';

import { Button, ButtonStyle, Heading, HeadingType } from '@sovryn/ui';

import { translations } from '../../../../../../locales/i18n';
import { ReceiveContext } from '../../../contexts/receive-context';
import { getNetwork } from '../utils/networks';

export const AmountForm = () => {
  const { set, originNetwork, asset } = useContext(ReceiveContext);

  const networkName = useMemo(
    () => getNetwork(originNetwork!).label,
    [originNetwork],
  );

  const onContinueClick = useCallback(
    () =>
      set(prevState => ({
        ...prevState,
      })),
    [set],
  );

  return (
    <div className="text-center">
      <Heading type={HeadingType.h2} className="font-medium mb-8">
        Enter amount of {networkName} {asset} to Rootstock
      </Heading>

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

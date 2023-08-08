import React, { FC, useMemo } from 'react';

import { ethers } from 'ethers';
import { t } from 'i18next';

import { TxIdWithNotification } from '../../../../../2_molecules/TxIdWithNotification/TransactionIdWithNotification';
import { useAccount } from '../../../../../../hooks/useAccount';
import { translations } from '../../../../../../locales/i18n';
import {
  areAddressesEqual,
  getRskExplorerUrl,
} from '../../../../../../utils/helpers';
import { VestingContractTableRecord } from '../VestingStakesFrame.types';

const rskExplorerUrl = getRskExplorerUrl();

export const DelegateAddressCellRenderer: FC<VestingContractTableRecord> = ({
  delegate,
}) => {
  const { account } = useAccount();
  const renderAddress = useMemo(() => {
    if (
      !delegate ||
      areAddressesEqual(delegate, account) ||
      areAddressesEqual(delegate, ethers.constants.AddressZero)
    ) {
      return t(translations.common.na);
    }

    return (
      <TxIdWithNotification
        value={delegate}
        href={`${rskExplorerUrl}/address/${delegate}`}
      />
    );
  }, [delegate, account]);

  return <>{renderAddress}</>;
};

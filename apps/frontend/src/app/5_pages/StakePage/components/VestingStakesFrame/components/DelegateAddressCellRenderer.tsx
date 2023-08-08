import React, { FC, useMemo } from 'react';

import { t } from 'i18next';

import { TxIdWithNotification } from '../../../../../2_molecules/TxIdWithNotification/TransactionIdWithNotification';
import { useAccount } from '../../../../../../hooks/useAccount';
import { translations } from '../../../../../../locales/i18n';
import {
  areAddressesEqual,
  getRskExplorerUrl,
} from '../../../../../../utils/helpers';
import { Vesting } from '../VestingStakesFrame.types';
import { useGetVestingDelegateAddress } from '../hooks/useGetVestingDelegateAddress';
import { useGetVestingStakeStartEndDates } from '../hooks/useGetVestingStakeStartEndDates';

const rskExplorerUrl = getRskExplorerUrl();

export const DelegateAddressCellRenderer: FC<Vesting> = ({
  vestingContract,
}) => {
  const { account } = useAccount();
  const { endDate } = useGetVestingStakeStartEndDates(vestingContract);
  const delegatedAddress = useGetVestingDelegateAddress(
    vestingContract,
    Number(endDate),
  );

  const renderAddress = useMemo(() => {
    if (!delegatedAddress || areAddressesEqual(delegatedAddress, account)) {
      return t(translations.common.na);
    }

    return (
      <TxIdWithNotification
        value={delegatedAddress}
        href={`${rskExplorerUrl}/address/${delegatedAddress}`}
      />
    );
  }, [delegatedAddress, account]);

  return <>{renderAddress}</>;
};

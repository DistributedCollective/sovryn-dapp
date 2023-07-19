import React, { useCallback, useMemo, useState } from 'react';

import classNames from 'classnames';
import dayjs from 'dayjs';
import { t } from 'i18next';

import { SupportedTokens } from '@sovryn/contracts';
import {
  Button,
  ButtonStyle,
  ButtonType,
  Dialog,
  DialogBody,
  DialogHeader,
  Pagination,
  Paragraph,
  ParagraphSize,
  TransactionId,
} from '@sovryn/ui';
import { Decimal } from '@sovryn/utils';

import { AmountRenderer } from '../../../../2_molecules/AmountRenderer/AmountRenderer';
import { AssetValue } from '../../../../2_molecules/AssetValue/AssetValue';
import {
  SOV,
  TOKEN_RENDER_PRECISION,
} from '../../../../../constants/currencies';
import { DEFAULT_HISTORY_FRAME_PAGE_SIZE } from '../../../../../constants/general';
import { translations } from '../../../../../locales/i18n';
import { VestingContractType } from '../../../../../utils/graphql/rsk/generated';
import { getRskExplorerUrl } from '../../../../../utils/helpers';
import {
  VestingContractTableRecord,
  VestingHistoryItem,
} from './Vesting.types';
import { useGetUnlockSchedule } from './hooks/useGetUnlockSchedule';
import { useGetUnlockedBalance } from './hooks/useGetUnlockedBalance';
import { useHandleWithdraw } from './hooks/useHandleWithdraw';

const rskExplorerUrl = getRskExplorerUrl();

export const renderBalance = (balance: string | undefined) => {
  if (!balance || balance === '') {
    return '-';
  }

  return (
    <AmountRenderer
      value={balance}
      suffix={SOV}
      precision={TOKEN_RENDER_PRECISION}
      dataAttribute="vesting-rewards-current-balance"
    />
  );
};

export const renderContractAddress = (item: VestingContractTableRecord) => (
  <TransactionId
    href={`${rskExplorerUrl}/address/${item.address}`}
    value={item.address}
    dataAttribute="vesting-rewards-address"
  />
);

export const UnlockedBalance = (item: VestingContractTableRecord) => {
  const { loading, result } = useGetUnlockedBalance(item);

  if (loading) {
    return <span>Calculating...</span>;
  }

  return (
    <AmountRenderer
      value={result}
      suffix={SOV}
      precision={TOKEN_RENDER_PRECISION}
      dataAttribute="vesting-rewards-unlocked-balance"
    />
  );
};

export const Withdraw = (item: VestingContractTableRecord) => {
  const handleWithdraw = useHandleWithdraw(item);

  return (
    <Button
      onClick={handleWithdraw}
      text={t(translations.common.buttons.withdraw)}
      type={ButtonType.button}
      style={ButtonStyle.secondary}
    />
  );
};

const vestingTypeMapping = (item: VestingContractType) => {
  switch (item) {
    case VestingContractType.Team:
      return 'Team';
    case VestingContractType.Rewards:
      return 'Liquidity mining';
    case VestingContractType.FourYearVesting:
      return 'Investor';
    default:
      return item;
  }
};

export const UnlockSchedule = (item: VestingContractTableRecord) => {
  const unlockSchedule = useGetUnlockSchedule(item);
  const [showDialog, setShowDialog] = useState(false);
  const title = useMemo(() => vestingTypeMapping(item.type), [item.type]);

  return (
    <>
      <Button
        text={title}
        style={ButtonStyle.ghost}
        type={ButtonType.button}
        className="underline"
        onClick={() => setShowDialog(prevValue => !prevValue)}
      />
      <UnlockScheduleDialog
        vestingContract={item}
        unlockSchedule={unlockSchedule}
        isOpen={showDialog}
        onClose={() => setShowDialog(false)}
      />
    </>
  );
};

type UnlockScheduleDialogProps = {
  vestingContract: VestingContractTableRecord;
  unlockSchedule?: VestingHistoryItem[];
  isOpen: boolean;
  onClose: () => void;
};

const pageSize = DEFAULT_HISTORY_FRAME_PAGE_SIZE;

const UnlockScheduleDialog: React.FC<UnlockScheduleDialogProps> = ({
  vestingContract,
  unlockSchedule,
  isOpen,
  onClose,
}) => {
  const [page, setPage] = useState(0);

  const onPageChange = useCallback(
    (value: number) => {
      if (
        !unlockSchedule ||
        (unlockSchedule?.length < pageSize && value > page)
      ) {
        return;
      }
      setPage(value);
    },
    [page, unlockSchedule],
  );

  const formattedSchedule = useMemo(() => {
    if (!unlockSchedule) {
      return null;
    }

    return unlockSchedule?.map(item => ({
      date: dayjs.unix(item.lockedUntil!).format('YYYY-MM-DD'),
      amount: item.amount,
      isUnlocked: item.isUnlocked,
    }));
  }, [unlockSchedule]);

  const isDialogOpen = useMemo(
    () => isOpen && !!unlockSchedule,
    [isOpen, unlockSchedule],
  );

  const paginatedItems = useMemo(
    () => formattedSchedule?.slice(page * pageSize, (page + 1) * pageSize),
    [formattedSchedule, page],
  );

  const isNextButtonDisabled = useMemo(
    () => paginatedItems && paginatedItems?.length < pageSize,
    [paginatedItems],
  );

  return (
    <Dialog isOpen={isDialogOpen} disableFocusTrap>
      <DialogHeader title={'Vesting schedule'} onClose={onClose} />

      <DialogBody>
        <>
          <div className="bg-gray-70 px-4 py-2 rounded flex justify-between">
            <div className="text-gray-30">Contract address:</div>
            {renderContractAddress(vestingContract)}
          </div>

          <div>
            <div className="flex justify-between px-4 mt-8 mb-2">
              <div className="font-medium">Date</div>
              <div className="font-medium">Amount</div>
            </div>
            <div className="bg-gray-70 pl-4 py-2 pr-2 rounded">
              {paginatedItems?.map((item, index) => {
                const isTheClosestUnlockDate =
                  page === 0 &&
                  ((index === 0 && !item.isUnlocked) ||
                    (index > 0 &&
                      paginatedItems[index - 1].isUnlocked &&
                      !item.isUnlocked));

                return (
                  <div
                    className={classNames('flex justify-between py-1', {
                      'text-gray-40': item.isUnlocked,
                      'font-bold': isTheClosestUnlockDate,
                    })}
                    key={item.date}
                  >
                    <div>{item.date}</div>
                    <div>
                      <AssetValue
                        value={Decimal.from(item.amount)}
                        asset={SupportedTokens.sov}
                        assetClassName={classNames({
                          'font-bold': isTheClosestUnlockDate,
                          'font-normal': !isTheClosestUnlockDate,
                        })}
                        containerClassName="flex"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-gray-70 px-4 py-2 rounded flex justify-between mt-6">
            <div className="text-gray-30">Total:</div>
            {renderBalance(vestingContract.currentBalance)}
          </div>

          <Pagination
            page={page}
            className="lg:pb-6 mt-8 justify-center"
            onChange={onPageChange}
            itemsPerPage={pageSize}
            totalItems={formattedSchedule?.length}
            isNextButtonDisabled={isNextButtonDisabled}
            dataAttribute="conversions-history-pagination"
          />
        </>
      </DialogBody>
    </Dialog>
  );
};

export const generateRowTitle = (item: VestingContractTableRecord) => (
  <Paragraph size={ParagraphSize.small} className="text-left">
    {item.type}
    {' - '}
    {renderBalance(item.currentBalance)}
  </Paragraph>
);

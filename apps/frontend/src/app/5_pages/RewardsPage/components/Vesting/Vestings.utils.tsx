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

export const UnlockSchedule = (item: VestingContractTableRecord) => {
  const unlockSchedule = useGetUnlockSchedule(item);
  const [showDialog, setShowDialog] = useState(false);

  return (
    <>
      <Button
        text={item.type}
        style={ButtonStyle.ghost}
        type={ButtonType.button}
        className="underline"
        onClick={() => setShowDialog(prevValue => !prevValue)}
      />
      <UnlockScheduleDialog
        unlockSchedule={unlockSchedule}
        isOpen={showDialog}
        onClose={() => setShowDialog(false)}
      />
    </>
  );
};

type UnlockScheduleDialogProps = {
  unlockSchedule?: VestingHistoryItem[];
  isOpen: boolean;
  onClose: () => void;
};

const pageSize = DEFAULT_HISTORY_FRAME_PAGE_SIZE;

const UnlockScheduleDialog: React.FC<UnlockScheduleDialogProps> = ({
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
    <Dialog isOpen={isDialogOpen}>
      <DialogHeader title={'Vesting schedule'} onClose={onClose} />

      <DialogBody>
        <div>
          <div className="flex justify-between px-2">
            <div>Date</div>
            <div>Amount</div>
          </div>
          <div className="bg-gray-70 px-4 py-3 rounded">
            {paginatedItems?.map(item => (
              <div
                className={classNames('flex justify-between py-1', {
                  'text-gray-30': item.isUnlocked,
                })}
                key={item.date}
              >
                <div>{item.date}</div>
                <div>
                  <AssetValue
                    value={Decimal.from(item.amount)}
                    asset={SupportedTokens.sov}
                    assetClassName="font-normal"
                    containerClassName="flex"
                  />
                </div>
              </div>
            ))}
          </div>

          <Pagination
            page={page}
            className="lg:pb-6 mt-3 lg:mt-6 justify-center"
            onChange={onPageChange}
            itemsPerPage={pageSize}
            totalItems={formattedSchedule?.length}
            isNextButtonDisabled={isNextButtonDisabled}
            dataAttribute="conversions-history-pagination"
          />
        </div>
      </DialogBody>
    </Dialog>
  );
};

export const renderContractAddress = (item: VestingContractTableRecord) => (
  <TransactionId
    href={`${rskExplorerUrl}/address/${item.address}`}
    value={item.address}
    dataAttribute="vesting-rewards-address"
  />
);

export const generateRowTitle = (item: VestingContractTableRecord) => (
  <Paragraph size={ParagraphSize.small} className="text-left">
    {item.type}
    {' - '}
    {renderBalance(item.currentBalance)}
  </Paragraph>
);

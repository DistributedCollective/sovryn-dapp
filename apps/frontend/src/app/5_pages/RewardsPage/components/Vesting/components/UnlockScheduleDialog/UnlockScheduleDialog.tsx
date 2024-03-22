import React, { useCallback, useMemo, useState } from 'react';

import classNames from 'classnames';
import dayjs from 'dayjs';
import { t } from 'i18next';

import { Dialog, DialogHeader, DialogBody, Pagination } from '@sovryn/ui';
import { Decimal } from '@sovryn/utils';

import { AssetValue } from '../../../../../../2_molecules/AssetValue/AssetValue';
import { DEFAULT_HISTORY_FRAME_PAGE_SIZE } from '../../../../../../../constants/general';
import { translations } from '../../../../../../../locales/i18n';
import {
  VestingContractTableRecord,
  VestingHistoryItem,
} from '../../Vesting.types';
import { renderContractAddress, renderBalance } from '../../Vestings.utils';
import { COMMON_SYMBOLS } from '../../../../../../../utils/asset';

type UnlockScheduleDialogProps = {
  vestingContract: VestingContractTableRecord;
  unlockSchedule?: VestingHistoryItem[];
  isOpen: boolean;
  onClose: () => void;
};

const pageSize = DEFAULT_HISTORY_FRAME_PAGE_SIZE;

export const UnlockScheduleDialog: React.FC<UnlockScheduleDialogProps> = ({
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
      <DialogHeader
        title={t(translations.rewardPage.vesting.unlockScheduleDialog.title)}
        onClose={onClose}
      />

      <DialogBody>
        <>
          <div className="bg-gray-70 px-4 py-2 rounded flex justify-between">
            <div className="text-gray-30">
              {t(
                translations.rewardPage.vesting.unlockScheduleDialog
                  .contractAddress,
              )}
            </div>
            {renderContractAddress(vestingContract)}
          </div>

          <div>
            <div className="flex justify-between px-4 mt-8 mb-2">
              <div className="font-medium">
                {t(translations.rewardPage.vesting.unlockScheduleDialog.date)}
              </div>
              <div className="font-medium">
                {t(translations.rewardPage.vesting.unlockScheduleDialog.amount)}
              </div>
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
                        asset={COMMON_SYMBOLS.SOV}
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
            <div className="text-gray-30">
              {t(translations.rewardPage.vesting.unlockScheduleDialog.total)}
            </div>
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

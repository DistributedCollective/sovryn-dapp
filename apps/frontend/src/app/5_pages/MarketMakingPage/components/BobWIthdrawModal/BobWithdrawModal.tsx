import React, { FC, useCallback, useState } from 'react';

import { t } from 'i18next';

import {
  Button,
  ButtonStyle,
  ButtonType,
  Dialog,
  DialogBody,
  DialogHeader,
} from '@sovryn/ui';
import { Decimal } from '@sovryn/utils';

import { CurrentStatistics } from '../../../../2_molecules/CurrentStatistics/CurrentStatistics';
import { translations } from '../../../../../locales/i18n';
import { COMMON_SYMBOLS } from '../../../../../utils/asset';
import { AmmLiquidityPoolDictionary } from '../../utils/AmmLiquidityPoolDictionary';
import { CurrentBalance } from '../PoolsTable/components/CurrentBalance/CurrentBalance';
import { PoolsTableReturns } from '../PoolsTable/components/PoolsTableReturns/PoolsTableReturns';
import { AmountForm } from './components/AmountForm/AmountForm';
import { NewPoolStatistics } from './components/NewPoolStatistics/NewPoolStatistics';

const pageTranslations = translations.bobMarketMakingPage.withdrawModal;

// TODO: This will be a prop and will likely use a different set of pools
const POOL = AmmLiquidityPoolDictionary.list().filter(
  pool => pool.assetA === COMMON_SYMBOLS.SOV,
)[0];

// TODO: Hardcoded, we will need to query it
const BALANCE_A = Decimal.from(1500);
const BALANCE_B = Decimal.from(0.06);

type BobWithdrawModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const BobWithdrawModal: FC<BobWithdrawModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [withdrawAmount, setWithdrawAmount] = useState(Decimal.ZERO);
  const [secondaryWithdrawAmount, setSecondaryWithdrawAmount] = useState(
    Decimal.ZERO,
  );

  const submitHandler = useCallback(() => {
    console.log(
      `Withdrawing ${withdrawAmount} ${POOL.assetA} and ${secondaryWithdrawAmount} ${POOL.assetB}`,
    );
  }, [secondaryWithdrawAmount, withdrawAmount]);

  return (
    <Dialog disableFocusTrap isOpen={isOpen}>
      <DialogHeader title={t(pageTranslations.title)} onClose={onClose} />
      <DialogBody>
        <div className="bg-gray-90 p-4 rounded">
          <CurrentStatistics
            symbol={POOL.assetA}
            symbol2={POOL.assetB}
            label1={t(pageTranslations.returnRate)}
            label2={t(pageTranslations.currentBalance)}
            value1={
              <PoolsTableReturns
                className="text-xs font-semibold"
                pool={POOL}
              />
            }
            value2={
              <CurrentBalance
                pool={POOL}
                balanceA={BALANCE_A}
                balanceB={BALANCE_B}
              />
            }
          />
        </div>

        <AmountForm
          primaryTokenBalance={BALANCE_A}
          secondaryTokenBalance={BALANCE_B}
          withdrawAmount={withdrawAmount}
          secondaryWithdrawAmount={secondaryWithdrawAmount}
          setWithdrawAmount={setWithdrawAmount}
          setSecondaryWithdrawAmount={setSecondaryWithdrawAmount}
          pool={POOL}
        />

        <NewPoolStatistics pool={POOL} />

        <Button
          type={ButtonType.submit}
          style={ButtonStyle.primary}
          text={t(translations.common.buttons.confirm)}
          className="w-full mt-6"
          onClick={submitHandler}
          dataAttribute="withdraw-liquidity-confirm-button"
          disabled={false}
        />
      </DialogBody>
    </Dialog>
  );
};

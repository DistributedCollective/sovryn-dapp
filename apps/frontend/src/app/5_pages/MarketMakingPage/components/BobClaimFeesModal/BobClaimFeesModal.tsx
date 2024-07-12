import React, { FC, useMemo } from 'react';

import { t } from 'i18next';

import {
  Button,
  ButtonStyle,
  ButtonType,
  Dialog,
  DialogBody,
  DialogHeader,
  SimpleTable,
  SimpleTableRow,
} from '@sovryn/ui';

import { AmountRenderer } from '../../../../2_molecules/AmountRenderer/AmountRenderer';
import { CurrentStatistics } from '../../../../2_molecules/CurrentStatistics/CurrentStatistics';
import { useMaintenance } from '../../../../../hooks/useMaintenance';
import { translations } from '../../../../../locales/i18n';
import { AmbientPosition } from '../AmbientMarketMaking/AmbientMarketMaking.types';
import { AmbientLiquidityPool } from '../AmbientMarketMaking/utils/AmbientLiquidityPool';
import { DEFAULT_SLIPPAGE } from '../BobDepositModal/BobDepositModal.constants';
import { useGetPoolInfo } from '../BobDepositModal/hooks/useGetPoolInfo';
import { useGetTokenDecimals } from '../BobWIthdrawModal/hooks/useGetTokenDecimals';
import { useHandleSubmit } from './hooks/useHandleSubmit';

type BobClaimFeesModalProps = {
  isOpen: boolean;
  onClose: () => void;
  pool: AmbientLiquidityPool;
  position: AmbientPosition;
};

const pageTranslations = translations.bobMarketMakingPage.claimFeesModal;

export const BobClaimFeesModal: FC<BobClaimFeesModalProps> = ({
  isOpen,
  onClose,
  pool,
  position,
}) => {
  const { base, quote } = useMemo(() => pool, [pool]);
  const { spotPrice, poolTokens } = useGetPoolInfo(pool.base, pool.quote);

  const { baseTokenDecimals, quoteTokenDecimals } = useGetTokenDecimals(
    poolTokens?.tokenA,
    poolTokens?.tokenB,
  );
  const { checkMaintenance, States } = useMaintenance();
  const claimLocked = checkMaintenance(States.BOB_CLAIM_AMM_FEES);

  const handleSubmit = useHandleSubmit(pool, position, onClose);

  const feesBase = useMemo(() => {
    if (!spotPrice || !baseTokenDecimals || !position.rewardLiq) {
      return 0;
    }
    return (
      (Number(position.rewardLiq) * Math.sqrt(spotPrice)) /
      Math.pow(10, baseTokenDecimals)
    );
  }, [position, spotPrice, baseTokenDecimals]);

  const feesQuote = useMemo(() => {
    if (!spotPrice || !quoteTokenDecimals || !position.rewardLiq) {
      return 0;
    }
    return (
      Number(position.rewardLiq) /
      Math.sqrt(spotPrice) /
      Math.pow(10, quoteTokenDecimals)
    );
  }, [position, spotPrice, quoteTokenDecimals]);

  return (
    <>
      <Dialog disableFocusTrap isOpen={isOpen}>
        <DialogHeader title={t(pageTranslations.title)} onClose={onClose} />
        <DialogBody>
          <div className="bg-gray-90 p-4 rounded">
            <CurrentStatistics
              symbol={base}
              symbol2={quote}
              className="flex justify-between"
            />
          </div>

          <SimpleTable className="mt-6">
            <SimpleTableRow
              label={t(pageTranslations.earnedToken, {
                token: base,
              })}
              value={<AmountRenderer value={feesBase} />}
            />
            <SimpleTableRow
              label={t(pageTranslations.earnedToken, {
                token: quote,
              })}
              value={<AmountRenderer value={feesQuote} />}
            />
          </SimpleTable>

          <SimpleTable className="mt-6">
            <SimpleTableRow
              label={t(pageTranslations.slippage)}
              value={<AmountRenderer value={DEFAULT_SLIPPAGE} suffix="%" />}
            />
          </SimpleTable>

          <Button
            type={ButtonType.submit}
            style={ButtonStyle.primary}
            text={t(translations.common.buttons.confirm)}
            className="w-full mt-6"
            onClick={handleSubmit}
            dataAttribute="claim-fees-confirm-button"
            disabled={claimLocked}
          />
        </DialogBody>
      </Dialog>
    </>
  );
};

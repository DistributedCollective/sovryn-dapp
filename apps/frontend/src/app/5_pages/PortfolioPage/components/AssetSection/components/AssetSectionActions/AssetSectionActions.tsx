import React, { FC, useCallback, useMemo } from 'react';

import { t } from 'i18next';
import { useNavigate } from 'react-router-dom';

import { SupportedTokens } from '@sovryn/contracts';
import { Button, ButtonStyle, Paragraph } from '@sovryn/ui';

import { ReactComponent as ConvertIcon } from '../../../../../../../assets/images/convert.svg';
import { ReactComponent as DepositIcon } from '../../../../../../../assets/images/deposit.svg';
import { ReactComponent as WithdrawIcon } from '../../../../../../../assets/images/withdraw.svg';
import { useAccount } from '../../../../../../../hooks/useAccount';
import { useAssetBalance } from '../../../../../../../hooks/useAssetBalance';
import { translations } from '../../../../../../../locales/i18n';
import { sharedState } from '../../../../../../../store/rxjs/shared-state';

export const AssetSectionActions: FC = () => {
  const navigate = useNavigate();
  const { account } = useAccount();

  const { balance } = useAssetBalance(SupportedTokens.rbtc);
  const hasRbtcBalance = useMemo(() => Number(balance) !== 0, [balance]);

  const handleFundWallet = useCallback(
    () => sharedState.actions.openFastBtcDialog(!hasRbtcBalance),
    [hasRbtcBalance],
  );

  const handleWithdraw = useCallback(
    () => sharedState.actions.openFastBtcDialog(false, 1),
    [],
  );

  const isRbtcWithdrawalAllowed = useMemo(
    () => hasRbtcBalance && account,
    [hasRbtcBalance, account],
  );

  return (
    <>
      <div className="flex md:hidden w-full justify-center items-center gap-8 my-4">
        <div className="flex flex-col gap-3 items-center">
          <button
            onClick={handleFundWallet}
            className="bg-gray-70 w-12 h-12 rounded flex items-center justify-center"
          >
            <DepositIcon />
          </button>
          <Paragraph>
            {t(translations.portfolioPage.assetSection.fundWallet)}
          </Paragraph>
        </div>
        <div className="flex flex-col gap-3 items-center">
          <button
            onClick={() => navigate('/convert?&to=sov')}
            className="bg-gray-70 w-12 h-12 rounded flex items-center justify-center"
          >
            <ConvertIcon />
          </button>
          <Paragraph>
            {t(translations.portfolioPage.assetSection.convert)}
          </Paragraph>
        </div>
        {isRbtcWithdrawalAllowed && (
          <div className="flex flex-col gap-3 items-center">
            <button
              onClick={handleWithdraw}
              className="bg-gray-70 w-12 h-12 rounded flex items-center justify-center"
            >
              <WithdrawIcon />
            </button>
            <Paragraph>
              {t(translations.portfolioPage.assetSection.withdraw)}
            </Paragraph>
          </div>
        )}
      </div>
      <div className="hidden md:flex items-center gap-4 mt-4 mb-6">
        <Button
          className="w-[7.75rem]"
          style={ButtonStyle.primary}
          onClick={handleFundWallet}
          text={t(translations.portfolioPage.assetSection.fundWallet)}
        />
        <Button
          className="w-[7.75rem]"
          style={ButtonStyle.secondary}
          onClick={() => navigate('/convert?&to=sov')}
          text={t(translations.portfolioPage.assetSection.convert)}
        />
        {isRbtcWithdrawalAllowed && (
          <Button
            className="w-[7.75rem]"
            style={ButtonStyle.secondary}
            onClick={handleWithdraw}
            text={t(translations.portfolioPage.assetSection.withdraw)}
          />
        )}
      </div>
    </>
  );
};

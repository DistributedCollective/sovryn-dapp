import React, { FC, useCallback, useMemo } from 'react';

import { t } from 'i18next';
import { useNavigate } from 'react-router-dom';

import { Button, ButtonStyle, Paragraph } from '@sovryn/ui';

import { ReactComponent as ConvertIcon } from '../../../../../../../assets/images/convert.svg';
import { ReactComponent as DepositIcon } from '../../../../../../../assets/images/deposit.svg';
import { ReactComponent as WithdrawIcon } from '../../../../../../../assets/images/withdraw.svg';
import { BOB } from '../../../../../../../constants/infrastructure/bob';
import { useAccount } from '../../../../../../../hooks/useAccount';
import { useAssetBalance } from '../../../../../../../hooks/useAssetBalance';
import { useCurrentChain } from '../../../../../../../hooks/useChainStore';
import { translations } from '../../../../../../../locales/i18n';
import { sharedState } from '../../../../../../../store/rxjs/shared-state';
import { Environments } from '../../../../../../../types/global';
import { COMMON_SYMBOLS } from '../../../../../../../utils/asset';
import { isBobChain, isRskChain } from '../../../../../../../utils/chain';
import { isMainnet } from '../../../../../../../utils/helpers';

const actionButtonClassnames =
  'w-[7.75rem] text-xs lg:text-sm lg:leading-4 px-2 lg:px-5';

export const AssetSectionActions: FC = () => {
  const navigate = useNavigate();
  const chainId = useCurrentChain();
  const { account } = useAccount();

  const { balance: rbtcBalance } = useAssetBalance(COMMON_SYMBOLS.BTC, chainId);
  const hasRbtcBalance = useMemo(
    () => Number(rbtcBalance) !== 0,
    [rbtcBalance],
  );

  const handleFundWallet = useCallback(() => {
    if (isRskChain(chainId)) {
      sharedState.actions.openFastBtcDialog(!hasRbtcBalance);
    } else if (isBobChain(chainId)) {
      window.open(
        BOB.bridge[isMainnet() ? Environments.Mainnet : Environments.Testnet],
        '_blank',
      );
    }
  }, [chainId, hasRbtcBalance]);

  const handleRuneBridge = useCallback(
    () => sharedState.actions.openRuneBridgeDialog(),
    [],
  );

  const handleWithdraw = useCallback(
    () => sharedState.actions.openFastBtcDialog(false, 1),
    [],
  );

  const isRbtcWithdrawalAllowed = useMemo(
    () => hasRbtcBalance && account,
    [hasRbtcBalance, account],
  );

  const handleExchangeRune = useCallback(
    () => sharedState.actions.openRuneBridgeDialog(),
    [],
  );

  return (
    <>
      <div className="flex md:hidden w-full justify-center items-center gap-8 my-4">
        <div className="flex flex-col gap-3 items-center">
          <button
            onClick={handleFundWallet}
            className="bg-gray-70 w-12 h-12 rounded flex items-center justify-center"
            disabled={!account}
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

        <div className="flex flex-col gap-3 items-center">
          <button
            onClick={handleRuneBridge}
            className="bg-gray-70 w-12 h-12 rounded flex items-center justify-center"
            disabled={!account}
          >
            <DepositIcon />
          </button>
          <Paragraph>
            {t(translations.portfolioPage.assetSection.runeBridge)}
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
          className={actionButtonClassnames}
          style={ButtonStyle.primary}
          onClick={handleFundWallet}
          text={t(translations.portfolioPage.assetSection.fundWallet)}
          disabled={!account}
        />
        <Button
          className={actionButtonClassnames}
          style={ButtonStyle.secondary}
          onClick={() => navigate('/convert?&to=sov')}
          text={t(translations.portfolioPage.assetSection.convert)}
        />
        <Button
          className={actionButtonClassnames}
          style={ButtonStyle.secondary}
          onClick={handleExchangeRune}
          text={t(translations.portfolioPage.assetSection.runeBridge)}
          disabled={!account}
        />
        {isRbtcWithdrawalAllowed && (
          <Button
            className={actionButtonClassnames}
            style={ButtonStyle.secondary}
            onClick={handleWithdraw}
            text={t(translations.portfolioPage.assetSection.withdraw)}
          />
        )}
      </div>
    </>
  );
};

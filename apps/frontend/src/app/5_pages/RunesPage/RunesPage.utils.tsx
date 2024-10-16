import React from 'react';

import { t } from 'i18next';

import { Button, ButtonSize, ButtonStyle, Paragraph } from '@sovryn/ui';

import { AssetRenderer } from '../../2_molecules/AssetRenderer/AssetRenderer';
import { translations } from '../../../locales/i18n';
import {
  AVAILABLE_RUNES,
  RUNES_BENEFITS,
  RUNES_USE_CASES,
} from './RunesPage.constants';
import { RUNES_USE_CASE_ACTIONS, Rune } from './RunesPage.types';

const pageTranslations = translations.runesPage;

export const renderAvailableRunes = () =>
  Object.values(AVAILABLE_RUNES).map(({ symbol, icon }: Rune) => (
    <div key={symbol}>
      <div className="bg-gray-70 rounded p-2 min-h-9 min-w-20 flex items-center justify-start">
        {icon ? (
          <>
            <img src={icon} alt={symbol} className="w-5 h-5 mr-2" />
            <span className="font-semibold text-xs text-gray-30">{symbol}</span>
          </>
        ) : (
          <AssetRenderer
            asset={symbol}
            showAssetLogo
            assetClassName="font-semibold text-gray-30"
          />
        )}
      </div>
      {symbol === AVAILABLE_RUNES.PUPS.symbol && (
        <div className="text-xs text-gray-30">
          {t(pageTranslations.availableSoon)}
        </div>
      )}
    </div>
  ));

export const renderRuneBenefits = () =>
  RUNES_BENEFITS.map(({ title, icon }) => (
    <div key={title} className="bg-gray-90 rounded p-6 flex-1 min-w-28">
      <img src={icon} alt={title} className="mb-2" />
      <span className="text-gray-10 font-normal text-sm">{title}</span>
    </div>
  ));

export const renderRunesUseCases = (
  handleRuneAction: (action: RUNES_USE_CASE_ACTIONS) => void,
) =>
  RUNES_USE_CASES.map(({ title, icon, description, action }) => (
    <div key={title} className="bg-gray-70 rounded p-6 flex-1 min-w-28">
      <div className="flex sm:justify-end justify-center min-h-20 items-start">
        <img src={icon} alt={title} className="mb-2 -mt-3 -mr-3" />
      </div>
      <Paragraph className="font-medium text-sm text-gray-10">
        {title}
      </Paragraph>
      <Paragraph className="font-medium text-xs text-gray-30 mt-6">
        {description}
      </Paragraph>
      <Button
        text={t(pageTranslations.runesUseCases.actions[action])}
        className="mt-6 w-full sm:w-auto font-medium"
        style={ButtonStyle.secondary}
        size={ButtonSize.large}
        onClick={() => handleRuneAction(action)}
      />
    </div>
  ));

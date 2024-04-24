import { t } from 'i18next';

import { Chains } from '../../../config/chains';

import { IUsesChain } from '../../5_pages/HistoryPage/HistoryPage.types';
import { translations } from '../../../locales/i18n';
import { ConvertHistoryType } from './ConvertHistory.types';

export type ConvertHistoryItem = {
  value: ConvertHistoryType;
  label: string;
} & IUsesChain;

export const CONVERT_HISTORY_OPTIONS: ConvertHistoryItem[] = [
  {
    value: ConvertHistoryType.AMM,
    label: t(translations.conversionsHistory.types.AMM),
    chains: [Chains.RSK],
  },
  {
    value: ConvertHistoryType.BOB,
    label: t(translations.conversionsHistory.types.BOB),
    chains: [Chains.BOB],
  },
  //TODO: requires adding the data to the subgraph
  // {
  //   value: ConvertHistoryType.MOC,
  //   label: t(translations.conversionsHistory.types.MOC),
  //   chains: [Chains.RSK]
  // },
  {
    value: ConvertHistoryType.MYNT,
    label: t(translations.conversionsHistory.types.Mynt),
    chains: [Chains.RSK],
  },
  {
    value: ConvertHistoryType.ZERO,
    label: t(translations.conversionsHistory.types.Zero),
    chains: [Chains.RSK],
  },
];

import React, { FC } from 'react';

import { Environments } from '../../../../types/global';
import { currentNetwork } from '../../../../utils/helpers';

export interface RuneExplorerLinkProps {
  rune: string;
}

const EXPLORER_BASE_URL =
  currentNetwork === Environments.Testnet
    ? 'https://testnet.ordinals.com'
    : 'https://ordinals.com';

export const RuneExplorerLink: FC<RuneExplorerLinkProps> = ({ rune }) => (
  <a
    href={`${EXPLORER_BASE_URL}/rune/${rune}`}
    target="_blank"
    rel="noopener noreferrer"
  >
    {rune}
  </a>
);

import React from 'react';

import { Environments } from '../../../../types/global';

export interface RuneExplorerLinkProps {
  rune: string;
}

const EXPLORER_BASE_URL =
  process.env.REACT_APP_NETWORK === Environments.Testnet
    ? 'https://testnet.ordinals.com'
    : 'https://ordinals.com';

export const RuneExplorerLink = ({ rune }: RuneExplorerLinkProps) => {
  return (
    <a
      href={`${EXPLORER_BASE_URL}/rune/${rune}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      {rune}
    </a>
  );
};

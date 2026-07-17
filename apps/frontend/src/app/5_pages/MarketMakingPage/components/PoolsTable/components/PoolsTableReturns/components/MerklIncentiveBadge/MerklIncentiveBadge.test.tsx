import { fireEvent, render, screen } from '@testing-library/react';

import React from 'react';

import 'jest-canvas-mock';

import { i18n } from '../../../../../../../../../locales/i18n';
import { MerklIncentiveBadge } from './MerklIncentiveBadge';
import { MERKL_USDT0_CAMPAIGN_URL } from './MerklIncentiveBadge.constants';

describe('MerklIncentiveBadge', () => {
  beforeAll(async () => {
    await i18n;
  });

  it('renders the gift icon', () => {
    render(<MerklIncentiveBadge />);

    expect(screen.getByLabelText('Merkl incentives')).toBeInTheDocument();
  });

  it('opens the tooltip on hover with campaign info and Merkl link', async () => {
    render(<MerklIncentiveBadge />);

    const trigger = screen.getByLabelText('Merkl incentives').closest('span');
    fireEvent.mouseEnter(trigger!);

    expect(
      await screen.findByText('Merkl incentives live on this pool'),
    ).toBeInTheDocument();

    const link = screen.getByText(/View & claim on Merkl/).closest('a');
    expect(link).toHaveAttribute('href', MERKL_USDT0_CAMPAIGN_URL);
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noreferrer');
  });

  it('does not propagate clicks to the table row', () => {
    const onRowClick = jest.fn();
    render(
      <div onClick={onRowClick}>
        <MerklIncentiveBadge />
      </div>,
    );

    fireEvent.click(screen.getByLabelText('Merkl incentives'));

    expect(onRowClick).not.toHaveBeenCalled();
  });
});

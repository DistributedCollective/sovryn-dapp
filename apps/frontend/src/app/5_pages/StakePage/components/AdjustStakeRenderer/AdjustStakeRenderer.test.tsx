import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';

import React from 'react';

import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { VoidSigner } from 'ethers';
import 'jest-canvas-mock';
import { HelmetProvider } from 'react-helmet-async';
import { MemoryRouter } from 'react-router-dom';

import { AdjustVestingStakeForm } from '../../../../3_organisms/StakeForm/components/AdjustVestingStakeForm/AdjustVestingStakeForm';
import { useTransactionContext } from '../../../../../contexts/TransactionContext';
import { useRequiredChain } from '../../../../../hooks/chain/useRequiredChain';
import { useAccount } from '../../../../../hooks/useAccount';
import { useCurrentChain } from '../../../../../hooks/useChainStore';
import { useMaintenance } from '../../../../../hooks/useMaintenance';
import { useWalletConnect } from '../../../../../hooks/useWalletConnect';
import { i18n } from '../../../../../locales/i18n';
import DelegationPage from '../../../DelegationPage/DelegationPage';
import { StakeItem } from '../StakesFrame/StakesFrame.types';
import { useGetStakes } from '../StakesFrame/hooks/useGetStakes';
import { AdjustStakeRenderer } from './AdjustStakeRenderer';

jest.mock('nanoid', () => ({ nanoid: () => 'delegation-test' }));
jest.mock('../../../../../hooks/useAccount', () => ({ useAccount: jest.fn() }));
jest.mock('../../../../../hooks/useChainStore', () => ({
  useCurrentChain: jest.fn(),
  useChainStore: () => ({ currentChainId: '0x1e' }),
}));
jest.mock('../../../../../hooks/useMaintenance', () => ({
  useMaintenance: jest.fn(),
}));
jest.mock('../../../../../contexts/TransactionContext', () => ({
  useTransactionContext: jest.fn(),
}));
jest.mock('../../../../../contexts/NotificationContext', () => ({
  useNotificationContext: () => ({ addNotification: jest.fn() }),
}));
jest.mock('../../../../../hooks/useAssetBalance', () => ({
  useAssetBalance: () => ({ balance: '100' }),
}));
jest.mock('../StakesFrame/hooks/useGetWeight', () => ({
  useGetWeight: () => ({ weight: 10 }),
}));
jest.mock('../../hooks/useGetVotingPower', () => ({
  useGetVotingPower: () => 10,
}));
jest.mock(
  '../../../../3_organisms/StakeForm/hooks/useGetPenaltyAmount',
  () => ({
    useGetPenaltyAmount: () => '0',
  }),
);
jest.mock(
  '../../../../3_organisms/StakeForm/components/StakeDatePicker/StakeDatePicker',
  () => ({ StakeDatePicker: () => null }),
);
jest.mock('../../../../../hooks/useGetContract', () => ({
  useGetProtocolContract: () => ({
    address: '0x3333333333333333333333333333333333333333',
  }),
}));
jest.mock('../../../../../config/chains', () => ({
  RSK_CHAIN_ID: '0x1e',
  APP_CHAIN_LIST: [{ id: '0x1e', label: 'Rootstock' }],
}));
jest.mock('../../../../../hooks/chain/useRequiredChain', () => ({
  useRequiredChain: jest.fn(),
}));
jest.mock('../../../../../hooks/useWalletConnect', () => ({
  useWalletConnect: jest.fn(),
}));
jest.mock('../StakesFrame/hooks/useGetStakes', () => ({
  useGetStakes: jest.fn(),
}));
jest.mock('../../hooks/useGetStakingBalanceOf', () => ({
  useGetStakingBalanceOf: () => ({ balance: '10' }),
}));
jest.mock('../VestingStakesFrame/hooks/useGetVestingStakes', () => ({
  useGetVestingStakes: () => ({ vestingStakes: [], loadingVestings: false }),
}));
jest.mock(
  '../VestingStakesFrame/hooks/useGetVestingStakeStartEndDates',
  () => ({
    useGetVestingStakeStartEndDates: () => ({ endDate: '2000000000' }),
  }),
);
jest.mock('../VestingStakesFrame/hooks/useGetVestingDelegateAddress', () => ({
  useGetVestingDelegateAddress: () =>
    '0x2222222222222222222222222222222222222222',
}));

const ACCOUNT = '0x1111111111111111111111111111111111111111';
const DELEGATE = '0x2222222222222222222222222222222222222222';
const transactions = jest.fn();
const maintenance = new Set<string>();
const stake: StakeItem = {
  stakedAmount: '10',
  unlockDate: 2000000000,
  delegate: DELEGATE,
};

const enterDelegate = (input: Element, address: string) => {
  fireEvent.change(input, { target: { value: address } });
  act(() => jest.advanceTimersByTime(500));
};

const openDelegation = (position = stake) => {
  const onSuccess = jest.fn();
  const result = render(
    <MemoryRouter>
      <AdjustStakeRenderer
        stake={position}
        onSuccess={onSuccess}
        delegationOnly
      />
    </MemoryRouter>,
  );
  fireEvent.click(screen.getByRole('button', { name: 'Delegate' }));
  const input = result.baseElement.querySelector(
    '[data-layout-id="adjust-stake-delegate-address"]',
  )!;
  return { input, onSuccess };
};

describe('Delegation without stake management', () => {
  beforeAll(async () => {
    dayjs.extend(utc);
    dayjs.extend(timezone);
    await i18n;
  });

  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
    maintenance.clear();
    (useAccount as jest.Mock).mockReturnValue({
      account: ACCOUNT,
      signer: new VoidSigner(ACCOUNT),
    });
    (useCurrentChain as jest.Mock).mockReturnValue('0x1e');
    (useRequiredChain as jest.Mock).mockReturnValue({
      invalidChain: false,
      requiredChain: { label: 'Rootstock' },
    });
    (useWalletConnect as jest.Mock).mockReturnValue({
      wallets: [{ chains: [{ id: '0x1e' }] }],
      switchNetwork: jest.fn(),
    });
    (useGetStakes as jest.Mock).mockReturnValue({
      stakes: [stake],
      loading: false,
      refetch: jest.fn(),
    });
    (useTransactionContext as jest.Mock).mockReturnValue({
      setTransactions: transactions,
      setTitle: jest.fn(),
      setIsOpen: jest.fn(),
    });
    (useMaintenance as jest.Mock).mockReturnValue({
      States: {
        STAKING_FULL: 'stakingFull',
        STAKING_INCREASE: 'stakingIncrease',
        STAKING_DECREASE: 'stakingDecrease',
        STAKING_EXTEND: 'stakingExtend',
        STAKING_DELEGATE: 'stakingVestingDelegate',
      },
      checkMaintenance: (name: string) => maintenance.has(name),
    });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('offers delegation without increase, decrease or extend controls', () => {
    openDelegation();
    expect(screen.queryByText('Increase')).not.toBeInTheDocument();
    expect(screen.queryByText('Decrease')).not.toBeInTheDocument();
    expect(screen.queryByText('Extend')).not.toBeInTheDocument();
    expect(screen.getByDisplayValue(DELEGATE)).toBeInTheDocument();
  });

  it('prepares only the selected stake delegation and supports self-delegation', async () => {
    const { input } = openDelegation();
    enterDelegate(input, ACCOUNT);
    fireEvent.click(screen.getByRole('button', { name: 'Confirm' }));
    await waitFor(() => expect(transactions).toHaveBeenCalledTimes(1));
    expect(transactions.mock.calls[0][0]).toEqual([
      expect.objectContaining({
        request: expect.objectContaining({
          contract: { address: '0x3333333333333333333333333333333333333333' },
          fnName: 'delegate',
          args: [ACCOUNT, 2000000000],
        }),
      }),
    ]);
  });

  it.each([
    '0x27b1FdB04752BBc536007A920D24ACB045561c26',
    '0x27B1FdB04752BbC536007a920D24acB045561C26',
  ])(
    'accepts a Rootstock address and normalizes its call argument: %s',
    async address => {
      const { input } = openDelegation();
      enterDelegate(input, address);
      expect(screen.getByRole('button', { name: 'Confirm' })).toBeEnabled();
      fireEvent.click(screen.getByRole('button', { name: 'Confirm' }));
      await waitFor(() => expect(transactions).toHaveBeenCalledTimes(1));
      expect(transactions.mock.calls[0][0][0].request.args).toEqual([
        address.toLowerCase(),
        2000000000,
      ]);
    },
  );

  it.each([
    '',
    'invalid',
    'XE591ZROBWFAZQVVS3XWA2F1EDHUF41ENTD',
    '0x0000000000000000000000000000000000000000',
    DELEGATE,
  ])('refuses an empty, invalid, zero or unchanged delegate: %s', address => {
    const { input } = openDelegation();
    enterDelegate(input, address);
    expect(screen.getByRole('button', { name: 'Confirm' })).toBeDisabled();
    fireEvent.click(screen.getByRole('button', { name: 'Confirm' }));
    expect(transactions).not.toHaveBeenCalled();
  });

  it.each(['stakingFull', 'stakingVestingDelegate'])(
    'honors the separate %s maintenance flag',
    flag => {
      maintenance.add(flag);
      const { input } = openDelegation();
      enterDelegate(input, ACCOUNT);
      expect(screen.getByRole('button', { name: 'Confirm' })).toBeDisabled();
    },
  );

  it('does not delegate an expired position', () => {
    const { input } = openDelegation({ ...stake, unlockDate: 1 });
    enterDelegate(input, ACCOUNT);
    expect(screen.getByRole('button', { name: 'Confirm' })).toBeDisabled();
  });

  it('requires a wallet on Rootstock', () => {
    (useCurrentChain as jest.Mock).mockReturnValue('0x1');
    const { input } = openDelegation();
    enterDelegate(input, ACCOUNT);
    expect(screen.getByRole('button', { name: 'Confirm' })).toBeDisabled();
  });

  it.each([
    { account: undefined, signer: undefined },
    { account: ACCOUNT, signer: undefined },
  ])('requires a connected signing wallet', wallet => {
    (useAccount as jest.Mock).mockReturnValue(wallet);
    const { input } = openDelegation();
    enterDelegate(input, ACCOUNT);
    expect(screen.getByRole('button', { name: 'Confirm' })).toBeDisabled();
  });

  const renderDelegationPage = () =>
    render(
      <HelmetProvider>
        <MemoryRouter>
          <DelegationPage />
        </MemoryRouter>
      </HelmetProvider>,
    );

  it('offers only delegation actions from the dedicated page', () => {
    renderDelegationPage();
    expect(
      screen.queryByRole('button', { name: 'Stake SOV' }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Add new stake' }),
    ).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: '10 SOV' }));
    fireEvent.click(screen.getAllByRole('button', { name: 'Delegate' })[0]);
    expect(screen.getByDisplayValue(DELEGATE)).toBeInTheDocument();
    expect(screen.queryByText('Increase')).not.toBeInTheDocument();
    expect(screen.queryByText('Decrease')).not.toBeInTheDocument();
    expect(screen.queryByText('Extend')).not.toBeInTheDocument();
  });

  it('does not mount position actions on another app network', () => {
    (useRequiredChain as jest.Mock).mockReturnValue({
      invalidChain: true,
      requiredChain: { label: 'Rootstock' },
    });
    renderDelegationPage();
    expect(
      screen.queryByRole('button', { name: 'Delegate' }),
    ).not.toBeInTheDocument();
  });

  it('requires the wallet network to match Rootstock before offering actions', () => {
    const switchNetwork = jest.fn();
    (useWalletConnect as jest.Mock).mockReturnValue({
      wallets: [{ chains: [{ id: '0x1' }] }],
      switchNetwork,
    });
    renderDelegationPage();
    expect(
      screen.queryByRole('button', { name: 'Delegate' }),
    ).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Switch' }));
    expect(switchNetwork).toHaveBeenCalledWith('0x1e');
  });

  const renderVestingForm = () => {
    const result = render(
      <AdjustVestingStakeForm
        vestingContract="0x4444444444444444444444444444444444444444"
        onSuccess={jest.fn()}
      />,
    );
    return result.baseElement.querySelector(
      '[data-layout-id="adjust-vesting-stake-delegate-address"]',
    )!;
  };

  it('delegates a vesting position through its own contract', async () => {
    const input = renderVestingForm();
    enterDelegate(input, ACCOUNT);
    fireEvent.click(screen.getByRole('button', { name: 'Confirm' }));
    await waitFor(() => expect(transactions).toHaveBeenCalledTimes(1));
    const plan = transactions.mock.calls[0][0];
    expect(plan).toHaveLength(1);
    expect(plan[0].request.fnName).toBe('delegate');
    expect(plan[0].request.args).toEqual([ACCOUNT]);
    expect(plan[0].request.contract.address).toBe(
      '0x4444444444444444444444444444444444444444',
    );
  });

  it.each(['invalid', '0x0000000000000000000000000000000000000000', DELEGATE])(
    'refuses an invalid or unchanged vesting delegate: %s',
    address => {
      enterDelegate(renderVestingForm(), address);
      expect(screen.getByRole('button', { name: 'Confirm' })).toBeDisabled();
    },
  );

  it('keeps vesting delegation disabled during delegation maintenance', () => {
    maintenance.add('stakingVestingDelegate');
    enterDelegate(renderVestingForm(), ACCOUNT);
    expect(screen.getByRole('button', { name: 'Confirm' })).toBeDisabled();
  });

  it('preserves the usual management tabs on the staking page', () => {
    render(<AdjustStakeRenderer stake={stake} onSuccess={jest.fn()} />);
    fireEvent.click(screen.getByRole('button', { name: 'Adjust' }));
    expect(screen.getByText('Increase')).toBeInTheDocument();
    expect(screen.getByText('Decrease')).toBeInTheDocument();
    expect(screen.getByText('Extend')).toBeInTheDocument();
  });
});

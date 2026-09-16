import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';

import React from 'react';

import { BigNumber } from 'ethers';
import 'jest-canvas-mock';

import { Overlay, StatusType } from '@sovryn/ui';

import { i18n } from '../../../../../locales/i18n';
import {
  Transaction,
  TransactionType,
} from '../../TransactionStepDialog.types';
import { sendRefusal } from '../../helpers';
import { TransactionSteps } from './TransactionSteps';

/**
 * A transaction may carry a check that runs inside the send step, after the
 * holder presses Confirm and immediately before the wallet is asked to sign.
 * What it returns is what the wallet is handed. When it refuses, the wallet is
 * never asked, and the step says nothing was sent and why, with Retry offered;
 * the dialog reports a failed transaction only when the wallet was asked.
 */

const ACCOUNT = '0x1111111111111111111111111111111111111111';
const QUEUE = '0x9999999999999999999999999999999999999999';

jest.mock('nanoid', () => ({ nanoid: () => '1234' }));

jest.mock('../../../../../contexts/NotificationContext', () => ({
  useNotificationContext: () => ({ addNotification: () => undefined }),
}));

jest.mock('../../../../../hooks/useChainStore', () => ({
  useCurrentChain: () => '0x1e',
}));

jest.mock('../../../../../hooks/useNativeAssetBalance', () => {
  const { Decimal } = jest.requireActual('@sovryn/utils');
  return {
    useNativeAssetBalance: () => ({ balance: Decimal.from(1), loading: false }),
  };
});

jest.mock('../../../../../hooks/useAccount', () => ({
  useAccount: () => ({ account: '0x1111111111111111111111111111111111111111' }),
}));

jest.mock('@sovryn/contracts', () => ({
  ...jest.requireActual('@sovryn/contracts'),
  findContract: () => Promise.reject(new Error('not a known contract')),
}));

const mockSend = jest.fn();
const mockEstimate = jest.fn();

const releaseTransaction = (
  beforeSend?: Transaction['beforeSend'],
): Transaction => ({
  title: 'Release 3 withdrawals from the Perimeter vault',
  request: {
    type: TransactionType.signTransaction,
    contract: {
      address: QUEUE,
      signer: { getAddress: async () => ACCOUNT },
      provider: { getTransactionCount: async () => 3 },
      estimateGas: { executeExits: mockEstimate },
      executeExits: mockSend,
    } as never,
    fnName: 'executeExits',
    args: [['7', '8', '9']],
  },
  beforeSend,
});

const confirm = async () => {
  const button = await waitFor(() => {
    const found = document.querySelector(
      '[data-layout-id="tx-dialog-confirm"]',
    );
    expect(found).toBeInTheDocument();
    return found!;
  });
  fireEvent.click(button);
};

describe('TransactionSteps', () => {
  beforeAll(async () => {
    await i18n;
  });

  beforeEach(() => {
    // The dialog could not estimate gas when it opened, so it holds its flat
    // default for the step.
    mockEstimate.mockRejectedValue(new Error('execution reverted'));
    mockSend.mockResolvedValue({ hash: '0xabc', wait: async () => ({}) });
    jest.spyOn(console, 'error').mockImplementation(() => undefined);
  });

  it("hands the wallet the request and gas its send check returns, not the dialog's own", async () => {
    const beforeSend = jest.fn(async ({ request, config }) => ({
      request: { ...request, args: [['7', '9']] },
      config: { ...config, gasLimit: '50000' },
    }));
    render(
      <TransactionSteps
        transactions={[releaseTransaction(beforeSend)]}
        gasPrice="0.065"
        setTxTrigger={jest.fn()}
      />,
    );

    await confirm();

    await waitFor(() => expect(mockSend).toHaveBeenCalled());
    expect(beforeSend).toHaveBeenCalledTimes(1);
    expect(beforeSend.mock.invocationCallOrder[0]).toBeLessThan(
      mockSend.mock.invocationCallOrder[0],
    );
    expect(mockSend).toHaveBeenCalledWith(
      ['7', '9'],
      expect.objectContaining({ gasLimit: '50000', from: ACCOUNT }),
    );
  });

  it('never asks the wallet when the send check refuses, and says nothing was sent and why, with Retry offered', async () => {
    const reason =
      'Withdrawal #8 was not released because the queue would refuse it.';
    const beforeSend = jest.fn().mockRejectedValue(sendRefusal([reason]));
    const onTxStatusChange = jest.fn();
    render(
      <TransactionSteps
        transactions={[releaseTransaction(beforeSend)]}
        gasPrice="0.065"
        onTxStatusChange={onTxStatusChange}
        setTxTrigger={jest.fn()}
      />,
    );

    await confirm();

    await waitFor(() =>
      expect(
        document.querySelector('[data-layout-id="tx-dialog-retry"]'),
      ).toBeInTheDocument(),
    );
    expect(beforeSend).toHaveBeenCalledTimes(1);
    expect(mockSend).not.toHaveBeenCalled();
    expect(screen.getByText('Nothing was sent')).toBeInTheDocument();
    expect(screen.getByText(reason)).toBeInTheDocument();
    expect(
      screen.queryByText('Your transaction has failed'),
    ).not.toBeInTheDocument();
    // No failed transaction is reported, so closing the dialog does not
    // announce one.
    expect(onTxStatusChange).not.toHaveBeenCalledWith(StatusType.error);
  });

  it('says nothing was sent when the send check rejects without naming a reason', async () => {
    const beforeSend = jest.fn().mockRejectedValue(new Error('node error'));
    render(
      <TransactionSteps
        transactions={[releaseTransaction(beforeSend)]}
        gasPrice="0.065"
        setTxTrigger={jest.fn()}
      />,
    );

    await confirm();

    await waitFor(() =>
      expect(screen.getByText('Nothing was sent')).toBeInTheDocument(),
    );
    expect(mockSend).not.toHaveBeenCalled();
    expect(
      screen.queryByText('Your transaction has failed'),
    ).not.toBeInTheDocument();
  });

  it.each<[string, Transaction['beforeSend']]>([
    ['a transaction with no send check', undefined],
    ['a transaction whose send check passed', async step => step],
  ])(
    'says the transaction failed when the wallet does not send %s',
    async (_case, beforeSend) => {
      mockSend.mockRejectedValue(new Error('user rejected transaction'));
      const onTxStatusChange = jest.fn();
      render(
        <TransactionSteps
          transactions={[releaseTransaction(beforeSend)]}
          gasPrice="0.065"
          onTxStatusChange={onTxStatusChange}
          setTxTrigger={jest.fn()}
        />,
      );

      await confirm();

      await waitFor(() =>
        expect(
          screen.getByText('Your transaction has failed'),
        ).toBeInTheDocument(),
      );
      expect(screen.queryByText('Nothing was sent')).not.toBeInTheDocument();
      expect(onTxStatusChange).toHaveBeenCalledWith(StatusType.error);
    },
  );

  it('runs the send check again on Retry', async () => {
    const beforeSend = jest
      .fn()
      .mockRejectedValueOnce(new Error('refused'))
      .mockImplementationOnce(async ({ request, config }) => ({
        request,
        config: { ...config, gasLimit: '50000' },
      }));
    render(
      <TransactionSteps
        transactions={[releaseTransaction(beforeSend)]}
        gasPrice="0.065"
        setTxTrigger={jest.fn()}
      />,
    );

    await confirm();
    const retry = await waitFor(() => {
      const found = document.querySelector(
        '[data-layout-id="tx-dialog-retry"]',
      );
      expect(found).toBeInTheDocument();
      return found!;
    });
    fireEvent.click(retry);

    await waitFor(() => expect(mockSend).toHaveBeenCalled());
    expect(beforeSend).toHaveBeenCalledTimes(2);
    expect(mockSend).toHaveBeenCalledWith(
      ['7', '8', '9'],
      expect.objectContaining({ gasLimit: '50000' }),
    );
  });

  it('sends what the dialog prepared for a transaction with no send check', async () => {
    mockEstimate.mockResolvedValue(BigNumber.from(42_000));
    render(
      <TransactionSteps
        transactions={[releaseTransaction()]}
        gasPrice="0.065"
        setTxTrigger={jest.fn()}
      />,
    );

    await confirm();

    await waitFor(() => expect(mockSend).toHaveBeenCalled());
    expect(mockSend).toHaveBeenCalledWith(
      ['7', '8', '9'],
      expect.objectContaining({ gasLimit: '42000' }),
    );
  });

  describe('a gas limit typed in Advanced settings', () => {
    // A send check keeps a limit the holder typed and replaces one the dialog
    // prepared, so the step's config says which it holds.
    const passThrough = () =>
      jest.fn(
        async (step: Parameters<Required<Transaction>['beforeSend']>[0]) =>
          step,
      );

    const openSettings = async () =>
      fireEvent.click(
        await waitFor(() => {
          const found = document.querySelector(
            '[data-layout-id="tx-dialog-settings"]',
          );
          expect(found).toBeInTheDocument();
          return found!;
        }),
      );

    const typeGasLimit = async (value: string) => {
      const [gasLimit] = screen.getAllByRole('textbox');
      fireEvent.change(gasLimit, { target: { value } });
      // The input reports a change once typing pauses.
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 600));
      });
    };

    it('reaches the send check marked as typed', async () => {
      const beforeSend = passThrough();
      render(
        <TransactionSteps
          transactions={[releaseTransaction(beforeSend)]}
          gasPrice="0.065"
          setTxTrigger={jest.fn()}
        />,
      );

      await openSettings();
      await typeGasLimit('75000');
      await confirm();

      await waitFor(() => expect(beforeSend).toHaveBeenCalled());
      expect(beforeSend.mock.calls[0][0].config).toEqual(
        expect.objectContaining({
          gasLimit: '75000',
          gasLimitTypedByUser: true,
        }),
      );
    });

    it('is not marked as typed when the dialog prepared the limit', async () => {
      const beforeSend = passThrough();
      render(
        <TransactionSteps
          transactions={[releaseTransaction(beforeSend)]}
          gasPrice="0.065"
          setTxTrigger={jest.fn()}
        />,
      );

      await confirm();

      await waitFor(() => expect(beforeSend).toHaveBeenCalled());
      expect(
        beforeSend.mock.calls[0][0].config.gasLimitTypedByUser,
      ).toBeFalsy();
    });

    it('is no longer marked as typed after Reset values', async () => {
      const beforeSend = passThrough();
      render(
        <TransactionSteps
          transactions={[releaseTransaction(beforeSend)]}
          gasPrice="0.065"
          setTxTrigger={jest.fn()}
        />,
      );

      await openSettings();
      await typeGasLimit('75000');
      fireEvent.click(
        document.querySelector('[data-layout-id="tx-dialog-settings-reset"]')!,
      );
      await waitFor(() =>
        expect(screen.getAllByRole('textbox')[0]).toHaveValue('6000000'),
      );
      await confirm();

      await waitFor(() => expect(beforeSend).toHaveBeenCalled());
      expect(
        beforeSend.mock.calls[0][0].config.gasLimitTypedByUser,
      ).toBeFalsy();
    });
  });

  describe('the dialog closed while the send check runs', () => {
    // The check may still be reading the chain after the holder closes the
    // dialog. A check that then passes must not reach the wallet: nobody is
    // left to see a request they never asked to close out of.
    const Harness: React.FC<{
      transaction: Transaction;
      register: (setOpen: (value: boolean) => void) => void;
    }> = ({ transaction, register }) => {
      const [isOpen, setIsOpen] = React.useState(true);
      React.useEffect(() => {
        register(setIsOpen);
      }, [register]);
      return (
        <TransactionSteps
          transactions={[transaction]}
          gasPrice="0.065"
          setTxTrigger={jest.fn()}
          isOpen={isOpen}
        />
      );
    };

    // The dialog's own Overlay unmounts its children the moment it closes, so
    // this renders through it the way the app does — a harness that only
    // flips the isOpen prop on a component that stays mounted proves nothing
    // about a check that finishes after the dialog is gone.
    const MountedHarness: React.FC<{
      transaction: Transaction;
      register: (setOpen: (value: boolean) => void) => void;
    }> = ({ transaction, register }) => {
      const [isOpen, setIsOpen] = React.useState(true);
      React.useEffect(() => {
        register(setIsOpen);
      }, [register]);
      return (
        <Overlay isOpen={isOpen} fixed portalTarget="body">
          <TransactionSteps
            transactions={[transaction]}
            gasPrice="0.065"
            setTxTrigger={jest.fn()}
            isOpen={isOpen}
          />
        </Overlay>
      );
    };

    it('does not ask the wallet once a send check passes after the dialog is closed', async () => {
      let setOpen: (value: boolean) => void = () => {};
      let resolveCheck: () => void = () => {};
      const beforeSend = jest.fn(
        (step: unknown) =>
          new Promise(resolve => {
            resolveCheck = () => resolve(step);
          }),
      );
      render(
        <MountedHarness
          transaction={releaseTransaction(beforeSend as never)}
          register={fn => {
            setOpen = fn;
          }}
        />,
      );

      await confirm();
      await waitFor(() => expect(beforeSend).toHaveBeenCalledTimes(1));

      act(() => setOpen(false));
      await act(async () => {
        resolveCheck();
        await Promise.resolve();
        await Promise.resolve();
      });

      expect(mockSend).not.toHaveBeenCalled();
    });

    it('still sends a transaction with no send check regardless of isOpen', async () => {
      mockEstimate.mockResolvedValue(BigNumber.from(42_000));
      let setOpen: (value: boolean) => void = () => {};
      render(
        <Harness
          transaction={releaseTransaction()}
          register={fn => {
            setOpen = fn;
          }}
        />,
      );

      act(() => setOpen(false));
      await confirm();

      await waitFor(() => expect(mockSend).toHaveBeenCalled());
    });
  });
});

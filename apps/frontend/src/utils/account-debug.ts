import { ethers } from 'ethers';

const DEBUG_WALLET =
  typeof localStorage !== 'undefined'
    ? localStorage.getItem('impersonate')
    : null;

export const IS_IMPERSONATING = !!DEBUG_WALLET;

export function maybeDebugAccount(address?: string): string {
  // to enable debug mode, actual user wallet must be also connected
  if (DEBUG_WALLET && address) {
    return DEBUG_WALLET.toLowerCase();
  }
  return address?.toLowerCase() ?? '';
}

function impersonateAccount(address: string) {
  if (!ethers.utils.isAddress(address?.toLowerCase())) {
    throw new Error("It's not a valid Ethereum address.");
  }

  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('impersonate', address.toLowerCase());
    window.location.reload();
  }
}

function stopImpersonatingAccount() {
  if (typeof localStorage !== 'undefined') {
    localStorage.removeItem('impersonate');
    window.location.reload();
  }
}

(() => {
  if (typeof window !== 'undefined') {
    (window as any).impersonateAccount = impersonateAccount;
    (window as any).stopImpersonatingAccount = stopImpersonatingAccount;
  }

  if (IS_IMPERSONATING) {
    console.warn(
      '%cYou are in DEBUG MODE. All RPC requests will be called from the impersonated account. However transactions still will be signed with your connected wallet.\nTo stop impersonation, run stopImpersonatingAccount().',
      'background: red; color: white; font-size: 16px; padding: 4px;',
    );
  }
})();

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

export function impersonateAccount(address?: string) {
  if (!address || !ethers.utils.isAddress(address.toLowerCase())) {
    throw new Error("It's not a valid Ethereum address.");
  }
  const lowercasedAddress = address.toLowerCase();
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('impersonate', lowercasedAddress);
    window.location.reload();
  }
}

export function stopImpersonatingAccount() {
  if (typeof localStorage !== 'undefined') {
    localStorage.removeItem('impersonate');
    window.location.reload();
  }
}

declare global {
  interface Window {
    impersonateAccount: (address: string) => void;
    stopImpersonatingAccount: () => void;
  }
}

(() => {
  if (typeof window !== 'undefined') {
    window.impersonateAccount = impersonateAccount;
    window.stopImpersonatingAccount = stopImpersonatingAccount;
  }

  if (IS_IMPERSONATING) {
    console.log(
      '%cYou are in DEBUG MODE. All RPC requests will be called from the impersonated account. However transactions still will be signed with your connected wallet.\nTo stop impersonation, run stopImpersonatingAccount().',
      'background: red; color: white; font-size: 16px; padding: 4px;',
    );
  }
})();

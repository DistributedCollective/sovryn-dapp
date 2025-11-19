import { useMemo } from 'react';

export const useERC20BridgeLocked = () => {
  // TODO: Replace with real maintenance state check when available
  // For now, just return false (not locked) or true (locked) for testing
  return useMemo(() => true, []); // Change to true to simulate maintenance mode
};

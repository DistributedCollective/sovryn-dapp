import { useCallback, useEffect, useMemo, useState } from 'react';

import { ethers } from 'ethers';

import { getContract } from '@sovryn/contracts';

import { useAccount } from '../../../../hooks/useAccount';
import { getRskChainId } from '../../../../utils/chain';

export const useGetSubsidiesAPR = () => {
  const { signer } = useAccount();
  const [apr, setAPR] = useState(0);

  const getCommunityIssuance = useCallback(async () => {
    const { address, abi: communityIssuance } = await getContract(
      'communityIssuance',
      'zero',
      getRskChainId(),
    );

    return new ethers.Contract(address, communityIssuance, signer);
  }, [signer]);

  const updateAPR = useCallback(async () => {
    const communityIssuance = await getCommunityIssuance();
    const APR = await communityIssuance.APR();
    setAPR(Number(APR.toString()) / 100);
  }, [getCommunityIssuance]);

  const apy = useMemo(() => {
    return (Math.pow(1 + apr / 36525, 365.25) - 1) * 100;
  }, [apr]);

  useEffect(() => {
    updateAPR();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    apr,
    apy,
    updateAPR,
  };
};

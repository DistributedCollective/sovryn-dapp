import { useEffect, useMemo, useState } from 'react';

import { Decimal } from '@sovryn/utils';

import { ProposalCreationParameter } from '../../../5_pages/BitocracyPage/contexts/ProposalContext.types';
import { useGetTokenContract } from '../../../../hooks/useGetContract';
import { DEFAULT_TREASURY_EXECUTABLE_DETAIL } from '../ProposalExecutableDetails.constants';
import {
  isTreasuryProposalParameter,
  decodeTreasuryCalldata,
} from '../ProposalExecutableDetails.utils';
import { COMMON_SYMBOLS } from '../../../../utils/asset';
import { getAssetDataByAddress } from '@sovryn/contracts';
import { RSK_CHAIN_ID } from '../../../../config/chains';

export const useGetTreasuryExecutableDetail = (
  parameter: ProposalCreationParameter,
) => {
  const [assetName, setAssetName] = useState<string | undefined>();
  const rbtcContract = useGetTokenContract(COMMON_SYMBOLS.BTC);

  const isTreasuryProposal = useMemo(
    () => isTreasuryProposalParameter(parameter.signature),
    [parameter.signature],
  );

  const isRbtcTransfer = useMemo(
    () => parameter.signature === 'transferRbtc',
    [parameter.signature],
  );

  const treasuryData = useMemo(() => {
    if (isTreasuryProposal) {
      const data = decodeTreasuryCalldata(
        parameter.signature,
        parameter.calldata,
      );

      return data;
    }
  }, [isTreasuryProposal, parameter.calldata, parameter.signature]);

  useEffect(() => {
    if (!treasuryData) {
      return;
    }

    if (isRbtcTransfer) {
      setAssetName(COMMON_SYMBOLS.BTC);
    } else {
      const resolveToken = async () =>
        await getAssetDataByAddress(treasuryData[1], RSK_CHAIN_ID);

      resolveToken().then(result => setAssetName(result.symbol));
    }
  }, [isRbtcTransfer, treasuryData]);

  return treasuryData
    ? {
        assetName,
        assetAmount: Decimal.fromBigNumberString(
          treasuryData[isRbtcTransfer ? 1 : 2].toString(),
        ),
        assetAddress: isRbtcTransfer ? rbtcContract?.address : treasuryData[1],
        recipientAddress: treasuryData[0],
      }
    : DEFAULT_TREASURY_EXECUTABLE_DETAIL;
};

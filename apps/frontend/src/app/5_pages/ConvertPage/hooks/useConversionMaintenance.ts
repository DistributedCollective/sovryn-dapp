import { useMemo } from 'react';

import { SupportedTokens } from '@sovryn/contracts';
import { SwapRoute } from '@sovryn/sdk';

import { useMaintenance } from '../../../../hooks/useMaintenance';

export const useConversionMaintenance = (
  sourceToken: SupportedTokens,
  destinationToken: SupportedTokens,
  route?: SwapRoute,
) => {
  const { checkMaintenance, States } = useMaintenance();

  const convertLocked = checkMaintenance(States.ZERO_CONVERT);
  const dllrLocked = checkMaintenance(States.ZERO_DLLR);

  const srcMocLocked = checkMaintenance(States.ZERO_CONVERT_SRC_MOC);
  const srcMyntLocked = checkMaintenance(States.ZERO_CONVERT_SRC_MYNT);
  const srcSOVLocked = checkMaintenance(States.ZERO_CONVERT_SRC_SOV);

  const srcBNBSRBTCLocked = checkMaintenance(States.ZERO_CONVERT_SRC_BNBSRBTC);
  const srcDLLRRBTCLocked = checkMaintenance(States.ZERO_CONVERT_SRC_DLLRRBTC);
  const srcETHSRBTCLocked = checkMaintenance(States.ZERO_CONVERT_SRC_ETHSRBTC);
  const srcFISHRBTCLocked = checkMaintenance(States.ZERO_CONVERT_SRC_FISHRBTC);
  const srcMOCRBTCLocked = checkMaintenance(States.ZERO_CONVERT_SRC_MOCRBTC);
  const srcRIFRBTCLocked = checkMaintenance(States.ZERO_CONVERT_SRC_RIFRBTC);
  const srcSOVRBTCLocked = checkMaintenance(States.ZERO_CONVERT_SRC_SOVRBTC);

  return useMemo(() => {
    let isLocked = convertLocked;

    isLocked = isLocked || (route?.name === 'AMM' && srcSOVLocked);
    isLocked = isLocked || (route?.name === 'MocIntegration' && srcMocLocked);
    isLocked = isLocked || (route?.name === 'MyntBasset' && srcMyntLocked);
    isLocked = isLocked || (route?.name === 'ZeroRedemption' && srcSOVLocked);

    isLocked =
      isLocked ||
      (dllrLocked &&
        [sourceToken, destinationToken].includes(SupportedTokens.dllr));

    if (destinationToken === SupportedTokens.rbtc) {
      isLocked =
        isLocked || (srcBNBSRBTCLocked && sourceToken === SupportedTokens.bnbs);
      isLocked =
        isLocked || (srcDLLRRBTCLocked && sourceToken === SupportedTokens.dllr);
      isLocked =
        isLocked || (srcETHSRBTCLocked && sourceToken === SupportedTokens.eths);
      isLocked =
        isLocked || (srcFISHRBTCLocked && sourceToken === SupportedTokens.fish);
      isLocked =
        isLocked || (srcMOCRBTCLocked && sourceToken === SupportedTokens.moc);
      isLocked =
        isLocked || (srcRIFRBTCLocked && sourceToken === SupportedTokens.rif);
      isLocked =
        isLocked || (srcSOVRBTCLocked && sourceToken === SupportedTokens.sov);
    }

    return isLocked;
  }, [
    convertLocked,
    destinationToken,
    dllrLocked,
    route?.name,
    sourceToken,
    srcBNBSRBTCLocked,
    srcDLLRRBTCLocked,
    srcETHSRBTCLocked,
    srcFISHRBTCLocked,
    srcMOCRBTCLocked,
    srcMocLocked,
    srcMyntLocked,
    srcRIFRBTCLocked,
    srcSOVLocked,
    srcSOVRBTCLocked,
  ]);
};

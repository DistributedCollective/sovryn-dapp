import { useCallback, useContext, useEffect, useState } from 'react';

import { RSK_CHAIN_ID } from '../../../../config/chains';

import { useAccount } from '../../../../hooks/useAccount';
import { useGetProtocolContract } from '../../../../hooks/useGetContract';
import { DepositContext } from '../contexts/deposit-context';
import AddressMappingSigner from '../utils/addressMappingSignature';

export const useValidateFederators = () => {
  const { address, signatures } = useContext(DepositContext);
  const { account } = useAccount();

  const [isSignatureValid, setIsSignatureValid] = useState(false);
  const [loading, setIsLoading] = useState(true);

  const fastBtcMultisigContract = useGetProtocolContract('fastBtcMultisig');

  const validateSignatures = useCallback(async () => {
    if (!fastBtcMultisigContract) {
      return false;
    }

    const requiredFederators = await fastBtcMultisigContract.required();
    const currentFederators = await fastBtcMultisigContract.getOwners();

    const addressMappingSigner = new AddressMappingSigner();
    let verified: number = 0;
    for (let i = 0; i < signatures.length; i++) {
      let signature = signatures[i];
      const signingAddress = await addressMappingSigner.getSigningAddress(
        address,
        account,
        signature.signature,
        RSK_CHAIN_ID,
        fastBtcMultisigContract.address,
      );

      if (signature.signer === signingAddress) {
        for (let i = 0; i < currentFederators.length; i++) {
          if (currentFederators[i].toLowerCase() === signingAddress) {
            verified++;
          }
        }
      }
    }
    return verified >= requiredFederators;
  }, [account, address, fastBtcMultisigContract, signatures]);

  useEffect(() => {
    validateSignatures().then(isValid => {
      setIsSignatureValid(isValid);
      setIsLoading(false);
    });
  }, [loading, validateSignatures]);

  return { isSignatureValid, loading };
};

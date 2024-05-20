import utf8 from 'utf8';
import { constants, providers } from 'ethers';
import { splitSignature } from 'ethers/lib/utils';
import { PermitTransactionResponse } from '../types';

const NONCES_FN = '0x7ecebe00';
const NAME_FN = '0x06fdde03';

const zeros = (numZeros: number) => ''.padEnd(numZeros, '0');

export const preparePermitResponse = (
  { owner, spender, value, nonce, deadline }: Record<string, any>,
  signature: string,
): PermitTransactionResponse => {
  const { r, s, v } = splitSignature(signature);
  return {
    r,
    s,
    v,
    owner,
    spender,
    value,
    nonce,
    deadline,
  };
};

export const hexToUtf8 = (hex: string) => {
  let str = '';
  let code = 0;
  hex = hex.replace(/^0x/i, '');

  // remove 00 padding from either side
  hex = hex.replace(/^(?:00)*/, '');
  hex = hex.split('').reverse().join('');
  hex = hex.replace(/^(?:00)*/, '');
  hex = hex.split('').reverse().join('');

  let l = hex.length;

  for (let i = 0; i < l; i += 2) {
    code = parseInt(hex.substr(i, 2), 16);
    str += String.fromCharCode(code);
  }

  return utf8.decode(str);
};

export const prepareERC2612Permit = async (
  provider: providers.Provider,
  tokenAddress: string,
  owner: string,
  spender: string,
  value: string | number = constants.MaxUint256.toString(),
  deadline?: number,
  nonce?: number,
) => {
  const name = await provider
    .call({ to: tokenAddress, data: NAME_FN })
    .then((res: string) => res.substr(130))
    .then(hexToUtf8);

  const typedData = {
    types: {
      // EIP712Domain: [
      //   { name: 'name', type: 'string' },
      //   { name: 'version', type: 'string' },
      //   { name: 'chainId', type: 'uint256' },
      //   { name: 'verifyingContract', type: 'address' },
      // ],
      Permit: [
        { name: 'owner', type: 'address' },
        { name: 'spender', type: 'address' },
        { name: 'value', type: 'uint256' },
        { name: 'nonce', type: 'uint256' },
        { name: 'deadline', type: 'uint256' },
      ],
    },
    domain: {
      name,
      version: '1',
      chainId: (await provider.getNetwork()).chainId,
      verifyingContract: tokenAddress,
    },
    values: {
      owner,
      spender,
      value,
      nonce:
        nonce === undefined
          ? await provider.call({
              to: tokenAddress,
              data: `${NONCES_FN}${zeros(24)}${owner.substr(2)}`,
            })
          : nonce,
      deadline: deadline || constants.MaxUint256.toString(),
    },
  };

  return {
    domain: typedData.domain,
    types: typedData.types,
    values: typedData.values,
  };
};

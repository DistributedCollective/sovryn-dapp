import { getTokenDetailsByAddress } from '@sovryn/contracts';
import { ethers, providers } from 'ethers';
import { getRskChainId } from '../chain';
import utf8 from 'utf8';
import { verifyTypedData } from 'ethers/lib/utils';

const MAX_INT =
  '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';

const EIP712Domain = [
  { name: 'name', type: 'string' },
  { name: 'version', type: 'string' },
  { name: 'chainId', type: 'uint256' },
  { name: 'verifyingContract', type: 'address' },
];

const NONCES_FN = '0x7ecebe00';
const NAME_FN = '0x06fdde03';

const zeros = (numZeros: number) => ''.padEnd(numZeros, '0');

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

const splitSignatureToRSV = (signature: string) => {
  const r = '0x' + signature.substring(2).substring(0, 64);
  const s = '0x' + signature.substring(2).substring(64, 128);
  const v = parseInt(signature.substring(2).substring(128, 130), 16);
  return { r, s, v };
};

export const signERC2612Permit = async (
  signer: providers.JsonRpcSigner,
  tokenAddress: string,
  owner: string,
  spender: string,
  value: string | number = MAX_INT,
  deadline?: number,
  nonce?: number,
) => {
  const name =
    (await getTokenDetailsByAddress(tokenAddress)
      .then(token => token.symbol.toUpperCase())
      .catch()) ??
    (await signer
      .call({ to: tokenAddress, data: NAME_FN })
      .then((res: string) => res.substr(130))
      .then(hexToUtf8));

  const domain = {
    name,
    version: '1',
    chainId: Number(getRskChainId()),
    verifyingContract: tokenAddress,
  };

  const types = {
    Permit: [
      { name: 'owner', type: 'address' },
      { name: 'spender', type: 'address' },
      { name: 'value', type: 'uint256' },
      { name: 'nonce', type: 'uint256' },
      { name: 'deadline', type: 'uint256' },
    ],
  };

  const message = {
    owner,
    spender,
    value,
    nonce:
      nonce === undefined
        ? await signer.call({
            to: tokenAddress,
            data: `${NONCES_FN}${zeros(24)}${owner.substr(2)}`,
          })
        : nonce,
    deadline: deadline || MAX_INT,
  };

  const signature = await signer._signTypedData(domain, types, message);

  const verified = verifyTypedData(domain, types, message, signature);

  console.log('verified', verified, verified === owner);

  const { r, s, v } = splitSignatureToRSV(signature);
  return { r, s, v, ...message };
};

import { SupportedTokens } from '@sovryn/contracts';

export const bassets = [SupportedTokens.zusd, SupportedTokens.doc];
export const masset = SupportedTokens.dllr;

export const allowedTokens = [...bassets, masset];

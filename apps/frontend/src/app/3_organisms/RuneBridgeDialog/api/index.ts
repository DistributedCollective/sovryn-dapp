import { currentNetwork } from '../../../../utils/helpers';
import { endpoints } from '../config';
import RuneBridgeClient from './RuneBridgeClient';

const baseUrl = `${endpoints[currentNetwork]}/api/v1`;

export const runeBridgeApiClient = new RuneBridgeClient(baseUrl);

import { BigNumber, ethers } from 'ethers';
import { CrocContext } from './context';

/* This is the main entry point for the Croc SDK. It provides a high-level interface
 * for interacting with CrocSwap smart contracts in an ergonomic way. */
export class CrocSlotReader {
    constructor (context: Promise<CrocContext>) {
        this.provider = context.then(p => p.provider)
        this.dex = context.then(c => c.dex.address)
    }

    async isHotPathOpen(): Promise<boolean> {
        const STATE_SLOT = 0
        const HOT_OPEN_OFFSET = 22

        const hotShiftBits = 8 * (32 - HOT_OPEN_OFFSET)
        const slotVal = this.readSlot(STATE_SLOT).then(BigNumber.from)
        return (await slotVal).shl(hotShiftBits).shr(255).gt(0)
    }

    async readSlot (slot: number): Promise<string> {
        return (await this.provider).getStorageAt(await this.dex, slot)
    }

    async proxyContract (proxyIdx: number): Promise<string> {
        const PROXY_SLOT_OFFSET = 1

        const slotVal = await this.readSlot(PROXY_SLOT_OFFSET + proxyIdx)
        return "0x" + slotVal.slice(26)
    }

    readonly provider: Promise<ethers.providers.Provider>
    readonly dex: Promise<string>
}

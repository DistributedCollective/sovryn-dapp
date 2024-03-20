import { CrocContext } from './context';
import { CrocTokenView, sortBaseQuoteViews } from './tokens';

type Address = string
type BlockTag = number | string

export class CrocPositionView {
    constructor (base: CrocTokenView, quote: CrocTokenView, owner: Address, context: Promise<CrocContext>) {
        [this.baseToken, this.quoteToken] = 
            sortBaseQuoteViews(base, quote)
        this.owner = owner
        this.context = context
    }

    async queryRangePos (lowerTick: number, upperTick: number, block?: BlockTag) {
        let blockArg = toCallArg(block)
        let context = await this.context
        return context.query.queryRangePosition(this.owner, 
            this.baseToken.tokenAddr, this.quoteToken.tokenAddr, 
            context.chain.poolIndex, lowerTick, upperTick, blockArg)
    }

    async queryAmbient (block?: BlockTag) {
        let blockArg = toCallArg(block)
        let context = await this.context
        return context.query.queryAmbientPosition(this.owner, 
            this.baseToken.tokenAddr, this.quoteToken.tokenAddr, 
            context.chain.poolIndex, blockArg)
    }

    async queryKnockoutLivePos (isBid: boolean, lowerTick: number, upperTick: number, block?: BlockTag) {
        let blockArg = toCallArg(block)
        let context = await this.context
        let pivotTick = isBid ? lowerTick : upperTick
        
        const pivotTime = (await context.query.queryKnockoutPivot(
            this.baseToken.tokenAddr, this.quoteToken.tokenAddr, 
            context.chain.poolIndex, isBid, pivotTick, blockArg)).pivot

        return context.query.queryKnockoutTokens(this.owner,
                this.baseToken.tokenAddr, this.quoteToken.tokenAddr, 
                context.chain.poolIndex, pivotTime, isBid, lowerTick, upperTick, blockArg)
    }   

    async queryRewards (lowerTick: number, upperTick: number, block?: BlockTag) {
        let blockArg = toCallArg(block)
        let context = await this.context
        return (await context.query.queryConcRewards(this.owner, 
            this.baseToken.tokenAddr, this.quoteToken.tokenAddr, 
            context.chain.poolIndex, lowerTick, upperTick, blockArg))
    }

    readonly owner: Address
    readonly baseToken: CrocTokenView
    readonly quoteToken: CrocTokenView
    readonly context: Promise<CrocContext>
}

function toCallArg (block?: BlockTag): { blockTag?: BlockTag } {
    return block ? { blockTag: block } : {}
}
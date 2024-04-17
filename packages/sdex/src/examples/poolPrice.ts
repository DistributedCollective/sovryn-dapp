import { ETH, USDC } from '../constants/mainnetTokens';
import { CrocEnv } from '../croc';


async function demo() {

    const croc = new CrocEnv("mainnet")

    const spotPrice = await croc.pool(ETH, USDC).spotPrice()
    console.log(`ETH/USDC Spot Price: ${spotPrice.toString()}`)

    const displayPrice = await croc.poolEthQuote(USDC).displayPrice()
    console.log(`ETH/USDC Price: ${displayPrice}`)

    const invDispPrice = await croc.poolEth(USDC).displayPrice()
    console.log(`USDC/ETH Price: ${invDispPrice}`)
}

demo()

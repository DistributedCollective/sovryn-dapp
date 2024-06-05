/* eslint-disable @typescript-eslint/no-unused-vars */
import { ethers } from 'ethers';

//import { ERC20_READ_ABI } from '../abis/erc20.read';
import { CrocEnv } from '../croc';

// import { priceToTick } from '../utils/price';

//const ETH = ethers.constants.AddressZero
const AddressZero = ethers.constants.AddressZero;
//const DAI = "0xdc31Ee1784292379Fbb2964b3B9C4124D8F89C60"

// Scroll
//const USDC = '0x06eFdBFf2a14a7c8E15944D1F4A48F9F95F663A4';

// Mainnet
//const USDC = "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"

// Sepolia
//const USDC = "0x60bBA138A74C5e7326885De5090700626950d509"

// USDC/ETH lpConduit
//const USDC_ETH_LP_CONDUIT = '0x8c1A6FfA18183ef223d5Eb3b0A0208515E64bB88';
//const USDC_ETH_LP_CONDUIT = '0xe3De48e0Fcbd095BBF5C8C60E6af2f5Eb9c6c09a';

// deepcode ignore HardcodedSecret: testnet dummy key
const KEY =
  process.env.WALLET_KEY ||
  '0x7c5e2cfbba7b00ba95e5ed7cd80566021da709442e147ad3e08f23f5044a3d5a';

// const SLIPPAGE_TORELANCE = 0.05; // 0.05%

async function demo() {
  const wallet = new ethers.Wallet(KEY);

  const croc = new CrocEnv('bob', wallet);

  // const mockTokens = {
  //   ETH: AddressZero,
  //   WBTC: '0xF40A3C629661AF37010FAFbACA2eb4aA37d9abAa',
  //   tBTC: '0x42527B3ba7100ECA14c9405016752B6121328582',
  //   rETH: '0x0458b6a3b20a20D263df49D72dA928BfFe4473F3',
  //   USDT: '0x26bF6A30286cE03176BF3B026Aa1f87b566ca891',
  //   DAI: '0x9FF262Fe3CB0c5AeDF081c580067BA846881Ed3C',
  //   SOV: '0x93A37dDD1860a14C2d740f576C6BE5502A1ef06b',
  //   ALEX: '0x41aBc192389aC3B63BBb5751984956eD8B2AB4A9',
  //   USDC: '0xBd95925809F916eCFe140f6Ef70eA43185c0ECD9',
  //   DLLR: '0xf545c0d1BaAAF7De1d2E0B2d2c1D59a0338ecCC2',
  //   POWA: '0x4Ad48819AB9f6601849dD4b73DF9b115C4AeFa3a',
  //   WSTETH: '0x7fA3A90d5B19E6E4Bf4FD6F64904f2F953F30eaf',
  // };

  //eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
  // const [SOV, DAI, USDT, USDC, DLLR, tBTC, WBTC] = [
  //   // @todo replace with real tokens - NOT MOCKED!
  //   mockTokens.SOV,
  //   mockTokens.DAI,
  //   mockTokens.USDT,
  //   mockTokens.USDC,
  //   mockTokens.DLLR,
  //   mockTokens.tBTC,
  //   mockTokens.WBTC,
  // ];

  const bobMainnetTokens = {
    ETH: AddressZero,
    WBTC: '0x03c7054bcb39f7b2e5b2c7acb37583e32d70cfa3',
    tBTC: '0xBBa2eF945D523C4e2608C9E1214C2Cc64D4fc2e2',
    rETH: '0xb5686c4f60904ec2bda6277d6fe1f7caa8d1b41a',
    USDT: '0x05d032ac25d322df992303dca074ee7392c117b9',
    DAI: '0x6c851f501a3f24e29a8e39a29591cddf09369080',
    SOV: '0xba20a5e63eeEFfFA6fD365E7e540628F8fC61474',
    USDC: '0xe75D0fB2C24A55cA1e3F96781a2bCC7bdba058F0',
    DLLR: '0xf3107eEC1e6F067552C035FD87199e1A5169CB20',
    POWA: '0xd0C2f08a873186db5cFB7b767dB62BEF9e495BFF',
    wstETH: '0x85008aE6198BC91aC0735CB5497CF125ddAAc528',
  };

  //eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
  const [ETH, WBTC, tBTC, rETH, USDT, DAI, SOV, USDC, DLLR, POWA, wstETH] = [
    bobMainnetTokens.ETH,
    bobMainnetTokens.WBTC,
    bobMainnetTokens.tBTC,
    bobMainnetTokens.rETH,
    bobMainnetTokens.USDT,
    bobMainnetTokens.DAI,
    bobMainnetTokens.SOV,
    bobMainnetTokens.USDC,
    bobMainnetTokens.DLLR,
    bobMainnetTokens.POWA,
    bobMainnetTokens.wstETH,
  ];

  // ----- AMBIENT LIQUIDITY -----
  // USDT/SOV
  // let spotPrice = await croc.pool(USDT, SOV, 410).spotPrice();
  // console.log(`USDT/SOV Spot Price: ${spotPrice.toString()}`);
  // spotPrice = await croc.pool(SOV, USDT, 410).spotPrice();
  // console.log(`SOV/USDT Spot Price: ${spotPrice.toString()}`);

  // const usdt2LpConduit = '0x1e894177d9f28CC3150ECB30E458bD9438D6C46e'; // SOV/USDT
  // let amountParam = 28231.073;
  // let encodedData = await croc
  //   .pool(SOV, USDT, 410)
  //   .encodeMintAmbientQuote(amountParam, [1.8, 2.5], usdt2LpConduit);
  // console.log('Encoded data to deposit', amountParam, ' USDT:', encodedData);

  // await burnAmbientLiquidity(croc, {
  //   base: USDT,
  //   quote: SOV,
  //   poolIndex: 410,
  //   amountInBase: 28231.07, // passing 28k SOV, USDT side will be calculated
  //   lpConduit: usdt2LpConduit,
  //   price: price,// price
  //   slippageTolerancePercentage,
  // })

  // await burnAmbientLiquidity(croc, {
  //   base: USDC,
  //   quote: SOV,
  //   poolIndex: 410,
  //   amountInBase: 0.11062517, // passing 28k SOV, USDT side will be calculated
  //   lpConduit: '0x941fEF5263f46dc7c00CD122CcA2b8559CA8FB96',
  //   price: price, // price
  //   slippageTolerancePercentage,
  // });

  //BURN EXAMPLE
  // const lpConduit = '0x1e894177d9f28CC3150ECB30E458bD9438D6C46e';
  // const SLIPPAGE_TORELANCE = 0.05; // 0.05%
  // type PriceRange = [number, number];
  // const pool = croc.pool(USDT, SOV, 410);
  // const poolPrice = await pool.displayPrice();
  // const limits: PriceRange = [
  //   poolPrice * (1 - SLIPPAGE_TORELANCE / 100),
  //   poolPrice * (1 + SLIPPAGE_TORELANCE / 100),
  // ];
  // console.log(`burning from USDT - SOV 0.01 LP token USDT`);
  // console.log('pool price:', poolPrice);
  // console.log(
  //   'encoded_data: ',
  //   //await pool.burnAmbientLiq(ethers.utils.parseEther('0.0193363'), limits, {
  //   await pool.burnAmbientLiq(
  //     ethers.utils.parseEther('0.01'), //909.944828342431797637
  //     limits,
  //     {
  //       lpConduit: lpConduit,
  //     },
  //   ),
  //   console.log('-'.repeat(50)),
  // );

  // // USDC/SOV
  // spotPrice = await croc.pool(USDC, SOV, 410).spotPrice();
  // console.log(`USDC/SOV Spot Price: ${spotPrice.toString()}`);
  // spotPrice = await croc.pool(SOV, USDC, 410).spotPrice();
  // console.log(`SOV/USDC Spot Price: ${spotPrice.toString()}`);

  // usdt2LpConduit = '0x941fEF5263f46dc7c00CD122CcA2b8559CA8FB96'; // SOV/USDC
  // amountParam = 161363.41;
  // encodedData = await croc
  //   .pool(SOV, USDC, 410)
  //   .encodeMintAmbientQuote(amountParam, [1.8, 2.5], usdt2LpConduit);
  // console.log('Encoded data to deposit', amountParam, 'USDC:', encodedData);

  // // DAI/SOV
  // spotPrice = await croc.pool(DAI, SOV, 410).spotPrice();
  // console.log(`DAI/SOV Spot Price: ${spotPrice.toString()}`);
  // spotPrice = await croc.pool(SOV, DAI, 410).spotPrice();
  // console.log(`SOV/DAI Spot Price: ${spotPrice.toString()}`);

  // usdt2LpConduit = '0x83c0E209589782DDe525Dfa20Ad19a502841eAA6'; // SOV/DAI
  // amountParam = 14889.096;
  // encodedData = await croc
  //   .pool(SOV, DAI, 410)
  //   .encodeMintAmbientQuote(amountParam, [1.8, 2.5], usdt2LpConduit);
  // console.log('Encoded data to deposit', amountParam, 'DAI:', encodedData);

  // //@todo add WBTC, tBTC, ETH, wstETH, rETH ambient pools paired with SOV

  // // --- ENCODE DEPOSIT FOR CONCENTRATED LIQ POOLS ----
  // type PriceRange = [number, number];
  // type TickRange = [number, number];

  // async function getEncodedMintRangeQuote(
  //   baseToken: string,
  //   quoteToken: string,
  //   poolIdx: number,
  //   amount: number,
  //   tickGrid: number,
  //   tickRangeParam: TickRange,
  //   limits: PriceRange,
  // ): Promise<string> {
  //   const tickRange: TickRange = [
  //     priceToTick(tickRangeParam[0]),
  //     priceToTick(tickRangeParam[1]),
  //   ].map(
  //     x => x + (x % tickGrid > 0 ? tickGrid - (x % tickGrid) : 0),
  //   ) as TickRange; //cast to the nearest tick multiple of tickGrid
  //   return await croc
  //     .pool(baseToken, quoteToken, poolIdx)
  //     .encodeMintRangeQuote(amount, tickRange, limits);
  // }

  // // let price;
  // let tickGrid;
  // let poolIdx;
  // let tickRange: TickRange;
  // let priceLimit: PriceRange;
  // let cpoolEncodedData;
  // let amount;

  // // SOV/DLLR
  // amount = 100000;
  // const price = 2;
  // tickGrid = 4;
  // poolIdx = 400; //0.1% fee
  // tickRange = [price * 0.2, price * 5]; //80% down, 5X up
  // priceLimit = [1.8, 2.5]; //>= 1.8 DLLR/SOV, <= 2.5 DLLR/SOV
  // cpoolEncodedData = await getEncodedMintRangeQuote(
  //   SOV,
  //   DLLR,
  //   poolIdx,
  //   amount,
  //   tickGrid,
  //   tickRange,
  //   priceLimit,
  // );
  // console.log('cpoolEncodedData for SOV/DLLR:', cpoolEncodedData);

  // // ----- STABLES ----------
  // amount = 50000;
  // tickGrid = 4;
  // poolIdx = 400;
  // tickRange = [0.9957, 1.0068]; //base on ambient app price
  // priceLimit = [0.9957, 1.0068]; //>= 1.8 DLLR/SOV, <= 2.5 DLLR/SOV

  // // USDC/USDT
  // cpoolEncodedData = await getEncodedMintRangeQuote(
  //   USDT,
  //   USDC,
  //   poolIdx,
  //   amount,
  //   tickGrid,
  //   tickRange,
  //   priceLimit,
  // );
  // console.log('cpoolEncodedData for USDC/USDT:', cpoolEncodedData);

  // // USDT/DLLR
  // cpoolEncodedData = await getEncodedMintRangeQuote(
  //   USDT,
  //   DLLR,
  //   poolIdx,
  //   amount,
  //   tickGrid,
  //   tickRange,
  //   priceLimit,
  // );
  // console.log('cpoolEncodedData for USDT/DLLR:', cpoolEncodedData);

  // // tBTC/WBTC
  // cpoolEncodedData = await getEncodedMintRangeQuote(
  //   tBTC,
  //   WBTC,
  //   poolIdx,
  //   amount,
  //   tickGrid,
  //   tickRange,
  //   priceLimit,
  // );
  // console.log('cpoolEncodedData for tBTC/WBTC:', cpoolEncodedData);

  //croc.poolEth(DAI).initPool()

  /*await croc.poolEth(DAI).mintAmbientQuote(50, [0.0005, 0.000625])
    await croc.poolEthQuote(DAI).mintAmbientBase(50, [1600, 1700])*/
  //await croc.poolEthQuote(DAI).mintRangeBase(50, [-80000, -64000], [1600, 1700])

  /*await croc.poolEthQuote(DAI).mintRangeBase(5, [-80000, -64000], [1600, 1700], { surplus: [true, false]})
    await croc.poolEthQuote(DAI).mintRangeBase(5, [-80000, -64000], [1600, 1700], { surplus: [false, true]})*/

  //await croc.poolEth(DAI).mintAmbientBase(0.0001, [0.0001, 0.001])
  //await croc.poolEth(DAI).mintAmbientQuote(50, [0.0001, 0.001])

  // await croc
  //   .poolEth(DAI)
  //   .mintRangeBase(0.03, [-640000, 640000], [0.0001, 0.001]);
  //await croc.poolEth(DAI).mintRangeQuote(50, [-640000, 640000], [0.0001, 0.001])

  //await croc.poolEth(DAI).burnAmbientAll([0.0001, 0.001])

  //await croc.sellEth(0.0001).for(DAI).swap()
  //await croc.sell(DAI, 0.0001).forEth().swap()
  /*await croc.buy(DAI, 0.0001).withEth().swap()*/
  //await croc.buyEth(0.01).with(DAI).swap()
  //await croc.sellEth(0.01).for(DAI, { slippage: 0.1}).swap()

  //console.log(await croc.sellEth(20).for(DAI, { slippage: .05}).calcImpact())

  // Pay ETH from wallet, receive DAI to exchange balance
  /*await croc.sellEth(0.01).for(DAI).swap({surplus: [false, true]})

    // Pay ETH from exchange balance, receive DAI to wallet
    await croc.sellEth(0.01).for(DAI).swap({surplus: [false, true]})

    // Pay DAI from exchange balance, receive ETH to wallet
    await croc.buyEth(0.01).with(DAI).swap({surplus: [true, false]})

    // Pay DAI from wallet, receive ETH to exchange balance
    await croc.buyEth(0.01).with(DAI).swap({surplus: [false, true]})

    // Pay ETH to receive DAI, both to/from exchange balance
    await croc.buy(DAI, 100).withEth().swap({surplus: true})

    // Pay ETH to receive DAI, both to/from wallet
    await croc.buy(DAI, 10).withEth().swap({surplus: false})

    // Pay ETH to receive DAI, both to/from wallet
    await croc.buy(DAI, 10).withEth().swap()*/

  // Pays DAI to wallet and ETH to exchange balance
  //await croc.pool(DAI, ETH).burnAmbientLiq(BigNumber.from(10).pow(7), [0.0001, 0.001], {surplus: [false, true]})

  // Pays DAI to exchange balance and ETH to wallet
  /*await croc.pool(DAI, ETH).burnAmbientLiq(BigNumber.from(10).pow(7), [0.0001, 0.001], {surplus: [true, false]})

    // Pays ETH to exchange balance and DAI to wallet
    await croc.pool(ETH, DAI).burnAmbientLiq(BigNumber.from(10).pow(7), [1000, 10000], {surplus: [true, false]})

    // Pays ETH to wallet and DAI to exchange balance
    await croc.pool(ETH, DAI).burnAmbientLiq(BigNumber.from(10).pow(7), [1000, 10000], {surplus: [false, true]})*/

  // Mint new limit order for $25. Pay from exchange balance
  /*croc.sell(DAI, 200).atLimit(ETH, -64000).burn({surplus: true})*/

  // Burn $10 worth of existing limit order. Receive to wallet
  //croc.sell(DAI, 10).atLimit(ETH, -64000).mint({surplus: false})

  // Burn 1 billion units of concentrated liquidity for the limit order
  //croc.sell(DAI, 2).atLimit(ETH, -64000).burnLiq(BigNumber.from(1000000000))

  /*console.log(await (await croc.token(DAI).balance(wallet.address)).toString())
    console.log(await (await croc.tokenEth().balance(wallet.address)).toString())

    ///console.log(baseTokenForQuoteConc(100, 1600, 1700))

    //croc.buy(DAI, 10).atLimit(ETH, -80000).mint({surplus: false})

    let plan = croc.buy(USDC, 1).with(ETH)
    console.log((await plan.impact))
    console.log((await plan.calcSlipQty()).toString())*/

  /*console.log(await croc.poolEthQuote(DAI).spotTick())
    console.log(await croc.poolEthQuote(DAI).displayPrice())*/

  //console.log(await croc.poolEth(DAI).mintAmbientQuote(50, [0.0001, 0.001]))
  //console.log(await croc.poolEthQuote(DAI).mintRangeBase(50, [-64000 - 3200, -64000,], [0.00000001, 100000.0]))
  //console.log(await croc.poolEthQuote(DAI).mintRangeBase(0.001, [-80000 - 3200, -80000,], [0.00000001, 100000.0]))

  //console.log(await croc.poolEthQuote(USDC).mintRangeBase(50, [208000 - 3200, 208000,], [0.00000001, 100000.0]))

  //console.log(await croc.poolEthQuote(DAI).mintRangeBase(0.001, [3180*64, 3182*64], [1600, 1700]))

  /*const pool = croc.poolEthQuote(DAI)
    console.log(await pool.displayToPinTick(1500))
    console.log(await pool.displayToPinTick(1600))


    let rebal = new CrocReposition(pool, { burn: [-64000 - 3200, -64000], mint: [-73792, -73088],
        liquidity: BigNumber.from(10).pow(14) })

    /*console.log((await rebal.currentCollateral()).toString())
    console.log((await rebal.balancePercent()))*/

  //console.log((await (await rebal.mintInput())))
  //console.log((await (await rebal.swapOutput())))
  //console.log(await rebal.rebal())
  /*const burnRange: [number, number] = [-64000 - 3200, -64000]
    const mintRange: [number, number] = [-76032, -72000]
    console.log(await rebal.rebal(burnRange, mintRange))*/

  //console.log(await croc.poolEthQuote(DAI).mintRangeBase(5, [-72000 - 3200, -64000,], [0.00000001, 100000.0]))
  //console.log(await croc.poolEthQuote(DAI).mintRangeBase(5, [-76032, -72000,], [1600, 1700]))
  //console.log(await croc.poolEth(DAI).mintRangeQuote(50, [-64000 - 3200, -64000,], [0.00000001, 100000.0]))
  //console.log(await croc.poolEthQuote(DAI).mintRangeBase(50, [-64000 - 3200, -64000,], [0.00000001, 100000.0]))

  //console.log(capitalConcFactor(1000, 250, 4000))*/

  /*const pool = croc.poolEthQuote(DAI)
    /*console.log(await pool.displayToPinTick(1378.62))
    console.log(await pool.displayToPinTick(1691.94))*/

  /*const pool = croc.poolEthQuote(USDC)
    console.log(await pool.spotPrice())

    console.log(await pool.cumAmbientGrowth())

    const posView = new CrocPositionView(pool, "0x9ee66F4ac79395479d6A8Bb552AF6eC3F27049CC")

    console.log(await posView.queryRangePos(199308, 201312))*/

  //console.log(await croc.poolEthQuote(USDC).displayPrice())

  //croc.sell(DAI, 200).atLimit(ETH, -64000).burn({surplus: true})

  /*console.log((await croc.tokenEth().balance("benwolski.eth")).toString())
    console.log(await croc.tokenEth().balanceDisplay("benwolski.eth"))*/

  /*croc.slotReader().isHotPathOpen().then(console.log)
    console.log(await croc.slotReader().proxyContract(1))
    console.log(await croc.slotReader().proxyContract(131))*/

  // await croc.poolEth(USDC).mintAmbientQuote(50, [0.0001, 0.001]);

  // mint USDC/ETH lp tokens
  // await croc.poolEth(USDC).mintAmbientQuote(50, [0.0001, 0.001], { lpConduit: USDC_ETH_LP_CONDUIT });
  // const lpConduitContract = new ethers.Contract(
  //   USDC_ETH_LP_CONDUIT,
  //   ERC20_READ_ABI,
  //   (await croc.context).provider,
  // );
  // const lpTokenBalance = await lpConduitContract.balanceOf(wallet.address);
  // console.log(ethers.utils.formatUnits(lpTokenBalance, 18));

  // burn USDC/ETH lp tokens
  // const lpConduitPositionView = new CrocPositionView(pool, USDC_ETH_LP_CONDUIT);
  // const lpConduitPosition = await lpConduitPositionView.queryAmbient()
  // console.log(lpConduitPosition);
  // await croc.poolEth(USDC).burnAmbientLiq(lpConduitPosition.seeds, [0.0001, 0.001], { lpConduit: USDC_ETH_LP_CONDUIT });

  // DEPOSIT/DISBURSE SURPLUS
  // const bobTreasurySafe = '0x4ff3d7a244fe5094b38bafa49290e0cc5fcbc172';
  // const receiver = bobTreasurySafe;
  // console.log('DEPOSIT SURPLUS');
  // console.log(
  //   await croc
  //     .token(SOV)
  //     .getDepositSurplusData('17694320.889337585438381886', receiver),
  // );
  // console.log('DISBURSE SURPLUS');
  // console.log(
  //   await croc
  //     .token(SOV)
  //     .getWithdrawSurplusData('17694320.889337585438381886', receiver),
  // );
}

// use --tx param to print raw encoded tx:
// yarn ts-node packages/sdex/src/examples/demo.ts --tx
demo();

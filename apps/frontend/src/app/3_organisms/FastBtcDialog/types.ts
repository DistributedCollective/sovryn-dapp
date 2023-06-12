export enum URIType {
  BITCOIN = 'bitcoin:',
}

export enum ReceiveEvents {
  txAmount = 'txAmount',
  depositTx = 'depositTx',
  transferTx = 'transferTx',
  disconnect = 'disconnect',
  getDepositAddress = 'getDepositAddress',
  getDepositHistory = 'getDepositHistory',
}

export enum OriginNetwork {
  BITCOIN = 'Bitcoin',
  ETHEREUM = 'Ethereum',
  BINANCE_SMART_CHAIN = 'BNB Smart Chain',
}

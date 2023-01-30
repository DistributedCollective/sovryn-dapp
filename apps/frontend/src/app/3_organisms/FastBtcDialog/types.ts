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

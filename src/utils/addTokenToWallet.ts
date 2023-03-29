export function addTokenToWallet(address: string, symbol: string, decimals: number, image = '') {
  window?.ethereum?.request &&
    window.ethereum?.request({
      method: 'wallet_watchAsset',
      params: {
        type: 'ERC20', // Initially only supports ERC20, but eventually more!
        options: {
          address, // The address that the token is at.
          symbol, // A ticker symbol or shorthand, up to 5 chars.
          decimals, // The number of decimals in the token
          image // A string url of the token logo
        }
      }
    })
}

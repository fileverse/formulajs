export { AAVE } from './aave/aave.js'
export { EOA } from './eoa/eoa.js'
export { BASE } from './base/base.js'
export { BLOCKSCOUT } from './blockscout/blockscout.js'
export { COINGECKO } from './coingecko/coingecko.js'
export { DEFILLAMA } from './defillama/defillama.js'
export { ETHERSCAN } from './etherscan/etherscan.js'
export { FIREFLY } from './firefly/firefly.js'
export { GNOSIS } from './gnosis/gnosis.js'
export { SAFE } from './safe/safe.js'
export { UNISWAP } from './uniswap/uniswap.js'
export { SMARTCONTRACT } from './smart-contract/smart-contract.js'
export { TALLY } from './tally/tally.js'
export { DUNE } from './dune-sim/dune-sim.js'
export { PRICE } from './price/price.js'
export { WALLET } from './wallet/wallet.js'
export { YIELD } from './yield/yield.js'
export { CIRCLES } from './circles/circles.js'
// export {GNOSISPAY} from './gnosispay/gnosispay.js'

export async function FLVURL() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([{ Yoo: 'gotcha' }])
    }, 10000)
  })
}

export function POLYMARKET() {
  return 'Coming Soon'
}

export function PRIVACYPOOL() {
  return 'Coming Soon'
}

export function ROTKI() {
  return 'Coming Soon'
}

export function MEERKAT() {
  return 'Coming Soon'
}

export function ARTEMIS() {
  return 'Coming Soon'
}

export function MYANIMELIST() {
  return 'Coming Soon'
}

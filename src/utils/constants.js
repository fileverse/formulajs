 export   const CHAIN_ID_MAP = {
    ethereum: 1,
    gnosis: 100,
    base: 8453,
  };

  export const BLOCKSCOUT_CHAINS_MAP = {
  ethereum: 'https://eth.blockscout.com',
  gnosis: 'https://gnosis.blockscout.com',
  arbitrum: 'https://arbitrum.blockscout.com',
  optimism: 'https://optimism.blockscout.com',
  soneium: 'https://soneium.blockscout.com',
  unichain: 'https://unichain.blockscout.com'
}

export const SAFE_CHAIN_MAP = {
  ethereum: 'eth',
  gnosis: 'gno',
};

export const ERROR_MESSAGES_FLAG = {
  INVALID_API_KEY: '_INVALID_KEY',
  RATE_LIMIT: '_RATE_LIMIT_REACHED',
  DEFAULT: 'FETCH_ERROR',
  MISSING_KEY: '_MISSING',
  INVALID_CHAIN: '_INVALID_CHAIN',
  INVALID_TYPE: '_INVALID_TYPE',
  INVALID_ADDRESS: '_INVALID_ADDRESS',
  INVALID_PARAM: '_INVALID_PARAM',
  MAX_PAGE_LIMIT: 'Max page limit is 250'
}

export const UTILITY = {
  ALCHEMY_API_KEY: 'ALCHEMY_API_KEY'
}
export const MAX_PAGE_LIMIT = 250
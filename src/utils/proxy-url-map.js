import { SERVICES_API_KEY } from '../crypto-constants.js';
// Proxy map configuration
const PROXY_MAP = {
    Etherscan: {
        url: "https://staging-api-proxy-ca4268d7d581.herokuapp.com/proxy",
        removeParams: ['apikey']
    },
    Basescan: {
        url: "https://staging-api-proxy-ca4268d7d581.herokuapp.com/proxy",
        removeParams: ['apikey']
    },
    Gnosisscan: {
        url: "https://staging-api-proxy-ca4268d7d581.herokuapp.com/proxy",
        removeParams: ['apikey']
    },
    Coingecko: {
        url: "https://staging-api-proxy-ca4268d7d581.herokuapp.com/proxy",
        removeParams: ['apikey']
    },
    Firefly: {
        url: "https://staging-api-proxy-ca4268d7d581.herokuapp.com/proxy",
        removeParams: ['apikey']
    },
    Neynar: {
        url: "https://staging-api-proxy-ca4268d7d581.herokuapp.com/proxy",
        removeParams: ['api_key']
    },
    Safe: {
        url: "https://staging-api-proxy-ca4268d7d581.herokuapp.com/proxy",
        removeParams: ['api_key']
    },
    Defillama: {
        url: "https://staging-api-proxy-ca4268d7d581.herokuapp.com/proxy",
        removeParams: ['api_key']
    },
    GnosisPay: {
        url: "https://staging-api-proxy-ca4268d7d581.herokuapp.com/proxy",
        removeParams: ['api_key']
    },
    // Add more services as needed. It can be direct url instead of ENV variable
    // ANOTHER_SERVICE: "https://another-proxy-url.com"
};

/**
 * Removes specified parameters from a URL
 * @param {string} url - The original URL
 * @param {string[]} paramsToRemove - Array of parameter names to remove
 * @returns {string} URL with specified parameters removed
 */
function removeUrlParams(url, paramsToRemove) {
    if (!paramsToRemove || paramsToRemove.length === 0) {
        return url;
    }

    const urlObj = new URL(url);

    paramsToRemove.forEach(param => {
        if (urlObj.searchParams.has(param)) {
            urlObj.searchParams.delete(param);
        }
    });

    return urlObj.toString();
}

/**
 * Handles URL routing through proxy or direct API calls
 * @param {string} url - The original API URL
 * @param {string} serviceName - The name of the service (e.g., 'EOA')
 * @param {string} headers - The name of the service (e.g., 'EOA')
 * @returns {Object} Object containing URL and HEADERS for the fetch request
 */
export function getUrlAndHeaders({ url, serviceName, headers = {} }) {
    // Check if proxy is enabled in localStorage
    const apiKeyLS = window.localStorage.getItem(SERVICES_API_KEY[serviceName]);
    const isProxyModeEnabledValue = apiKeyLS === 'DEFAULT_PROXY_MODE';

    // Check if proxy URL exists for this service
    const proxyConfig = PROXY_MAP[serviceName];

    // If proxy mode is enabled AND proxy URL exists for this service
    if (isProxyModeEnabledValue && proxyConfig && serviceName && SERVICES_API_KEY[serviceName]) {
        console.log('isProxyModeEnabledValue', isProxyModeEnabledValue)
        // Remove specified parameters from the target URL
        const cleanedUrl = removeUrlParams(url, proxyConfig.removeParams);

        return {
            URL: proxyConfig.url,
            HEADERS: {
                'target-url': cleanedUrl,
                method: 'GET',
                'Content-Type': 'application/json'
            }
        };
    }


    return {
        URL: url,
        HEADERS: {
            ...headers,
        }
    };
}
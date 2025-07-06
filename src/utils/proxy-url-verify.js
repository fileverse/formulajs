
// Proxy map configuration
const PROXY_MAP = {
    etherscan: {
        url: "https://staging-api-proxy-ca4268d7d581.herokuapp.com/proxy",
        removeParams: ['apikey']
    },
    basescan: {
        url: "https://staging-api-proxy-ca4268d7d581.herokuapp.com/proxy",
        removeParams: ['apikey']
    },
    gnosisscan: {
        url: "https://staging-api-proxy-ca4268d7d581.herokuapp.com/proxy",
        removeParams: ['apikey']
    },
    coingecko: {
        url: "https://staging-api-proxy-ca4268d7d581.herokuapp.com/proxy",
        removeParams: ['apikey']
    },
    firefly: {
        url: "https://staging-api-proxy-ca4268d7d581.herokuapp.com/proxy",
        removeParams: ['apikey']
    },
    neynar: {
        url: "https://staging-api-proxy-ca4268d7d581.herokuapp.com/proxy",
        removeParams: ['api_key']
    },
    safe: {
        url: "https://staging-api-proxy-ca4268d7d581.herokuapp.com/proxy",
        removeParams: ['api_key']
    },
    llama: {
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
 * @param {string} apiKey - The API key for the service
 * @param {string} serviceName - The name of the service (e.g., 'EOA')
 * @returns {Object} Object containing URL and HEADERS for the fetch request
 */
export function getUrlAndHeaders({ url, apiKeyName, serviceName, headers = {} }) {
    console.log('getUrlAndHeaders new modified function from formulajs', url, apiKeyName, serviceName)
    // Check if proxy is enabled in localStorage
    const apiKeyLS = window.localStorage.getItem(apiKeyName);
    const isProxyModeEnabledValue = apiKeyLS === 'DEFAULT_PROXY_MODE';

    // Check if proxy URL exists for this service
    const proxyConfig = PROXY_MAP[serviceName];

    // If proxy mode is enabled AND proxy URL exists for this service
    if (isProxyModeEnabledValue && proxyConfig) {
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
            method: 'GET',
            'Content-Type': 'application/json'
        }
    };
}
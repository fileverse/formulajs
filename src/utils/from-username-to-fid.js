import { SERVICES_API_KEY } from '../crypto-constants';
import { getUrlAndHeaders } from './proxy-url-verify';
const fromUsernameToFid = async (username, apiKey) => {
  if (!username) return null
  const url = `https://api.neynar.com/v2/farcaster/user/search/?q=${username}&limit=5`;
  const { URL: finalUrl, HEADERS } = getUrlAndHeaders({
    url, apiKeyName: SERVICES_API_KEY.Neynar, serviceName: 'neynar', headers: {
      'x-api-key': apiKey,
      'x-neynar-experimental': 'false'
    }
  });

  const res = await fetch(finalUrl, {
    method: 'GET',
    headers: HEADERS,
  });
  const json = await res.json();
  const users = json.result ? json.result.users : []
  const user = users.find(user => user.username === username);
  return user && user.fid || null;
};
export default {
  fromUsernameToFid
}
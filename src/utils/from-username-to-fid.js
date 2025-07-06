import { getUrlAndHeaders } from './proxy-url-verify'

export const fromUsernameToFid = async (username, apiKey) => {
  if(!username) return null
  const url = `https://api.neynar.com/v2/farcaster/user/search/?q=${username}&limit=5`;
    const { URL: finalUrl, HEADERS } = getUrlAndHeaders({url: url.toString(), apiKeyName: SERVICE_API_KEY.Firefly, serviceName: 'firefly', headers});

  const res = await fetch(finalUrl, {
        method: 'GET',
        headers: HEADERS,
      });
  const json = await res.json();
  const users = json.result ? json.result.users : []
  const user = users.find(user => user.username === username);
  return user && user.fid || null;
};
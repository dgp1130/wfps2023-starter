import { exchangeOauthCodeForToken } from '$lib/server/github';

export interface Data {
	token: string;
}

export const load = async ({url}): Promise<Data> => {
  const token = await exchangeOauthCodeForToken(url.searchParams.get('code'));
  return {token};
};

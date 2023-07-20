import { exchangeOauthCodeForToken } from '$lib/server/github';
import { redirect } from '@sveltejs/kit';

export interface Data {
  token: string;
}

export const load = async ({url, cookies}): Promise<Data> => {
  const redirectUrl = cookies.get('redirectUrl')!;
  const token = await exchangeOauthCodeForToken(url.searchParams.get('code')!);
  cookies.set('token', token, {path: '/', httpOnly: false});
  cookies.delete('redirectUrl');
  throw redirect(307, redirectUrl);
};

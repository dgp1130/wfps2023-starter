import { getUsername } from '$lib/server/github';

import { env } from '$env/dynamic/private';
import type { Cookies } from '@sveltejs/kit';

export interface Data {
  user: string;
  clientId: string;
}

export const load = async ({cookies}) => {
  const token = (cookies as Cookies).get('token');
  let user = '';
  if (token) user = await getUsername(token);
  return {user, clientId: env.GITHUB_CLIENT_ID};
};

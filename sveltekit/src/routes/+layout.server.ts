import { getUsername } from '$lib/server/github';

import type { Cookies } from '@sveltejs/kit';

export interface Data {
	user: string;
}

export const load = async ({cookies}) => {
  const token = (cookies as Cookies).get('token');
  let user = '';
  if (token) user = await getUsername(token);
  return {user};
};

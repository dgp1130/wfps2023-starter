import { getUsername } from '$lib/server/github';

import type { PageServerLoad } from './$types';

export interface Data {
	user: string;
}

export const load: PageServerLoad<Data> = async ({cookies}) => {
  const token = cookies.get('token');
  let user = '';
  if (token) user = await getUsername(token);
  return {user};
};

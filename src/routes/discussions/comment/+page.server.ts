import { postComment } from '$lib/server/github';
import { redirect } from '@sveltejs/kit';

export interface Data {
  token: string;
}

export const load = async ({url, cookies}): Promise<Data> => {
  const token = cookies.get('token');
  console.log(`got token from cookie: ${token}`);
  const body = url.searchParams.get('body')!
  const discussionId = url.searchParams.get('discussionId')!
  const discussionNumber = url.searchParams.get('discussionNumber')!
  const replyTo = url.searchParams.get('replyTo')!
  await postComment(token, body, discussionId, replyTo);
  throw redirect(307, `/discussions/${discussionNumber}`);
};

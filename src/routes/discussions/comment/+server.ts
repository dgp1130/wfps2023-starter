import { postComment } from '$lib/server/github';
import type { RequestHandler } from './$types';

/** Posts a new comment to the discussion and returns it. */
export const POST = (async ({ url, cookies }) => {
  const token = cookies.get('token');
  console.log(`got token from cookie: ${token}`);
  if (!token) return new Response('No token', { status: 400 });

  const body = url.searchParams.get('body')!
  const discussionId = url.searchParams.get('discussionId')!
  const replyTo = url.searchParams.get('replyTo')!

  const comment = await postComment(token, body, discussionId, replyTo);
  const json = JSON.stringify(comment, null, 4);

  return new Response(json, {
    status: 200,
    headers: [
      [ 'Content-Type', 'application/json' ],
    ],
  });
}) satisfies RequestHandler;

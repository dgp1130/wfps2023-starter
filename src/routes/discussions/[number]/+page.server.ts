import { error } from '@sveltejs/kit';

import {
  type DiscussionComment,
  type DiscussionDetails,
  getDiscussionComments,
  getDiscussionDetails,
  PaginationDir
} from '$lib/server/github';

import type { PageServerLoad } from './$types';

export interface Data {
  discussion: DiscussionDetails;
  comments: DiscussionComment[];
  startCursor: string;
  hasPrevPage: boolean;
  endCursor: string;
  hasNextPage: boolean;
}

export const load: PageServerLoad<Data> = async ({ params, url }) => {
  const number = Number(params.number);
  if (isNaN(number)) {
    throw error(404, 'invalid discussion number');
  }

  const discussion = await getDiscussionDetails(number);

  const limit = Number(url.searchParams.get('limit')) || 2;
  const cursor = url.searchParams.get('cursor') ?? undefined;
  const dir = (url.searchParams.get('dir') ?? 'after') as PaginationDir;
  const comments = await getDiscussionComments(number, limit, cursor, dir);
  return { discussion, ...comments };
};

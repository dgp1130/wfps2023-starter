import { type Discussion, getDiscussionList, PaginationDir } from '../lib/server/github';

import type { PageServerLoad } from './$types';

export interface Data {
  discussions: Discussion[];
  startCursor: string;
  hasPrevPage: boolean;
  endCursor: string;
  hasNextPage: boolean;
}

/** Small page size because there aren't that many discussions. */
const pageSize = 2;

export const load: PageServerLoad<Data> = async ({ url }) => {
  const limit = Number(url.searchParams.get('limit') ?? pageSize.toString());
  const cursor = url.searchParams.get('cursor') ?? undefined;
  const dir = (url.searchParams.get('dir') ?? 'after') as PaginationDir;
  return await getDiscussionList(limit, cursor, dir);
};

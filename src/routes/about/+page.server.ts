import {
  type RepositoryInformation,
  getRepositoryInformation
} from '../../lib/server/github';

import type { PageServerLoad } from './$types';

export interface Data {
  info: RepositoryInformation;
  buildInfo: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const load: PageServerLoad<Data> = async ({params}) => {
  const info = await getRepositoryInformation();
  const now = new Date(Date.now());
  return {
    info,
    buildInfo: "The page is built at " + now,
  };
};

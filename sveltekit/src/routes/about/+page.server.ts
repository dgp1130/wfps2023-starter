import {
	type RepositoryInformation,
	getRepositoryInformation
} from '../../lib/server/github';

import type { PageServerLoad } from './$types';

export interface Data {
	info: RepositoryInformation;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const load: PageServerLoad<Data> = async ({params}) => {
	const info = await getRepositoryInformation();
	return { info };
};

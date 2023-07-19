import { env } from '$env/dynamic/private';
import { Octokit, App } from 'octokit';
import { createAppAuth } from '@octokit/auth-app';
import { marked } from 'marked';

import GITHUB_KEY from '../../../.env.private-key.pem?raw';
import type { REACTIONS } from '../reactions';

function requireEnv(key: string): string {
	const value = env[key];
	if (value == null) {
		throw new Error(`Missing ${key} env var. Did you create a .env file?`);
	}

	return value;
}

const GITHUB_APP_ID = requireEnv('GITHUB_APP_ID');
const GITHUB_CLIENT_ID = requireEnv('GITHUB_CLIENT_ID');
const GITHUB_CLIENT_SECRET = requireEnv('GITHUB_CLIENT_SECRET');
const GITHUB_INSTALLATION_ID = Number(requireEnv('GITHUB_INSTALLATION_ID'));
const GITHUB_REPO_NAME = requireEnv('GITHUB_REPO_NAME');
const GITHUB_REPO_OWNER = requireEnv('GITHUB_REPO_OWNER');

interface QueryVariables {
	[name: string]: unknown;
}

async function queryGraphQl(query: string, variables?: QueryVariables): Promise<unknown> {
	const app = new App({
		appId: GITHUB_APP_ID,
		privateKey: GITHUB_KEY,
		oauth: { clientId: GITHUB_CLIENT_ID, clientSecret: GITHUB_CLIENT_SECRET }
	});
	const octokit = await app.getInstallationOctokit(GITHUB_INSTALLATION_ID);

	return await octokit.graphql(
		query,
		Object.assign(
			{
				repoOwner: GITHUB_REPO_OWNER,
				repoName: GITHUB_REPO_NAME
			},
			variables
		)
	);
}

export interface Discussion {
	number: number;
	title: string;
	author: string;
	createdAt: string;
}

export interface ReactionGroup {
	content: (typeof REACTIONS)[number];
	totalCount: number;
}

export interface DiscussionDetails extends Discussion {
	reactionGroups: ReactionGroup[];
	bodyHTML: string;
}

export interface PaginatedDiscussions extends PaginationData {
	discussions: Discussion[];
}

export interface PaginationData {
	startCursor: string;
	hasPrevPage: boolean;
	endCursor: string;
	hasNextPage: boolean;
}

export enum PaginationDir {
	Before = 'before',
	After = 'after'
}

export async function getDiscussionList(
	limit: number,
	cursor: string | undefined,
	dir: PaginationDir
): Promise<PaginatedDiscussions> {
	const body = await queryGraphQl(
		`
			query discussionList($repoOwner: String!, $repoName: String!, $first: Int, $last: Int, $before: String, $after: String) {
				repository(owner: $repoOwner, name: $repoName) {
					discussions(first: $first, last: $last, before: $before, after: $after, orderBy: {field: CREATED_AT, direction: ASC}) {
						edges {
							node {
								number
								title
								author {
									login
								}
								createdAt
							}
						}
						pageInfo {
							startCursor
							hasPreviousPage
							endCursor
							hasNextPage
						}
					}
				}
			}
		`,
		dir === PaginationDir.Before ? { last: limit, before: cursor } : { first: limit, after: cursor }
	);

	const discussions = (body as any).repository.discussions.edges;
	const pageInfo = (body as any).repository.discussions.pageInfo;

	return {
		discussions: discussions.map((discussion: any) => ({
			number: discussion.node.number,
			title: discussion.node.title,
			author: discussion.node.author.login,
			createdAt: discussion.node.createdAt
		})),
		startCursor: pageInfo.startCursor,
		hasPrevPage: pageInfo.hasPreviousPage,
		endCursor: pageInfo.endCursor,
		hasNextPage: pageInfo.hasNextPage
	};
}

export async function getDiscussionDetails(number: number): Promise<DiscussionDetails> {
	const body = await queryGraphQl(
		`
    query discussionDetails($repoOwner: String!, $repoName: String!, $number: Int!) {
      repository(owner: $repoOwner, name: $repoName) {
        discussion(number: $number) {
          number
          title
          author {
            login
          }
          createdAt
          reactionGroups {
            content
            reactors {
              totalCount
            }
          }
          bodyHTML
        }
      }
		}
	`,
		{ number }
	);
	const discussion = (body as any).repository.discussion;
	return {
		number: discussion.number,
		title: discussion.title,
		author: discussion.author.login,
		createdAt: discussion.createdAt,
		reactionGroups: discussion.reactionGroups.map((group: any) => ({
			content: group.content,
			totalCount: group.reactors.totalCount
		})),
		bodyHTML: discussion.bodyHTML
	};
}

export interface DiscussionComment {
	author: string;
	createdAt: string;
	bodyHTML: string;
	replies: ReplyComment[];
}

export interface ReplyComment {
	author: string;
	createdAt: string;
	bodyHTML: string;
}

export interface PaginatedComments extends PaginationData {
	comments: DiscussionComment[];
}

export async function getDiscussionComments(
	number: number,
	limit: number,
	cursor: string | undefined,
	dir: PaginationDir
): Promise<PaginatedComments> {
	const body = await queryGraphQl(
		`
		query discussionComments($repoOwner: String!, $repoName: String!, $number: Int!, $first: Int, $last: Int, $before: String, $after: String) {
			repository(owner: $repoOwner, name: $repoName) {
				discussion(number: $number) {
					comments(first: $first, last: $last, before: $before, after: $after) {
						edges {
							node {
								author {
									login
								}
								createdAt
								bodyHTML
								replies(last: 100) {
									edges {
										node {
											author {
												login
											}
											createdAt
											bodyHTML
										}
									}
								}
							}
						}
						pageInfo {
							startCursor
							hasPreviousPage
							endCursor
							hasNextPage
						}
					}
				}
			}
		}
	`,
		{
			number,
			...(dir === PaginationDir.Before
				? { last: limit, before: cursor }
				: { first: limit, after: cursor })
		}
	);
	const {
		comments: { edges, pageInfo }
	} = (body as any).repository.discussion;

	return {
		comments: edges.map(({ node }: any) => ({
			author: node.author.login,
			createdAt: node.createdAt,
			bodyHTML: node.bodyHTML,
			replies: node.replies.edges.map(({ node }: any) => ({
				createdAt: node.createdAt,
				bodyHTML: node.bodyHTML,
				author: node.author.login
			}))
		})),
		startCursor: pageInfo.startCursor,
		endCursor: pageInfo.endCursor,
		hasPrevPage: pageInfo.hasPreviousPage,
		hasNextPage: pageInfo.hasNextPage
	};
}

export interface RepositoryInformation {
	repositoryDescription: string;
	readme: string;
}

export async function getRepositoryInformation(): Promise<RepositoryInformation> {
	const information = (await queryGraphQl(
		`
		query repoDetails($repoOwner: String!, $repoName: String!) {
			repository(owner:$repoOwner, name: $repoName) {
			  descriptionHTML
			  object(expression: "main:README.md") {
				... on Blob {
				  text
				}
			  }
			}
		  }
	`
	)) as any;

	return {
		repositoryDescription: information.repository.descriptionHTML,
		readme: marked(information.repository.object.text)
	};
}

export async function exchangeOauthCodeForToken(code: string): Promise<string> {
	const auth = createAppAuth({
		appId: GITHUB_APP_ID,
		privateKey: GITHUB_KEY,
		clientId: GITHUB_CLIENT_ID,
		clientSecret: GITHUB_CLIENT_SECRET
	});
	const userAuth = await auth({ type: 'oauth-user', code });
	return userAuth.token;
}

export async function getUsername(token: string): Promise<string> {
	const octokit = new Octokit({ auth: token });
	try {
		const {
			data: { login }
		} = await octokit.request('GET /user');
		return login;
	} catch (err: unknown) {
		return '';
	}
}

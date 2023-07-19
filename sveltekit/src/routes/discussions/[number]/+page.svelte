<script lang="ts">
	import { REACTION_EMOJI } from '../../../lib/reactions';
	import AddCommentForm from './AddCommentForm.svelte';
	import AddReaction from './AddReaction.svelte';
	import Replies from './Replies.svelte';

	export let data;

	$: ({ discussion, comments, startCursor,		endCursor,		hasPrevPage,		hasNextPage } = data);
	$: currentReactions = discussion.reactionGroups.filter((group) => group.totalCount > 0);
</script>

<svelte:head>
	<title>{discussion.title} - Discussions</title>
	<meta name="description" content="WFPS 2023 Discussions" />
</svelte:head>

<section>
	<h1>{discussion.title}</h1>
	<p>by {discussion.author} on {discussion.createdAt}</p>
	<div>{@html discussion.bodyHTML}</div>
	<div class="reactions">
		{#each currentReactions as group (group.content)}
			<button disabled>
				{REACTION_EMOJI[group.content]}
				{group.totalCount}
			</button>{' '}
		{/each}
		<AddReaction />
	</div>
	<div class="add-comment-form">
		<h2>Add your comment</h2>
		<AddCommentForm />
	</div>
	<div class="comments">
		<h2>Comments</h2>
		<ul>
			{#each comments as comment}
				<li>
					{comment.author}
					{comment.createdAt}
					{@html comment.bodyHTML}
					<Replies replies={comment.replies} />
				</li>
			{/each}
		</ul>
	</div>
	{#if hasPrevPage}
		<a href="/discussions/{discussion.number}?cursor={startCursor}&dir=before">Previous</a>
	{/if}
	{#if hasNextPage}
		<a href="/discussions/{discussion.number}?cursor={endCursor}&dir=after">Next</a>
	{/if}
</section>

<style>
</style>

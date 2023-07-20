<script lang="ts">
  import Paginator from '$lib/Paginator.svelte';
	import type { DiscussionComment } from '$lib/server/github';
  import AddCommentForm from './AddCommentForm.svelte';

  export let data;

  $: ({ discussion, comments } = data);

  function addComment(evt: CustomEvent<DiscussionComment>): void {
    const comment = evt.detail;
    comments = [ comment, ...comments ];
  }
</script>

<svelte:head>
  <title>{discussion.title} - Discussions</title>
  <meta name="description" content="WFPS 2023 Discussions" />
</svelte:head>

<section>
  <h1>{discussion.title}</h1>
  <p>by {discussion.author} on {discussion.createdAt}</p>
  <div>{@html discussion.bodyHTML}</div>
  <div class="add-comment-form">
    <h2>Add your comment</h2>
    <AddCommentForm
        discussionNumber={discussion.number}
        discussionId={discussion.id}
        on:comment={addComment} />
  </div>
  <div class="comments">
    <h2>Comments</h2>
    <ul>
      {#each comments as comment}
        <li>
          {comment.author}
          {comment.createdAt}
          {@html comment.bodyHTML}
        </li>
      {/each}
    </ul>
  </div>
  <Paginator {data} />
</section>

<style>
</style>

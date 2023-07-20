<script lang="ts">
	import type { DiscussionComment } from '$lib/server/github';
  import { createEventDispatcher } from 'svelte';

  export let discussionNumber: number;
  export let discussionId: string;
  export let replyTo: string | undefined = undefined;
  let text = '';

  const dispatch = createEventDispatcher();

  async function submit(evt: Event) {
    evt.preventDefault();
  
    const url = new URL(`/discussions/comment`, location.href);
    url.searchParams.set('body', text);
    url.searchParams.set('discussionId', discussionId);
    if (replyTo) url.searchParams.set('replyTo', replyTo);

    // Post the comment to the server.
    const res = await fetch(url, { method: 'POST' });
    if (!res.ok) {
      console.error('Failed to post comment. :(');
      console.error(await res.text());
      return;
    }

    // Emit the comment as an event.
    const comment = await res.json() as DiscussionComment;
    dispatch('comment', comment);
  }
</script>

<form on:submit={submit}>
  <input type="hidden" name="discussionNumber" value="{discussionNumber || ''}" />
  <input type="hidden" name="discussionId" value="{discussionId || ''}" />
  <input type="hidden" name="replyTo" value="{replyTo || ''}" />
  <textarea id="comment" name="body" bind:value={text} rows="4" cols="50" />
  <button class="submit-button" type="submit">Submit</button>
</form>

<style>
  .submit-button {
    display: block;
  }
</style>

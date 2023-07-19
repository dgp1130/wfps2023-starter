<script lang="ts">
	import type {  ReplyComment } from "$lib/server/github";

  export let replies: ReplyComment[];
</script>

<h3>Replies</h3>
{#if replies.length}
  <ul>
  {#each replies as reply}
    <li>
      {reply.author}
      {reply.createdAt}
      {@html reply.bodyHTML}
    </li>
  {/each}
  </ul>
{/if}
[TODO: Add reply button]

<style>
</style>

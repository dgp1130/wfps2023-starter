<script lang="ts">
	import type { PaginationData } from "./server/github";
  import { page } from '$app/stores';

  export let data: PaginationData;
</script>

{#if data.hasPrevPage}
  <a href="{$page.url.pathname}?cursor={data.startCursor}&dir=before">Previous</a>
{/if}
{#if data.hasNextPage}
  <a href="{$page.url.pathname}?cursor={data.endCursor}&dir=after">Next</a>
{/if}

<style>
</style>

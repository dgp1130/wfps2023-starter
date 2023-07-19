<script lang="ts">
	export let data;

	$: ({ info } = data);
</script>
	
<svelte:head>
	<title>About</title>
	<meta name="description" content="About this app" />
</svelte:head>

<div class="text-column">
	<h1>Repository Description</h1>

	<p> {info.repositoryDescription}</p>

	<h1>Repository Readme</h1>
	<p>{info.readme}</p>

</div>

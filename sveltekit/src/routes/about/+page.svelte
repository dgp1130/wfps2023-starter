<script lang="ts">
	export let data;

	$: ({ info, buildInfo } = data);
</script>
	
<svelte:head>
	<title>About</title>
	<meta name="description" content="About this app" />
</svelte:head>

<div class="text-column">
	<h1>Repository Description</h1>
	{@html info.repositoryDescription}

	<h1>Repository Readme</h1>
	{@html info.readme}

	<footer>{buildInfo}</footer>
</div>

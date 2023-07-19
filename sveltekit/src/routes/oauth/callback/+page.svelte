<script lang="ts">
  import { onMount } from 'svelte';
  export let data;

  $: ({ token } = data);      

  onMount(() => {
    document.cookie = `token=${token}; path=/`;
    window.location.replace(localStorage.getItem('redirectUrl') || '/');
  });
</script>

<svelte:head>
	<title>Redirecting</title>
</svelte:head>

<section>
	<h1>Redirecting</h1>
</section>

<style>
</style>

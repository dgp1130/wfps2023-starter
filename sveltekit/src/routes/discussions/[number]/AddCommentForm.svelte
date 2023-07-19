<script lang="ts">
    let text = "";

	function submit() {
        // TODO: submit to github.
		alert(text);
	}
</script>

<form on:submit|preventDefault={submit}>
	<textarea id="comment" name="comment" bind:value={text} rows="4" cols="50" />
	<button class="submit-button" type="submit">Submit</button>
</form>

<style>
    .submit-button {
        display: block;
    }
</style>

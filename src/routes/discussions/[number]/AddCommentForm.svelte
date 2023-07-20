<script lang="ts">
  export let discussionNumber: number;
  export let discussionId: string;
  export let replyTo: string;
  let text = '';

  function submit() {
    // TODO: submit to github.
    alert(text);
  }
</script>

<form action="/discussions/comment">
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

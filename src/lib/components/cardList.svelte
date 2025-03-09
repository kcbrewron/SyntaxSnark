<script>
    import { fade } from 'svelte/transition';

    import Card from "./card.svelte";

    let {comments} = $props();
</script>
<div transition:fade class="grid grid-cols-3 gap-4">
   {#each comments as comment }
    <Card comment={comment} />
   {/each}
</div>
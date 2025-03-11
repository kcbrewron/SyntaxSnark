<script>
    import { fade } from 'svelte/transition';

    import Card from "./card.svelte";

    let {comments} = $props();
</script>
<div class="md:w-7/8 sm:w-full">
    <div transition:fade class="xl:grid xl:grid-cols-3 xl:gap-4 sm:grid sm:grid-cols-1 sm:space-y-2">
    {#each comments as comment }
        <Card comment={comment} />
    {/each}
    </div>
</div>
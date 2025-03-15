<script>
    import { fade } from 'svelte/transition';

    import Card from "./card.svelte";

    let {comments} = $props();
</script>
<div class="w-3/4 sm:w-full">
    <div transition:fade class="xl:grid xl:grid-cols-4 xl:gap-4 sm:grid sm:grid-cols-1">
    {#each comments as comment }
        <Card class="pb-2" comment={comment} />
    {/each}
    </div>
</div>
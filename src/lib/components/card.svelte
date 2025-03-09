<script>
    import { Card } from "flowbite-svelte";
    import { ThumbsUpSolid } from "flowbite-svelte-icons";
    import { commentStore } from "$lib/stores/commentStore.js";

    let { comment } = $props();
    // Using reactivity to keep our local component in sync with the store
    $effect(() => {
        const storeData = $commentStore;
        if (!storeData.loading && !storeData.error && storeData.comments) {
            // Access the comments array inside the store data
            const currentComment = storeData.comments.find(
                (c) => c.id === comment.id,
            );
            if (currentComment) {
                comment = currentComment;
            }
        }
    });

    async function like(id) {
        try {
            await commentStore.incrementLike(id);
        } catch (error) {
            console.error("Failed to like comment:", error);
            // Optionally add user feedback for errors
        }
    }
</script>

<Card
    class="bg-gray-100  rounded-lg border-y-orange-500 border-y-4 border-x-transparent hover:drop-shadow-lg"
>
    <div class="space-y-4">
        <!-- prompt -->
        <div class="text-2xl text-blue-500">
            {comment.prompt}
        </div>
        <!-- sarcastic comment-->
        <div class="mx-auto">
            <p class="font-normal text-black-100">
                {comment.sarcaticComment}
            </p>
        </div>
        <!-- like -->
        <div class="text-md w-full space-x-8">
            {#if comment.likes === 1}
                <span class="inline-block align-middle">
                    {comment.likes} Like
                </span>
            {:else}
                <span class="inline-block align-middle">
                    {comment.likes} Likes
                </span>
            {/if}
            <span class="inline-block align-middle">
                <button
                    class="bg-orange-500 p-2 rounded-md hover:bg-orange-500 text-white"
                    onclick={() => like(comment.id)}
                >
                    <ThumbsUpSolid class="w-6 h-6" />
                </button>
            </span>
        </div>
    </div>
</Card>

<script>
    import { Card } from "flowbite-svelte";
    import { ThumbsUpSolid } from "flowbite-svelte-icons";
    import { sortedComments, commentStore } from '$lib/stores/commentStore';

    let { comment } = $props();
    let hasLiked = $state(false);

    // Using reactivity to keep our local component in sync with the store
    $effect(() => {
        const storeData = $sortedComments;
        if (!storeData.loading && !storeData.error && storeData.comments) {
            // Access the comments array inside the store data
            const currentComment = storeData.comments.find(
                (c) => c.id === comment.id,
            );
            if (currentComment) {
                comment = currentComment;
            }

            // Check if this comment has been liked by the user
            hasLiked = storeData.likedItems.includes(comment.id);
        }
    });

    async function like(id) {
        if (hasLiked) {
            // Don't allow multiple likes
            return;
        }

        try {
            const success = await sortedComments.incrementLike(id);
            if (success) {
                hasLiked = true;
            }
        } catch (error) {
            console.error("Failed to like comment:", error);
        }
    }
</script>

<Card
    class="bg-gray-100 sm:m-2 rounded-lg border-y-orange-500 border-y-4 border-x-transparent hover:drop-shadow-lg"
>
    <div class="space-y-4">
        <!-- prompt -->
        <div class="text-xl text-semibold text-blue-500">
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

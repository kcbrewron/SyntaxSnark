<script>
    import { Card } from "flowbite-svelte";
    import { ThumbsUpSolid } from "flowbite-svelte-icons";
    import { commentStore } from '$lib/stores/commentStore';

    let { comment } = $props();
    let hasLiked = $state(false);

    // Using reactivity to keep our local component in sync with the store
    $effect(() => {
        const storeData = $commentStore;
        if (!storeData.loading && !storeData.error) {
            // Find the current comment in the store
            const currentComment = storeData.comments.find(
                (c) => c.id === comment.id,
            );
            if (currentComment) {
                comment = currentComment;
            }

            // Check if this comment has been liked by the user
            hasLiked = commentStore.hasLiked(comment.id);
        }
    });

    async function like(id) {
        if (hasLiked) {
            // Don't allow multiple likes
            return;
        }

        try {
            const success = await commentStore.incrementLike(id);
            if (success) {
                hasLiked = true;
            }
        } catch (error) {
            console.error("Failed to like comment:", error);
        }
    }
</script>

<Card
    class="bg-gray-100 sm:m-2 rounded-lg border-y-orange-500 border-y-4 border-x-transparent hover:drop-shadow-lg flex flex-col h-full"
>
    <div class="flex flex-col h-full justify-between">
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
        </div>
        
        <!-- like - pinned to bottom -->
        <div class="flex justify-between items-center w-full mt-4">
            <div class="text-md">
                {#if comment.likes === 1}
                    <span>{comment.likes} Like</span>
                {:else}
                    <span>{comment.likes} Likes</span>
                {/if}
            </div>
            <button
                class="bg-orange-500 p-2 rounded-md hover:bg-orange-400 text-white disabled:bg-gray-300 disabled:cursor-not-allowed"
                onclick={() => like(comment.id)}
                disabled={hasLiked}
                title={hasLiked ? "You've already liked this comment" : "Like this comment"}
            >
                <ThumbsUpSolid class="w-6 h-6" />
            </button>
        </div>
    </div>
</Card>

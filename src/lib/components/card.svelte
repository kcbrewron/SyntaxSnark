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

    // Ensure comment has all required fields with fallbacks
    $effect(() => {
        if (comment) {
            // Ensure likes exists
            if (comment.likes === undefined) {
                comment = { ...comment, likes: 0 };
            }
            
            // Ensure categories exists
            if (!comment.categories) {
                comment = { ...comment, categories: [] };
            }
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
    class="bg-gray-100 rounded-lg border-y-orange-500 border-y-4 border-x-transparent hover:drop-shadow-lg flex flex-col h-full mb-4"
>
    <div class="flex flex-col h-full justify-between p-4">
        <div class="space-y-4">
            <!-- prompt -->
            <div class="text-xl text-semibold text-blue-500">
                {comment.prompt || "No prompt provided"}
            </div>
            <!-- sarcastic comment-->
            <div class="mx-auto">
                <p class="font-normal text-black-100">
                    {comment.sarcaticComment || comment.sarcasticComment || comment.comment || "No comment generated"}
                </p>
            </div>
            
            <!-- categories -->
            {#if comment.categories && comment.categories.length > 0}
                <div class="flex flex-wrap gap-1">
                    {#each comment.categories as category}
                        <span class="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full">
                            {category}
                        </span>
                    {/each}
                </div>
            {/if}
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

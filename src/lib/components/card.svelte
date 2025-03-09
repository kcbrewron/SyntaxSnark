<script>
    import { Card } from "flowbite-svelte";
    import { ThumbsUpSolid } from "flowbite-svelte-icons";
    import { commentStore } from '$lib/stores/commentStore.js';
    
    let { comment } = $props();
    // Using reactivity to keep our local component in sync with the store
    $effect(() => {
        const storeData = $commentStore;
        if (!storeData.loading && !storeData.error && storeData.comments) {
            // Access the comments array inside the store data
            const currentComment = storeData.comments.find(c => c.id === comment.id);
            if (currentComment) {
                comment = currentComment;
            }
        }
    });
    
    async function like(id) {
        try {
            await commentStore.incrementLike(id);
        } catch (error) {
            console.error('Failed to like comment:', error);
            // Optionally add user feedback for errors
        }
    }
</script>

<Card>
    <div class="bg-gray-100 p-4 space-y-4 rounded-lg border-orange-400">
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
        <div class="w-full">
            <div class="text-md">{comment.likes} Likes
            <button 
                class="bg-orange-400 p-2 rounded-md hover:bg-orange-500 text-white" 
                onclick={() => like(comment.id)}
            >
                <ThumbsUpSolid class="w-6 h-6 ms-2.5" />
            </button>
        </div>
        </div>
    </div>
</Card>
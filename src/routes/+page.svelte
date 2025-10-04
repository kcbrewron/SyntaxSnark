<!-- src/routes/index.svelte -->
<script>
    import { onMount } from "svelte";
    import CardList from "../lib/components/cardList.svelte";
    import { commentStore } from '$lib/stores/commentStore';

    let pageTitle = "SyntaxSnark - Sarcastic Code Comments";
    let prompt = $state("");
    let comments = $state([]);
    let isLoading = $state(true);
    let error = $state(null);


    // Subscribe to the store and keep our local state in sync
    $effect(() => {
        const storeData = $commentStore;
        comments = storeData.comments || [];
        isLoading = storeData.loading;
        error = storeData.error;
    });

    // Initialize the store when the component mounts
    onMount(async () => {
        await commentStore.initialize();
    });

    // Function to generate a new sarcastic comment
    async function generate() {
        console.log(`prompt entered by user: ${prompt}`);
        if (!prompt || prompt.trim() === "") {
            // Don't submit empty prompts
            return;
        }

        try {
            // Set loading state while generating
            isLoading = true;
            
            const response = await fetch("/api", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ prompt: prompt }),
            });

            if (!response.ok) {
                throw new Error("Failed to generate comment");
            }

            const data = await response.json();
            
            // Ensure we have a properly structured comment object
            const newComment = {
                id: data.id || `temp-${Date.now()}`,
                prompt: prompt, // Use the prompt we sent
                sarcaticComment: data.sarcaticComment || data.sarcasticComment || data.comment || data.text || '',
                categories: Array.isArray(data.categories) ? data.categories : [],
                likes: typeof data.likes === 'number' ? data.likes : 0
            };

            // Add the new comment to the store
            commentStore.addComment(newComment);

            // Clear the prompt input
            prompt = "";
            isLoading = false;
        } catch (err) {
            console.error("Error generating comment:", err);
            error = "Failed to generate comment. Please try again.";
            isLoading = false;
        }
    }

    // Handle Enter key press
    function handleKeydown(event) {
        if (event.key === 'Enter' && prompt.trim() !== "") {
            generate();
        }
    }
</script>

<svelte:head>
    <title>{pageTitle}</title>
    <meta
        name="description"
        content="Generate witty, sarcastic comments for your code"
    />
</svelte:head>

<div class="max-w-4xl mx-auto py-8">
    <div class="text-center mx-auto px-4 mb-6">
        <p
            class="text-xl text-light-text-secondary dark:text-dark-text-secondary w-full md:w-3/4 sm:w-full mx-auto"
        >
            Generate snarky comments to brighten your day
        </p>
    </div>
    <div class="max-w-4xl mx-auto py-4">
        <div class="text-center px-4 sm:mb-4 md:mb-6 space-y-4">
            <input
                bind:value={prompt}
                type="text"
                id="prompt"
                name="prompt"
                placeholder="What's challenging you today?"
                onkeydown={handleKeydown}
                class="w-full p-4 mx-auto border border-blue-800 drop-shadow:md focus:outline-blue-800 focus:drop-shadow-xl bg-gray-100 rounded-md"
            />
        </div>
    </div>

    {#if error}
        <div class="text-center mb-4 text-red-500">
            {error}
        </div>
    {/if}

    {#if isLoading}
        <div class="text-center py-8">
            <p>Loading snarky comments...</p>
        </div>
    {:else}
        <CardList {comments} />
    {/if}
</div>

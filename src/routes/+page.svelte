<!-- src/routes/index.svelte -->
<script>
    import { onMount } from "svelte";
    import CardList from "../lib/components/cardList.svelte";
    import { commentStore } from "$lib/stores/commentStore.js";

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
            const response = await fetch("/api", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                // Fix: Don't nest the prompt object unnecessarily
                body: JSON.stringify({ prompt: prompt }),
            });

            if (!response.ok) {
                throw new Error("Failed to generate comment");
            }

            const newComment = await response.json();

            // Add the new comment to the store
            commentStore.addComment(newComment);

            // Clear the prompt input
            prompt = "";
        } catch (err) {
            console.error("Error generating comment:", err);
            error = "Failed to generate comment. Please try again.";
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
    <div class="text-center mb-6">
        <p
            class="text-xl text-light-text-secondary dark:text-dark-text-secondary"
        >
            Generate snarky comments to brighten your day
        </p>
    </div>
    <div class="max-w-4xl mx-auto py-4">
        <div class="text-center mb-12">
            <input
                bind:value={prompt}
                type="text"
                id="prompt"
                name="prompt"
                placeholder="What's challenging you today?"
                class="w-1/2 mx-auto p-4 border border-blue-500 drop-shadow:md focus:outline-blue-500 focus:drop-shadow-xl bg-gray-100 rounded-md"
            />
            <button
                class="bg-blue-500 hover:bg-blue-400 px-4 py-2 drop-shadow:md hover:drop-shadow-xl rounded-md text-white"
                onclick={() => generate()}
                disabled={isLoading || !prompt}
            >
                {isLoading ? "Loading..." : "Submit"}
            </button>
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

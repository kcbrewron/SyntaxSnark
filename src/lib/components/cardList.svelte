<script>
    import { fade } from 'svelte/transition';
    import { onMount } from 'svelte';
    import Card from "./card.svelte";
    import CategoryFilter from "./categoryFilter.svelte";
    import { commentStore, categories as storeCategories } from '$lib/stores/commentStore';

    let {comments} = $props();
    let selectedCategory = $state("All");
    let filteredComments = $state([]);
    let allCategories = $state([]);
    let currentPage = $state(1);
    const itemsPerPage = 9;

    // Get categories from the store
    $effect(() => {
        allCategories = $storeCategories;
    });

    // Filter comments based on selected category
    $effect(() => {
        filteredComments = selectedCategory && selectedCategory !== "All"
            ? comments.filter(comment =>
                comment.categories &&
                Array.isArray(comment.categories) &&
                comment.categories.includes(selectedCategory))
            : comments;
        // Reset to page 1 when filter changes
        currentPage = 1;
    });

    // Calculate pagination
    $effect(() => {
        totalPages = Math.ceil(filteredComments.length / itemsPerPage);
    });

    let totalPages = $derived(Math.ceil(filteredComments.length / itemsPerPage));
    let paginatedComments = $derived(
        filteredComments.slice(
            (currentPage - 1) * itemsPerPage,
            currentPage * itemsPerPage
        )
    );

    function nextPage() {
        if (currentPage < totalPages) {
            currentPage++;
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    function prevPage() {
        if (currentPage > 1) {
            currentPage--;
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    // Listen for category change events
    onMount(() => {
        const handleCategoryChange = (event) => {
            selectedCategory = event.detail.category;
        };

        document.addEventListener('categoryChange', handleCategoryChange);

        return () => {
            document.removeEventListener('categoryChange', handleCategoryChange);
        };
    });
</script>

<div class="w-full mx-auto">
    <CategoryFilter
        categories={allCategories}
        selectedCategory={selectedCategory}
    />

    <!-- Pagination Controls - Top -->
    {#if totalPages > 1}
        <div class="flex justify-between items-center px-4 sm:px-6 mb-4">
            <button
                onclick={prevPage}
                disabled={currentPage === 1}
                class="px-4 py-2 bg-blue-800 text-white rounded-md hover:bg-blue-900 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
                ← Previous
            </button>
            <span class="text-gray-700">
                Page {currentPage} of {totalPages}
            </span>
            <button
                onclick={nextPage}
                disabled={currentPage === totalPages}
                class="px-4 py-2 bg-blue-800 text-white rounded-md hover:bg-blue-900 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
                Next →
            </button>
        </div>
    {/if}

    <div transition:fade class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4 sm:px-6">
    {#each paginatedComments as comment }
        <Card comment={comment} />
    {/each}
    </div>

    <!-- Pagination Controls - Bottom -->
    {#if totalPages > 1}
        <div class="flex justify-between items-center px-4 sm:px-6 mt-6">
            <button
                onclick={prevPage}
                disabled={currentPage === 1}
                class="px-4 py-2 bg-blue-800 text-white rounded-md hover:bg-blue-900 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
                ← Previous
            </button>
            <span class="text-gray-700">
                Page {currentPage} of {totalPages}
            </span>
            <button
                onclick={nextPage}
                disabled={currentPage === totalPages}
                class="px-4 py-2 bg-blue-800 text-white rounded-md hover:bg-blue-900 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
                Next →
            </button>
        </div>
    {/if}
</div>
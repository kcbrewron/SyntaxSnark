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
    });

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

<div class="w-3/4 sm:w-full">
    <CategoryFilter 
        categories={allCategories} 
        selectedCategory={selectedCategory}
    />
    
    <div transition:fade class="xl:grid xl:grid-cols-3 xl:gap-4 sm:grid sm:grid-cols-1 mt-4">
    {#each filteredComments as comment }
        <Card class="pb-2" comment={comment} />
    {/each}
    </div>
</div>
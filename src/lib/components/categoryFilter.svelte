<script>
    import { slide } from 'svelte/transition';
    
    let { categories = [], selectedCategory = "All" } = $props();
    let showFilters = $state(false);
    
    const dispatch = (category) => {
        const event = new CustomEvent('categoryChange', {
            detail: { category },
            bubbles: true
        });
        document.dispatchEvent(event);
    };

    function selectCategory(category) {
        dispatch(category);
    }

    function toggleFilters() {
        showFilters = !showFilters;
    }

    function clearFilter() {
        dispatch("All");
    }
</script>

<div class="category-filter mb-4 px-4 sm:px-6">
    <div class="flex justify-between items-center mb-2">
        <button 
            class="text-blue-500 hover:text-blue-700 font-medium"
            onclick={toggleFilters}
        >
            {showFilters ? 'Hide Filters' : 'Show Filters'}
        </button>
        
        {#if selectedCategory !== "All"}
            <button 
                class="text-red-500 hover:text-red-700 text-sm"
                onclick={clearFilter}
            >
                Clear Filter
            </button>
        {/if}
    </div>
    
    {#if showFilters}
        <div class="flex flex-wrap gap-2 justify-center" transition:slide={{ duration: 300 }}>
            {#each categories as category}
                <button 
                    class="px-3 py-1 rounded-full text-sm font-medium transition-colors
                           {selectedCategory === category 
                             ? 'bg-blue-500 text-white' 
                             : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}"
                    onclick={() => selectCategory(category)}
                >
                    {category}
                </button>
            {/each}
        </div>
    {/if}
</div>

<style>
    .category-filter {
        width: 100%;
    }
</style> 
<script>
    import { createEventDispatcher } from 'svelte';
    
    let { categories = [], selectedCategory = "All" } = $props();
    const dispatch = createEventDispatcher();

    function selectCategory(category) {
        dispatch('categoryChange', { category });
    }
</script>

<div class="category-filter mb-4">
    <div class="flex flex-wrap gap-2 justify-center">
        {#each categories as category}
            <button 
                class="px-3 py-1 rounded-full text-sm font-medium transition-colors
                       {selectedCategory === category 
                         ? 'bg-blue-500 text-white' 
                         : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}"
                on:click={() => selectCategory(category)}
            >
                {category}
            </button>
        {/each}
    </div>
</div>

<style>
    .category-filter {
        width: 100%;
    }
</style> 
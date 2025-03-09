<!-- src/routes/index.svelte -->
<script>
    let pageTitle = "SyntaxSnark - Sarcastic Code Comments";
    let prompt;
    const { results } = $props();
    function generate(){
        console.log(`This prompt => ${prompt}`);
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
    <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-blue-500 dark:text-white-400 mb-4">
            Syntax Snark
        </h1>
        <p
            class="text-xl text-light-text-secondary dark:text-dark-text-secondary"
        >
            Because your day deserves commentary with attitude.
        </p>
    </div>
    <div  class="max-w-4xl mx-auto py-4">
        <div class = "text-center mb-12">
            <input bind:value={prompt} type="text" id="prompt" name="prompt" 
            placeholder="What's challenging you today?"  
            class="w-1/2 mx-auto p-4 border border-blue-500 focus:outline-blue-500 bg-gray-100 rounded-md"/>  
            <button class="bg-blue-500 hover:bg-blue-400 px-4 py-2 rounded-md" onclick="{generate}">Submit</button>
        </div>
       
    </div>

</div>

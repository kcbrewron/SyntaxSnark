<script>
	let { children, class: className = "", ...restProps } = $props();
</script>

<nav class="bg-blue-800 border-gray-200 px-4 lg:px-6 py-2.5 {className}" {...restProps}>
	<div class="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
		{@render children()}
	</div>
</nav>
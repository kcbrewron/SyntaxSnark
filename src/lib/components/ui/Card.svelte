<script>
	let { children, class: className = "", ...restProps } = $props();
</script>

<div class="bg-white border border-gray-200 rounded-lg shadow-md {className}" {...restProps}>
	{@render children()}
</div>
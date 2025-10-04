<script>
	let { children, href = "/", class: className = "", ...restProps } = $props();
</script>

<a {href} class="flex items-center {className}" {...restProps}>
	{@render children()}
</a>
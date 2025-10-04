<script>
	let { children, href = "#", class: className = "", ...restProps } = $props();
</script>

<li>
	<a 
		{href} 
		class="block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-blue-700 lg:p-0 {className}" 
		{...restProps}
	>
		{@render children()}
	</a>
</li>
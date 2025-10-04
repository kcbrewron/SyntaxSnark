<script>
	let { children, class: className = "", ...restProps } = $props();
</script>

<div class="hidden justify-between items-center w-full lg:flex lg:w-auto lg:order-1 {className}" {...restProps}>
	<ul class="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0">
		{@render children()}
	</ul>
</div>
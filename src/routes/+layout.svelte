<script>
	let { children } = $props();
	import "../app.css";
	import Nav from "../lib/components/nav.svelte";
</script>
<Nav />
{@render children()}

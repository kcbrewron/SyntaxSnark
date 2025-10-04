<script>
    import { page } from '$app/stores';
    import Navbar from './ui/Navbar.svelte';
    import NavBrand from './ui/NavBrand.svelte';
    import NavLi from './ui/NavLi.svelte';
    import NavUl from './ui/NavUl.svelte';
    $: activeUrl = $page.url.pathname;
  </script>
  
  <Navbar class="w-full mx-auto md:px-20 sm:px-4 pt-4 !bg-blue-800 border-b-orange-500 border-b-4">
    {#snippet children()}
      <NavBrand href="/">
        {#snippet children()}
          <span class="self-center text-white whitespace-nowrap text-4xl drop-shadow-xl font-semibold">SyntaxSnark <br/>
            <span class="self-center text-orange-100 whitespace-nowrap text-lg">A daily dose of Snark</span>
          </span>
        {/snippet}
      </NavBrand>
      <NavUl class="w-full mx-auto">
        {#snippet children()}
          <NavLi class="text-xl text-orange-500" href="/">
            {#snippet children()}Home{/snippet}
          </NavLi>
          <NavLi class="text-xl text-orange-500" href="/dashboard">
            {#snippet children()}Dashboard{/snippet}
          </NavLi>
        {/snippet}
      </NavUl>
    {/snippet}
  </Navbar>
<script>
    import { page } from '$app/stores';
    import { Navbar, NavBrand, NavLi, NavUl } from 'flowbite-svelte';
    $: activeUrl = $page.url.pathname;
  </script>
  
  <Navbar class="w-full mx-auto px-20 pt-4 bg-blue-500 border-b-orange-500 border-b-4">
    <NavBrand href="/">
      <!-- <img src="/images/flowbite-svelte-icon-logo.svg" class="me-3 h-6 sm:h-9" alt="Flowbite Logo" /> -->
      <span class="self-center text-white whitespace-nowrap text-4xl drop-shadow-xl font-semibold">SyntaxSnark <br/>
        <span class="self-center text-orange-100 whitespace-nowrap text-lg">A daily dose of Snark</span>
    </span>
    </NavBrand>
    <NavUl class="w-full mx-auto">
      <NavLi class="text-xl text-orange-500" href="/">Home</NavLi>
      <NavLi class="text-xl text-orange-500" href="/dashboard">Dashboard</NavLi>
    </NavUl>
  </Navbar>
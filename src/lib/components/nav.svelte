<script>
    import { page } from '$app/stores';
    import { Navbar, NavBrand, NavLi, NavUl } from 'flowbite-svelte';
    $: activeUrl = $page.url.pathname;
  </script>
  
  <Navbar class="w-full mx-auto mx-20 pt-10">
    <NavBrand href="/">
      <!-- <img src="/images/flowbite-svelte-icon-logo.svg" class="me-3 h-6 sm:h-9" alt="Flowbite Logo" /> -->
      <span class="self-center text-blue-500 whitespace-nowrap text-4xl font-semibold">SyntaxSnark <br/>
        <span class="self-center text-blue-400 whitespace-nowrap text-lg">A daily dose of IT Snark</span>
    </span>
    </NavBrand>
    <NavUl>
      <NavLi href="/">Home</NavLi>
      <NavLi href="/dashboard">Dashboard</NavLi>
    </NavUl>
  </Navbar>
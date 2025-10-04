# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Development server**: `yarn dev` - Starts Vite development server
- **Build**: `yarn build` - Creates production build for Cloudflare Workers
- **Preview**: `yarn preview` - Builds and runs with Wrangler locally
- **Deploy**: `yarn deploy` - Builds and deploys to Cloudflare Workers
- **Lint**: `yarn lint` - Runs ESLint
- **Type check**: `yarn check` - Runs Svelte type checking
- **Tests**: `yarn test` - Runs Vitest unit tests
- **Test watch**: `yarn test:unit` - Runs tests in watch mode

## Architecture Overview

This is a SvelteKit application called "SyntaxSnark" that generates sarcastic code comments. It's deployed as a Cloudflare Worker and integrates with another Cloudflare Worker backend.

### Key Architectural Components

**Frontend Stack:**
- SvelteKit 2.x with Svelte 5 runes syntax (`$state`, `$effect`, `$props`)
- TailwindCSS 4.x for styling
- Custom UI components in `src/lib/components/ui/`
- Deployed as Cloudflare Worker using @sveltejs/adapter-cloudflare

**Backend Integration:**
- Cloudflare Worker service binding named `sarcasm` (points to `ai-sarcasm-generator` worker)
- API routes communicate with external worker at `ai-sarcasm-generator.ronnelson.workers.dev`

**Data Flow:**
1. User submits prompt via main page form
2. Frontend calls `/api` route with POST request
3. API route forwards request to bound Cloudflare Worker
4. Worker generates sarcastic comment using AI
5. Response flows back through API to frontend
6. Comment is added to local store and displayed

### State Management

**Comment Store** (`src/lib/stores/commentStore.js`):
- Centralized Svelte store for managing comments, categories, and likes
- Implements optimistic updates for like functionality
- Uses localStorage to track user's liked comments
- Auto-sorts comments by like count
- Handles API integration and error states

**Store Methods:**
- `initialize()` - Fetches initial data from API
- `addComment()` - Adds new comment and re-sorts
- `incrementLike()` - Optimistic like updates with API sync
- `filterByCategory()` - Category-based filtering

### Component Architecture

**Page Structure:**
- `src/routes/+page.svelte` - Main page with comment generation form
- `src/routes/+page.server.js` - Server-side data loading (currently mock data)
- `src/routes/dashboard/+page.svelte` - Dashboard view

**API Routes:**
- `src/routes/api/+server.js` - Main API endpoint (GET all comments, POST new comment)
- `src/routes/api/[id]/+server.js` - Individual comment operations (PATCH for likes)

**Components:**
- `CardList.svelte` - Displays grid of comment cards with category filtering
- `Card.svelte` - Individual comment card with like functionality
- `CategoryFilter.svelte` - Category selection interface
- `Nav.svelte` - Navigation component

**UI Components** (`src/lib/components/ui/`):
- `Card.svelte` - Reusable card wrapper with Svelte 5 snippet support
- `ThumbsUpIcon.svelte` - Custom thumbs up SVG icon component
- `Navbar.svelte`, `NavBrand.svelte`, `NavUl.svelte`, `NavLi.svelte` - Navigation components

### Security Implementation

**CSP Headers** (`src/hooks.server.js`):
- Generates unique nonce per request for CSP
- Strict Content Security Policy with nonce-based script/style loading
- Additional security headers (COEP, COOP, X-Frame-Options, etc.)
- Injects nonce into all script and style tags

### Configuration

**Cloudflare Integration:**
- `wrangler.jsonc` configures the app as `syntax_snark` Worker
- Service binding to `ai-sarcasm-generator` worker
- Uses Cloudflare Workers adapter for SvelteKit
- Built output path: `.svelte-kit/cloudflare/_worker.js`

**Build Configuration:**
- Vite with TailwindCSS plugin
- Package manager: Yarn 4.x
- ESLint for code quality
- Vitest for testing

### Data Models

**Comment Object:**
```javascript
{
  id: string,
  prompt: string,
  sarcaticComment: string, // Note: misspelled in codebase
  categories: string[],
  likes: number
}
```

### Development Notes

- Uses Svelte 5 runes syntax - avoid legacy reactive declarations
- Custom UI components use Svelte 5 snippets for children content
- TailwindCSS 4.x configuration uses simple `@import 'tailwindcss'` in app.css
- Comment store auto-initializes but can be manually initialized
- Like functionality includes duplicate prevention via localStorage
- Category filtering is client-side only
- All API calls go through SvelteKit API routes, not directly to worker
- Flowbite dependencies have been removed in favor of custom components
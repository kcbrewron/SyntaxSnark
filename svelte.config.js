import adapter from "@sveltejs/adapter-cloudflare";

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter({
			platformProxy: {
				configPath: 'wrangler.jsonc',
				environment: undefined,
				experimentalJsonConfig: true,
				persist: false
			}
		})
	}
};

export default config;
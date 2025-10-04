/** @type {import('./$types').PageServerLoad} */
export async function load({ fetch, platform }) {
	try {
		// Access Cloudflare binding from platform.env
		const { sarcasm } = platform.env;

		// Fetch comments from the Cloudflare Worker
		const result = await sarcasm.fetch(
			'https://ai-sarcasm-generator.ronnelson.workers.dev/api/sarcasm'
		);

		if (result.ok) {
			const data = await result.json();

			// Return the comments array
			return {
				comments: data.results || []
			};
		} else {
			console.error('Failed to fetch comments:', result.status);
			// Return empty array on error
			return {
				comments: []
			};
		}
	} catch (error) {
		console.error('Error loading comments:', error);
		// Return empty array on error
		return {
			comments: []
		};
	}
}
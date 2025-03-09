
/** @type {import('./$types').PageServerLoad} */
export async function load({ params, fetch, platform }) {

    /**
     * get existing records
     */
    const results = await platform.env.sarcasm.fetch("https://ai-sarcasm-generator.ronnelson.workers.dev/api/sarcasm");

	return {
		comments: results
	};
}
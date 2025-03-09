
/** @type {import('./$types').PageServerLoad} */
export async function load({ params, fetch, platform }) {

    /**
     * get existing records
     */
    //const results = await platform.env.sarcasm.fetch("https://ai-sarcasm-generator.ronnelson.workers.dev/api/sarcasm");

	return {
		comments: [
            {
              "id": "56bd6ead-9046-4f8f-a4a3-8b044f942535",
              "prompt": "Not another incident",
              "sarcaticComment": "\"Because I was just having a relaxing day of debugging and refactoring, not at all dreading the inevitable 3 a.m. page about a production issue caused by a 'change that seemed like a good idea at the time'.\"",
              "likes": 0,
              "categories": [
                "Technology",
                " Cybersecurity",
                " Breach"
              ]
            },
            {
              "id": "693464e3-96e2-471d-979f-094b8fef116b",
              "prompt": "Not another outage",
              "sarcaticComment": "\"The joys of working in IT: where 'planned maintenance' is just a euphemism for 'we have no idea what's going on and are hoping you'll be too busy playing Solitaire to notice'.\"",
              "likes": 1,
              "categories": [
                "Internet",
                " technology",
                " frustration"
              ]
            }
          ]
	};
}
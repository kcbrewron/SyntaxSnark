/**
 * Get comment
 */
// src/routes/api/comments/[id]/like/+server.js
export async function GET({ platform }) {
  try {
    // Access Cloudflare binding from platform.env
    const { sarcasm } = platform.env;

    //GET all comments from the database
    const result = await sarcasm.fetch(`https://ai-sarcasm-generator.ronnelson.workers.dev/api/sarcasm`);
    if (result.ok) {
      const comments = await result.json();

      return new Response(JSON.stringify(comments), {
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }else { 
      return new Response(JSON.stringify({}),{
        headers: { 'Content-Type': 'application/json'}
      })
    }

  } catch (error) {
    console.error('API Error:', error);
    return new Response(JSON.stringify({ error: 'Failed to update like count' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}
export async function POST({ request, platform }) {  // Fix: use request instead of prompt
  try {
    // Parse the JSON body from the request
    const data = await request.json();
    // Access Cloudflare binding from platform.env
    const { sarcasm } = platform.env;

    // Call the external API with the correct format
    const result = await sarcasm.fetch(
      `https://ai-sarcasm-generator.ronnelson.workers.dev/api/sarcasm/generate`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prompt: data.prompt })
      }
    );

    // Parse the JSON response from the external API
    const jsonResult = await result.json();
   
    return new Response(JSON.stringify(jsonResult), {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to generate sarcastic comment' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}
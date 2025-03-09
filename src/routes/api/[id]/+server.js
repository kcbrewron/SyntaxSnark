/**
 * Get comment
 */
// src/routes/api/comments/[id]/like/+server.js
export async function PATCH({ params, platform }) {
    const { id } = params;
    console.log(`API update likes for ${id}`)
    try {
      // Access Cloudflare binding from platform.env
      const { sarcasm } = platform.env;
      // This is an example - you'll need to adjust based on your actual DB structure
      const result = await sarcasm.fetch(`https://ai-sarcasm-generator.ronnelson.workers.dev/api/sarcasm/${id}`);
      console.log(`LIKE Response =>${JSON.stringify(result)}`)
      return new Response(JSON.stringify(result), {
        headers: {
          'Content-Type': 'application/json'
        }
      });
    } catch (error) {
      console.error('API error:', error);
      return new Response(JSON.stringify({ error: 'Failed to update like count' }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
  }
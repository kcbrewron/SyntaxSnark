/**
 * Get comment
 */
// src/routes/api/comments/[id]/like/+server.js
export async function PATCH({ params, platform }) {
    const { id } = params;
    
    try {
      // Access Cloudflare binding from platform.env
      const { sarcasm } = platform.env;
      
      // Update the comment in the database
      // This is an example - you'll need to adjust based on your actual DB structure
      const result = await sarcasm.fetch(`https://ai-sarcasm-generator.ronnelson.workers.dev/api/sarcasm/${id}`);
      
      return new Response(JSON.stringify(result), {
        headers: {
          'Content-Type': 'application/json'
        }
      });
    } catch (error) {
      console.error('Database error:', error);
      return new Response(JSON.stringify({ error: 'Failed to update like count' }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
  }
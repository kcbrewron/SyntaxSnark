/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
  // Generate a unique nonce for this request
  const nonce = generateNonce();
  
  // Add the nonce to the event.locals so it can be accessed in layouts/pages
  event.locals.cspNonce = nonce;
  
  // Set CSP nonce in response headers
  const response = await resolve(event, {
    transformPageChunk: ({ html }) => {
      // Add nonce to all script and style tags
      return html
        .replace(/<script\b/g, `<script nonce="${nonce}"`)
        .replace(/<style\b/g, `<style nonce="${nonce}"`);
    }
  });
  
  // Content Security Policy with nonce
  response.headers.set(
    'Content-Security-Policy',
    [
      // Default policies
      "default-src 'self'",
      // Scripts - allow from same origin and with specific nonce
      `script-src 'self' 'nonce-${nonce}' 'unsafe-inline'`, 
      // Styles - allow from same origin with nonce and unsafe-hashes for style attributes
      `style-src 'self' 'nonce-${nonce}' 'unsafe-inline' 'unsafe-hashes'`,
      // Images - allow from same origin and data URLs
      "img-src 'self' data:",
      // Fonts - allow from same origin
      "font-src 'self'",
      // Connect - only allow to same origin and cloudflare analytics
      "connect-src 'self' https://*.cloudflareinsights.com",
      // Media - only allow from same origin
      "media-src 'self'",
      // Object - disallow all object/embed/applet
      "object-src 'none'",
      // Frame - only allow from same origin
      "frame-src 'self'",
      // Worker - only allow from same origin
      "worker-src 'self' blob:",
      // Manifest - only allow from same origin
      "manifest-src 'self'",
      // Form actions - only allow to same origin
      "form-action 'self'",
      // Base URI - restrict to same origin
      "base-uri 'self'",
      // Block all mixed content
      "block-all-mixed-content",
      // Upgrade insecure requests
      "upgrade-insecure-requests"
    ].join('; ')
  );
  
  // Cross-Origin Opener Policy
  response.headers.set('Cross-Origin-Opener-Policy', 'same-origin');
  
  // Cross-Origin Embedder Policy - relaxed to allow analytics
  response.headers.set('Cross-Origin-Embedder-Policy', 'credentialless');
  
  // X-Content-Type-Options
  response.headers.set('X-Content-Type-Options', 'nosniff');
  
  // X-Frame-Options
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  
  // Referrer-Policy
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Permissions-Policy
  response.headers.set(
    'Permissions-Policy', 
    'camera=(), microphone=(), geolocation=(), interest-cohort=()'
  );
  
  return response;
}

/**
 * Generate a random nonce for CSP using Web Crypto API
 * @returns {string} A random base64 string
 */
function generateNonce() {
  // Use Web Crypto API which is available in Cloudflare Workers/Pages
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  
  // Convert to base64 and make URL safe
  return btoa(String.fromCharCode.apply(null, array))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
} 
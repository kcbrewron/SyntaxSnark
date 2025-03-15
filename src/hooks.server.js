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
      `script-src 'self' 'nonce-${nonce}'`, 
      // Styles - allow from same origin with nonce
      `style-src 'self' 'nonce-${nonce}'`,
      // Images - allow from same origin and data URLs
      "img-src 'self' data:",
      // Fonts - allow from same origin
      "font-src 'self'",
      // Connect - only allow to same origin
      "connect-src 'self'",
      // Media - only allow from same origin
      "media-src 'self'",
      // Object - disallow all object/embed/applet
      "object-src 'none'",
      // Frame - only allow from same origin
      "frame-src 'self'",
      // Worker - only allow from same origin
      "worker-src 'self'",
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
  
  // Cross-Origin Embedder Policy
  response.headers.set('Cross-Origin-Embedder-Policy', 'require-corp');
  
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
 * Generate a random nonce for CSP
 * @returns {string} A random base64 string
 */
function generateNonce() {
  // Import crypto in Node.js environment
  const crypto = require('crypto');
  
  // Generate a random 16-byte buffer
  const buffer = crypto.randomBytes(16);
  
  // Convert to base64 and make URL safe
  return buffer.toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
} 
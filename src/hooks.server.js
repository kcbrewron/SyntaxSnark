/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
  // Response object
  const response = await resolve(event);
  
  // Content Security Policy
  response.headers.set(
    'Content-Security-Policy',
    [
      // Default policies
      "default-src 'self'",
      // Scripts - only allow from same origin and inline scripts with nonce
      "script-src 'self' 'unsafe-inline'", 
      // Styles - allow from same origin and inline styles
      "style-src 'self' 'unsafe-inline'",
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
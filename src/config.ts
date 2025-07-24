// src/config.ts
// IMPORTANT: This file must be imported *after* ./env.js is loaded (see index.html)
type AppConfig = {
  API_URL: string;
}

/**
 * At runtime the server injects window.__APP_CONFIG__
 * (see entrypoint.sh below).  We cast to the shape we expect.
 */
export const CONFIG = (window as unknown as { __APP_CONFIG__: AppConfig }).__APP_CONFIG__; 
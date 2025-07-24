/// <reference types="vite/client" />

// Global type for runtime configuration
declare global {
  type Window = {
    __APP_CONFIG__: {
      API_URL: string;
    };
  } & globalThis.Window;
}

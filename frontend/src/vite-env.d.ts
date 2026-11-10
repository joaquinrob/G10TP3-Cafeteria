/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** URL de la API. Si no se define, se usa http://localhost:3000. */
  readonly VITE_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

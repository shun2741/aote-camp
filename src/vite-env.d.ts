/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SYNC_WRITE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

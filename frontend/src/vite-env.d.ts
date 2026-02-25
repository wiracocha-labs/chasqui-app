/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

interface ImportMetaEnv {
  readonly VITE_DEBUG?: string
  readonly VITE_NETWORK?: string
  readonly VITE_LOCALHOST_AUTH_CONTRACT?: string
  readonly VITE_LOCALHOST_EERC20_CONTRACT?: string
  readonly VITE_LOCALHOST_REGISTRAR_CONTRACT?: string
  readonly VITE_FUJI_AUTH_CONTRACT?: string
  readonly VITE_FUJI_EERC20_CONTRACT?: string
  readonly VITE_FUJI_REGISTRAR_CONTRACT?: string
  readonly VITE_AVALANCHE_AUTH_CONTRACT?: string
  readonly VITE_AVALANCHE_EERC20_CONTRACT?: string
  readonly VITE_AVALANCHE_REGISTRAR_CONTRACT?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module '*.webp';
declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.svg';
declare module '*.gif';

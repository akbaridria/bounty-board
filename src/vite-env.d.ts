/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_ENVIO_URL: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}

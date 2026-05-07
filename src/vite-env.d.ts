/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ARCGIS_API_KEY: string
  readonly VITE_ESRI_FEATURE_LAYER_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

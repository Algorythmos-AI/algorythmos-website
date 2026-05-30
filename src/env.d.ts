/// <reference types="astro/client" />

// Side-effect font import has no bundled types.
declare module '@fontsource-variable/inter';

interface ImportMetaEnv {
  readonly PUBLIC_GOOGLE_SITE_VERIFICATION?: string;
  readonly PUBLIC_BING_VERIFICATION?: string;
  readonly PUBLIC_YANDEX_VERIFICATION?: string;
  readonly PUBLIC_GOOGLE_CLIENT_ID?: string;
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// @ts-check
import { defineConfig } from 'astro/config';
import { loadEnv } from 'vite';

import tailwindcss from '@tailwindcss/vite';
import checkAssets from './integrations/check-assets.mjs';

// config runs before astro env is available, so read it via vite directly
const env = loadEnv(process.env.NODE_ENV ?? 'development', process.cwd(), '');
const SITE_URL = env.SITE_URL;
if (!SITE_URL) throw new Error('SITE_URL is required (see .env.example)');

// https://astro.build/config
export default defineConfig({
  site: SITE_URL,
  // few breakpoints keep the variant count low, since markdown images get candidates up to their intrinsic size
  image: {
    layout: 'constrained',
    responsiveStyles: true,
    breakpoints: [640, 1280, 1920]
  },
  integrations: [checkAssets()],
  vite: {
    plugins: [tailwindcss()]
  }
});

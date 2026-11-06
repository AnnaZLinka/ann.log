// @ts-check
import { defineConfig } from 'astro/config';
import { loadEnv } from 'vite';

import tailwindcss from '@tailwindcss/vite';

// config runs before astro env is available, so read it via vite directly
const { SITE_URL } = loadEnv(process.env.NODE_ENV ?? 'development', process.cwd(), '');
if (!SITE_URL) throw new Error('SITE_URL is required (see .env.example)');

// https://astro.build/config
export default defineConfig({
  site: SITE_URL,
  vite: {
    plugins: [tailwindcss()]
  }
});

import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import tailwindcss from '@tailwindcss/vite';

// Site is mostly static (fast, cheap to host). The only on-demand route is
// /api/contact, which is marked `prerender = false` and becomes a Vercel
// serverless function automatically thanks to the adapter below.
export default defineConfig({
  site: 'https://rameywelding.com',
  output: 'static',
  security: {
    checkOrigin: false,
  },
  adapter: vercel({
    webAnalytics: { enabled: true },
  }),
  vite: {
    plugins: [tailwindcss()],
  },
});

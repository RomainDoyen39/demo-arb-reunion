import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'http://localhost:4322',
  server: { port: 4322, host: true },
  devToolbar: { enabled: false },
  integrations: [tailwind({ applyBaseStyles: false })],
});

import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://jeeveshverma.github.io',
  base: '/al-hanaa-hotel',
  trailingSlash: 'always',
  build: { format: 'directory', assets: '_ah', inlineStylesheets: 'always' },
  compressHTML: true,
  devToolbar: { enabled: false },
  image: { responsiveStyles: false },
  prefetch: { prefetchAll: false, defaultStrategy: 'hover' },
});

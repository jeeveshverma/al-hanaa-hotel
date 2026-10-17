import type { APIRoute } from 'astro';
import { LANGS, PAGES, path } from '../i18n';
import { ROOMS, SITE } from '../data/site';

export const GET: APIRoute = () => {
  const abs = (p: string) => new URL(p, SITE.url + '/').href;
  const entries: string[] = [];
  const add = (page: (typeof PAGES)[number], sub?: string) => {
    const alts = LANGS.map((l) => `<xhtml:link rel="alternate" hreflang="${l.hreflang}" href="${abs(path(l.code, page, sub))}"/>`).join('');
    for (const l of LANGS) entries.push(`<url><loc>${abs(path(l.code, page, sub))}</loc>${alts}<xhtml:link rel="alternate" hreflang="x-default" href="${abs(path('en', page, sub))}"/></url>`);
  };
  for (const p of PAGES) add(p);
  for (const r of ROOMS) add('rooms', r.id);
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${entries.join('\n')}\n</urlset>\n`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};

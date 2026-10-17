import { SITE } from '../data/site';
import type { Lang } from '../i18n';

export interface LatLng { lat: number; lng: number }
const R = 6371; // km
const rad = (d: number) => (d * Math.PI) / 180;

/** Great-circle distance in km. */
export function distanceKm(a: LatLng, b: LatLng): number {
  const dLat = rad(b.lat - a.lat), dLng = rad(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

/** Initial compass bearing from a to b, degrees clockwise from north. */
export function bearingDeg(a: LatLng, b: LatLng): number {
  const y = Math.sin(rad(b.lng - a.lng)) * Math.cos(rad(b.lat));
  const x = Math.cos(rad(a.lat)) * Math.sin(rad(b.lat)) - Math.sin(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.cos(rad(b.lng - a.lng));
  return (Math.atan2(y, x) * 180 / Math.PI + 360) % 360;
}

export type Dir8 = 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w' | 'nw';
export const dir8 = (deg: number): Dir8 => (['n', 'ne', 'e', 'se', 's', 'sw', 'w', 'nw'] as Dir8[])[Math.round(deg / 45) % 8];

/** Travel estimate: on foot under 1.6 km (4.5 km/h), otherwise by car (35 km/h in town, 70 km/h beyond 10 km) plus a minute to park. */
export function minutes(km: number): { mode: 'foot' | 'car'; min: number } {
  if (km < 1.6) return { mode: 'foot', min: Math.max(2, Math.round((km / 4.5) * 60)) };
  const speed = km > 10 ? 70 : 35;
  return { mode: 'car', min: Math.max(3, Math.round((km / speed) * 60 + 1)) };
}

export const fromHotel = (p: LatLng) => {
  const km = distanceKm(SITE.geo, p);
  const deg = bearingDeg(SITE.geo, p);
  return { km, deg, dir: dir8(deg), ...minutes(km) };
};

export const fmtKm = (km: number, lang: Lang) => {
  const v = km < 10 ? km.toFixed(1) : String(Math.round(km));
  return lang === 'ar' ? v.replace(/\d/g, (d) => '٠١٢٣٤٥٦٧٨٩'[Number(d)]).replace('.', '٫') : v;
};

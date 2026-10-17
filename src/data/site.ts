/**
 * Every public fact about the hotel, in one place. Only what the hotel already publishes
 * (Google Maps listing, Instagram bio, the shop sign) goes here — no prices, counts or times.
 */
export const SITE = {
  url: 'https://jeeveshverma.github.io/al-hanaa-hotel',
  name: { en: 'Al Hanaa Hotel', ar: 'فندق الهناء' },
  shortName: { en: 'Al Hanaa', ar: 'الهناء' },
  city: { en: 'Salalah', ar: 'صلالة' },
  region: { en: 'Dhofar', ar: 'ظفار' },
  country: { en: 'Sultanate of Oman', ar: 'سلطنة عُمان' },
  street: { en: '23rd July Street', ar: 'شارع 23 يوليو' },
  postal: '211',
  /** Google Maps pin (place page URL). */
  geo: { lat: 17.018763, lng: 54.108972 },
  plusCode: '2495+GH Salalah',
  /** Google's listing by its CID (the hex id in the place URL, 0x48eefbd083c719e9, in decimal). */
  mapsUrl: 'https://maps.google.com/?cid=5255414688170580457',
  mapsSearchUrl: 'https://www.google.com/maps/search/?api=1&query=Al+Hana+hotel+Salalah',
  directionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=17.018763,54.108972',
  /** The booking number published in the Instagram bio ("To booking 00968 90967211"). */
  whatsapp: '96890967211',
  whatsappDisplay: '+968 9096 7211',
  /** The hotel phone on Google Maps. */
  phone: '+96896128833',
  phoneDisplay: '+968 9612 8833',
  instagram: { handle: 'alhana_sll', url: 'https://www.instagram.com/alhana_sll/', followers: '14.7k' },
  googleReviewsUrl: 'https://maps.google.com/?cid=5255414688170580457',
  /** Khareef (monsoon) season window used by the date-aware ribbon. Month is 1-based. */
  khareef: { start: { month: 6, day: 21 }, end: { month: 9, day: 21 } },
} as const;

export type RoomId = 'suite' | 'twin' | 'double' | 'family' | 'flat';

/** Room *styles* — what the photos show, not an inventory. Photo ids refer to src/data/photos.ts. */
export const ROOMS: { id: RoomId; photos: string[]; hero: string }[] = [
  { id: 'suite', hero: 'suite-bed-a', photos: ['suite-bed-a', 'suite-living-a', 'suite-sofa', 'suite-living-b', 'suite-bed-wide', 'bathroom-shower', 'bathroom-basin'] },
  { id: 'double', hero: 'double-velvet', photos: ['double-velvet', 'double-chairs', 'double-curtain', 'double-grey', 'lounge-armchairs', 'bathroom-shower'] },
  { id: 'twin', hero: 'twin-a', photos: ['twin-a', 'twin-a-wardrobe', 'twin-b', 'twin-b-mirror', 'bathroom-basin'] },
  { id: 'family', hero: 'family-room', photos: ['family-room', 'double-curtain', 'bathroom-shower'] },
  { id: 'flat', hero: 'flat-living', photos: ['flat-living', 'flat-bedroom', 'flat-tv', 'flat-bedroom-tall', 'bathroom-basin'] },
];

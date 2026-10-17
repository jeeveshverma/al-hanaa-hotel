import { SITE } from '../data/site';

/** WhatsApp deep link to the hotel's booking number with a pre-filled message. */
export const waUrl = (text: string) => `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(text)}`;

export const telUrl = SITE.phone.startsWith('tel:') ? SITE.phone : `tel:${SITE.phone}`;

/**
 * Five-star Google reviews of the hotel, quoted verbatim (trimmed with … where long), collected
 * 2026-10-17 from the listing sorted by highest rating. Arabic reviews carry their original text;
 * the English site shows Google's translation of those (marked `translated`). The overall score
 * and the review count are deliberately NOT stored or shown anywhere on the site.
 */
export interface Review { name: string; lang: 'en' | 'ar'; text: string; translated?: boolean; local?: boolean; when: { en: string; ar: string } }

export const REVIEWS: Review[] = [
  { name: 'Khanbaba', lang: 'en', local: true, when: { en: 'September 2026', ar: 'سبتمبر 2026' }, text: 'Oh lovely place on the road side and having good parking and such a cleanliness and beautiful rooms' },
  { name: 'Sagar', lang: 'en', when: { en: 'July 2026', ar: 'يوليو 2026' }, text: 'Its best option on affordable price and accessible to heart of salalah. Very friendly customer care… recommended to all type of tourist' },
  { name: 'New Phone', lang: 'en', local: true, when: { en: 'March 2026', ar: 'مارس 2026' }, text: 'Was there nearly 2 months at an affordable rate. Clean hotel, good wi-fi speed, nice staff.' },
  { name: 'Saqer', lang: 'ar', when: { en: 'August 2026', ar: 'أغسطس 2026' }, text: 'ممتاز وتعامل راقي وخدمات ممتازة وانصح به' },
  { name: 'Saqer', lang: 'en', translated: true, when: { en: 'August 2026', ar: 'أغسطس 2026' }, text: 'Excellent, professional service, and outstanding work. I highly recommend it.' },
  { name: 'Yakoob', lang: 'ar', local: true, when: { en: 'January 2026', ar: 'يناير 2026' }, text: 'زرت الفندق قبل ايام بصراحة غرف جمييلة ومريحة وخدمات جيدة جداً بالإضافة إلى تعامل الموظفين راقي جداً' },
  { name: 'Yakoob', lang: 'en', translated: true, local: true, when: { en: 'January 2026', ar: 'يناير 2026' }, text: 'Honestly, the rooms are beautiful and comfortable, the services are very good, and the staff are very professional.' },
  { name: 'بلعرب', lang: 'ar', local: true, when: { en: 'August 2026', ar: 'أغسطس 2026' }, text: 'ممتاز ونظيف وهادئ' },
  { name: 'دكتور مواهب', lang: 'ar', local: true, when: { en: '2025', ar: '2025' }, text: 'من الاجمل الفنادق بصلالة اسلوب راقى جدا فى التعامل غرف دائماً مرتبة وجاهزة' },
  { name: 'Dr. Mawahib', lang: 'en', translated: true, local: true, when: { en: '2025', ar: '2025' }, text: 'One of the most beautiful hotels in Salalah, with a very classy style and excellent service. The rooms are always tidy and ready.' },
  { name: 'Omar', lang: 'ar', when: { en: '2025', ar: '2025' }, text: 'تعامل جدا طيب ونظافه المكان ١٠٠/١٠٠' },
  { name: 'Ahmed', lang: 'ar', when: { en: '2025', ar: '2025' }, text: 'من احسن الفنادق وأحسن المعامله إلى فى الاستقبال مع الأستاذ نور' },
  { name: 'Muslim', lang: 'en', translated: true, when: { en: '2025', ar: '2025' }, text: 'A lovely experience, a clean place and a very quiet neighborhood.' },
  { name: 'Aurélie', lang: 'en', local: true, when: { en: '2018', ar: '2018' }, text: 'Very nice hotel, well located. Friendly receptionist.' },
];

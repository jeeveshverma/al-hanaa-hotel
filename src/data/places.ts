/**
 * Landmarks around the hotel. Coordinates were read from each place's Google Maps page on
 * 2026-10-17 (the pin in the place URL). Distance, bearing and travel minutes are computed at
 * build time in src/lib/geo.ts — nothing here is typed by hand.
 */
import type { LatLng } from '../lib/geo';

export type Art = 'frankincense' | 'beach' | 'mosque' | 'waterfall' | 'arch' | 'castle' | 'spring' | 'souq' | 'shrine' | 'ruins' | 'mall' | 'bus' | 'plane' | 'khareef';

export interface Place { id: string; name: { en: string; ar: string }; blurb: { en: string; ar: string }; art: Art; at: LatLng; kind: 'city' | 'far'; transport?: boolean }

export const PLACES: Place[] = [
  { id: 'bus', kind: 'city', transport: true, art: 'bus', at: { lat: 17.0193726, lng: 54.1012127 }, name: { en: 'Salalah bus station', ar: 'محطة حافلات صلالة' }, blurb: { en: 'Mwasalat coaches from Muscat and Dubai arrive here, a short walk along 23rd July Street.', ar: 'تصل هنا حافلات مواصلات من مسقط ودبي، على بعد مشية قصيرة في شارع 23 يوليو.' } },
  { id: 'airport', kind: 'city', transport: true, art: 'plane', at: { lat: 17.0471634, lng: 54.0880886 }, name: { en: 'Salalah International Airport', ar: 'مطار صلالة الدولي' }, blurb: { en: 'A ten-minute taxi ride north of the hotel.', ar: 'عشر دقائق بسيارة الأجرة شمال الفندق.' } },
  { id: 'souq', kind: 'city', art: 'souq', at: { lat: 17.0018449, lng: 54.1013451 }, name: { en: 'Al Husn Souq (Souq Al Hafa)', ar: 'سوق الحصن (سوق الحافة)' }, blurb: { en: 'Frankincense, bakhoor, Dhofari dresses and the old quarter by the sea.', ar: 'اللبان والبخور والثياب الظفارية والحي القديم على البحر.' } },
  { id: 'mosque', kind: 'city', art: 'mosque', at: { lat: 17.0170589, lng: 54.0937829 }, name: { en: 'Sultan Qaboos Mosque', ar: 'جامع السلطان قابوس' }, blurb: { en: 'The city\'s great mosque, a few minutes west along the main road.', ar: 'جامع المدينة الكبير، على بعد دقائق غرباً على الطريق الرئيسي.' } },
  { id: 'haffa', kind: 'city', art: 'beach', at: { lat: 17.0013489, lng: 54.1156006 }, name: { en: 'Al Haffa beach', ar: 'شاطئ الحافة' }, blurb: { en: 'The city beach and corniche: coconut stalls, palms, the evening walk.', ar: 'شاطئ المدينة والكورنيش: أكشاك جوز الهند والنخيل ونزهة المساء.' } },
  { id: 'baleed', kind: 'city', art: 'ruins', at: { lat: 17.0094009, lng: 54.1360877 }, name: { en: 'Al Baleed archaeological park', ar: 'منتزه البليد الأثري' }, blurb: { en: 'UNESCO-listed ruins of the medieval port and the Museum of the Frankincense Land.', ar: 'أطلال الميناء القديم المدرجة في اليونسكو ومتحف أرض اللبان.' } },
  { id: 'lulu', kind: 'city', art: 'mall', at: { lat: 17.0266297, lng: 54.1122748 }, name: { en: 'LuLu Hypermarket', ar: 'لولو هايبرماركت' }, blurb: { en: 'Groceries and everything else, just up the road.', ar: 'البقالة وكل ما تحتاجه، على بعد خطوات.' } },
  { id: 'gardens', kind: 'city', art: 'mall', at: { lat: 17.0245791, lng: 54.066391 }, name: { en: 'Salalah Gardens Mall', ar: 'صلالة جاردنز مول' }, blurb: { en: 'Cinema, cafés and shops on the west side of town.', ar: 'سينما ومقاهٍ ومحلات في غرب المدينة.' } },
  { id: 'darbat', kind: 'far', art: 'waterfall', at: { lat: 17.0842874, lng: 54.4393589 }, name: { en: 'Wadi Darbat', ar: 'وادي دربات' }, blurb: { en: 'Waterfalls, a lake and green hills in khareef; picnics the rest of the year.', ar: 'شلالات وبحيرة وجبال خضراء في الخريف؛ ونزهات بقية السنة.' } },
  { id: 'taqah', kind: 'far', art: 'castle', at: { lat: 17.0390098, lng: 54.3953225 }, name: { en: 'Taqah Castle', ar: 'قلعة طاقة' }, blurb: { en: 'A restored 19th-century fort in the fishing town east of Salalah.', ar: 'حصن من القرن التاسع عشر مرمم في بلدة الصيد شرق صلالة.' } },
  { id: 'razat', kind: 'far', art: 'spring', at: { lat: 17.1299371, lng: 54.238073 }, name: { en: 'Ayn Razat', ar: 'عين رزات' }, blurb: { en: 'A spring and gardens at the foot of the mountains, a favourite for families.', ar: 'عين وحدائق عند سفح الجبال، مفضلة للعائلات.' } },
  { id: 'mughsail', kind: 'far', art: 'arch', at: { lat: 16.8794401, lng: 53.7765841 }, name: { en: 'Mughsail beach', ar: 'شاطئ المغسيل' }, blurb: { en: 'Cliffs, blowholes and a long empty beach to the west.', ar: 'جروف ونوافير بحرية وشاطئ طويل خالٍ إلى الغرب.' } },
  { id: 'ayoub', kind: 'far', art: 'shrine', at: { lat: 17.1119757, lng: 53.9938344 }, name: { en: 'Tomb of Prophet Ayoub (Job)', ar: 'قبر النبي أيوب' }, blurb: { en: 'A shrine in the hills above the city, with a view over the plain.', ar: 'مقام في الجبال فوق المدينة، بإطلالة على السهل.' } },
];

/**
 * The photo catalogue: every master in src/assets/photos/, what it shows, which group it belongs
 * to and alt text in both languages. Placement on the site follows `group` and the room lists
 * in site.ts — nothing is placed by filename.
 */
export type Group = 'suite' | 'twin' | 'double' | 'family' | 'flat' | 'spaces' | 'bathroom' | 'outside';

export interface Photo { id: string; group: Group; alt: { en: string; ar: string }; caption?: { en: string; ar: string } }

export const PHOTOS: Photo[] = [
  { id: 'exterior-night', group: 'outside', alt: { en: 'Al Hanaa Hotel at night: the lit ALHANAA sign above the arched entrance on 23rd July Street', ar: 'فندق الهناء ليلاً: لوحة الهناء المضيئة فوق المدخل المقوّس في شارع 23 يوليو' }, caption: { en: 'The entrance on 23rd July Street, after dark', ar: 'المدخل في شارع 23 يوليو بعد الغروب' } },
  { id: 'corridor', group: 'spaces', alt: { en: 'Guest corridor with a marble floor, a light strip along the wall and a framed artwork', ar: 'ممر الغرف بأرضية رخامية وشريط ضوء على طول الجدار ولوحة مؤطرة' }, caption: { en: 'The guest corridor', ar: 'ممر الغرف' } },
  { id: 'corridor-wide', group: 'spaces', alt: { en: 'The guest corridor, looking along the marble floor', ar: 'ممر الغرف على امتداد الأرضية الرخامية' } },
  { id: 'stairwell', group: 'spaces', alt: { en: 'Stairwell with black pendant lamps and a cluster of gold discs on the wall', ar: 'الدرج مع مصابيح معلقة سوداء وعنقود من الأقراص الذهبية على الجدار' }, caption: { en: 'The stairwell', ar: 'الدرج' } },
  { id: 'lounge-armchairs', group: 'spaces', alt: { en: 'Two gold wooden-framed armchairs around a round table under warm light', ar: 'كرسيان ذهبيان بإطار خشبي حول طاولة دائرية تحت ضوء دافئ' }, caption: { en: 'A corner to sit', ar: 'ركن للجلوس' } },
  { id: 'suite-bed-a', group: 'suite', alt: { en: 'Suite bedroom: king bed with a folded towel swan, LED cove ceiling, door open to the sitting room', ar: 'غرفة نوم الجناح: سرير كبير وبجعة من المناشف، سقف بإضاءة مخفية، والباب مفتوح على غرفة الجلوس' }, caption: { en: 'The suite bedroom', ar: 'غرفة نوم الجناح' } },
  { id: 'suite-bed-wide', group: 'suite', alt: { en: 'Suite bedroom, wide view of the king bed and the rug', ar: 'غرفة نوم الجناح، منظر عريض للسرير الكبير والسجادة' } },
  { id: 'suite-living-a', group: 'suite', alt: { en: 'Suite sitting room: wall clock, wingback armchair, small table and a round rug on marble', ar: 'غرفة جلوس الجناح: ساعة حائط، كرسي بظهر مرتفع، طاولة صغيرة وسجادة دائرية على الرخام' }, caption: { en: 'The sitting room', ar: 'غرفة الجلوس' } },
  { id: 'suite-living-b', group: 'suite', alt: { en: 'Suite sitting room from the doorway', ar: 'غرفة جلوس الجناح من الباب' } },
  { id: 'suite-sofa', group: 'suite', alt: { en: 'Suite living area with a grey sofa and coffee table, bedroom through the door', ar: 'صالة الجناح مع كنبة رمادية وطاولة قهوة، وغرفة النوم خلف الباب' }, caption: { en: 'The sofa room', ar: 'غرفة الكنبة' } },
  { id: 'twin-a', group: 'twin', alt: { en: 'Twin room: two single beds with towels laid out, geometric rug, textured wallpaper', ar: 'غرفة بسريرين: سريران منفصلان مع المناشف، سجادة بنقش هندسي وورق جدران محبب' }, caption: { en: 'The twin room', ar: 'غرفة السريرين' } },
  { id: 'twin-a-wardrobe', group: 'twin', alt: { en: 'Twin room with the open wardrobe and the doorway', ar: 'غرفة السريرين مع الخزانة المفتوحة والباب' } },
  { id: 'twin-b', group: 'twin', alt: { en: 'Twin room with white walls, two beds, a desk with a kettle and tea tray', ar: 'غرفة بسريرين بجدران بيضاء ومكتب عليه غلاية وصينية شاي' }, caption: { en: 'The white twin room', ar: 'غرفة السريرين البيضاء' } },
  { id: 'twin-b-mirror', group: 'twin', alt: { en: 'Twin room with a round mirror on the wall', ar: 'غرفة السريرين مع مرآة دائرية على الجدار' } },
  { id: 'double-chairs', group: 'double', alt: { en: 'Double room: wide bed, two beige tub chairs and a small wooden table on a patterned rug', ar: 'غرفة مزدوجة: سرير عريض وكرسيان مريحان وطاولة خشبية صغيرة على سجادة منقوشة' }, caption: { en: 'The double room', ar: 'الغرفة المزدوجة' } },
  { id: 'double-velvet', group: 'double', alt: { en: 'Double bed with a ribbed velvet headboard, curtains to the floor and a round pouf', ar: 'سرير مزدوج بظهر مخملي مضلّع وستائر حتى الأرض ومقعد دائري' }, caption: { en: 'The velvet headboard', ar: 'الظهر المخملي' } },
  { id: 'double-grey', group: 'double', alt: { en: 'Double bed with a grey headboard and a gold runner, artwork on the wall', ar: 'سرير مزدوج بظهر رمادي وشريط ذهبي ولوحة على الجدار' } },
  { id: 'double-curtain', group: 'double', alt: { en: 'Double bed by the curtains with a cove-lit wall and a pouf', ar: 'سرير مزدوج عند الستائر مع جدار مضاء ومقعد صغير' } },
  { id: 'family-room', group: 'family', alt: { en: 'Large family room: bed set back, round pouf, small round table, doorway to a second space', ar: 'غرفة عائلية واسعة: سرير في العمق، مقعد دائري، طاولة صغيرة وباب إلى مساحة ثانية' }, caption: { en: 'The family room', ar: 'الغرفة العائلية' } },
  { id: 'flat-bedroom', group: 'flat', alt: { en: 'Flat bedroom with a wood-panelled wall and a blue patterned rug', ar: 'غرفة نوم الشقة بجدار خشبي وسجادة زرقاء منقوشة' }, caption: { en: 'The flat: bedroom', ar: 'الشقة: غرفة النوم' } },
  { id: 'flat-bedroom-tall', group: 'flat', alt: { en: 'Flat bedroom, portrait view', ar: 'غرفة نوم الشقة، لقطة طولية' } },
  { id: 'flat-living', group: 'flat', alt: { en: 'Flat living room: grey sofa, black coffee table, blue rug, curtains', ar: 'صالة الشقة: كنبة رمادية، طاولة قهوة سوداء، سجادة زرقاء وستائر' }, caption: { en: 'The flat: living room', ar: 'الشقة: الصالة' } },
  { id: 'flat-tv', group: 'flat', alt: { en: 'Flat living room with a television wall unit, the bed visible behind', ar: 'صالة الشقة مع وحدة تلفاز والسرير ظاهر في الخلف' } },
  { id: 'bathroom-shower', group: 'bathroom', alt: { en: 'Marble-clad shower with a rain head and hand shower, toilet beside', ar: 'دُش بجدران رخامية ورأس مطري ودُش يدوي، والمرحاض بجانبه' }, caption: { en: 'The marble shower', ar: 'الدُش الرخامي' } },
  { id: 'bathroom-basin', group: 'bathroom', alt: { en: 'Granite basin counter with a wooden tea tray, cups and kettle', ar: 'مغسلة من الغرانيت مع صينية شاي خشبية وأكواب وغلاية' }, caption: { en: 'The basin and the tea tray', ar: 'المغسلة وصينية الشاي' } },
];

export const photo = (id: string): Photo => {
  const p = PHOTOS.find((p) => p.id === id);
  if (!p) throw new Error(`Unknown photo id: ${id}`);
  return p;
};

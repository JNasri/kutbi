export type Language = 'ar' | 'en';

export const content = {
  ar: {
    brand: 'مجموعة الكتبي',
    brandEn: 'ALKUTBI GROUP',
    menu: 'القائمة', close: 'إغلاق', language: 'تغيير اللغة',
    nav: [
      { label: 'الرئيسية', href: '#home' },
      { label: 'من نحن', href: '#about' },
      { label: 'قطاعاتنا', href: '#sectors' },
      { label: 'رؤيتنا', href: '#vision' },
    ],
    hero: {
      eyebrow: 'قيمة راسخة • رؤية تتقدم',
      title: 'مجموعة الكتبي',
      subtitle: 'نصنع فرصًا تمتد آثارها، ونبني أعمالًا تواكب الغد بثقة.',
      primary: 'اكتشف المجموعة', secondary: 'تواصل معنا', scroll: 'مرّر للاستكشاف',
    },
    scenes: [
      { id: 'about', number: '01', kicker: 'من نحن', title: 'إرثٌ من الثقة.\nطموحٌ بلا حدود.', text: 'مجموعة أعمال تنطلق من قيم ثابتة، وتتحرك بعقلية استثمارية حديثة. نجمع الخبرة والمرونة لنصنع قيمة حقيقية تستمر عبر الأجيال.', accent: 'جذور راسخة', note: 'نستثمر بعقلية طويلة الأمد' },
      { id: 'sectors', number: '02', kicker: 'قطاعاتنا', title: 'منظومة أعمال\nتتحرك بتناغم.', text: 'نطوّر فرصًا في قطاعات متعددة، ونربط بينها بكفاءة تشغيلية ورؤية موحدة؛ من التطوير والاستثمار إلى الخدمات والعمليات.', accent: 'قطاعات مترابطة', note: 'خبرة تتكامل، وقيمة تتضاعف' },
      { id: 'vision', number: '03', kicker: 'رؤيتنا', title: 'شراكات اليوم.\nأثر الغد.', text: 'نؤمن بأن النمو الأقوى يبدأ من شراكة واضحة. نعمل مع شركائنا بمرونة ومسؤولية لنحوّل الإمكانات إلى إنجازات مستدامة.', accent: 'نمو مسؤول', note: 'نبني ما يبقى' },
    ],
    footer: { statement: 'نحوّل الفرص إلى قيمة طويلة الأمد.', explore: 'استكشف', contact: 'تواصل', email: 'info@alkutbigroup.com', location: 'المملكة العربية السعودية', rights: 'جميع الحقوق محفوظة.' },
  },
  en: {
    brand: 'Alkutbi Group',
    brandEn: 'ALKUTBI GROUP',
    menu: 'Menu', close: 'Close', language: 'Change language',
    nav: [
      { label: 'Home', href: '#home' },
      { label: 'About', href: '#about' },
      { label: 'Our sectors', href: '#sectors' },
      { label: 'Vision', href: '#vision' },
    ],
    hero: {
      eyebrow: 'Enduring value • Forward vision',
      title: 'Alkutbi Group',
      subtitle: 'Creating opportunities with lasting impact and building businesses ready for tomorrow.',
      primary: 'Discover the group', secondary: 'Contact us', scroll: 'Scroll to explore',
    },
    scenes: [
      { id: 'about', number: '01', kicker: 'Who we are', title: 'A legacy of trust.\nAmbition without limits.', text: 'A group of businesses grounded in enduring values and moved by a modern investment mindset. We unite experience and agility to create value that lasts for generations.', accent: 'Enduring roots', note: 'We invest with a long-term view' },
      { id: 'sectors', number: '02', kicker: 'Our sectors', title: 'One ecosystem.\nMoving in unison.', text: 'We develop opportunities across multiple sectors and connect them through operational excellence and a shared vision—from development and investment to services and operations.', accent: 'Connected sectors', note: 'Experience compounds value' },
      { id: 'vision', number: '03', kicker: 'Our vision', title: 'Today’s partnerships.\nTomorrow’s impact.', text: 'We believe the strongest growth begins with a clear partnership. We work with agility and responsibility to turn potential into sustainable achievement.', accent: 'Responsible growth', note: 'Building what endures' },
    ],
    footer: { statement: 'Turning opportunity into long-term value.', explore: 'Explore', contact: 'Contact', email: 'info@alkutbigroup.com', location: 'Kingdom of Saudi Arabia', rights: 'All rights reserved.' },
  },
} as const;

export type Language = 'ar' | 'en';

export const content = {
  ar: {
    brand: 'مجموعة الكتبي', brandEn: 'ALKUTBI GROUP', menu: 'القائمة', close: 'إغلاق', language: 'تغيير اللغة', portal: 'بوابة الموظفين',
    nav: [
      { label: 'الرئيسية', href: '#home' }, { label: 'خدماتنا', href: '#services' }, { label: 'النقل', href: '#transport' },
      { label: 'اكتشف السعودية', href: '#discover' }, { label: 'صمّم رحلتك', href: '#trip-planner' },
    ],
    hero: { eyebrow: 'ضيافة سعودية بمعايير استثنائية', title: 'مجموعة الكتبي', subtitle: 'رفيقك الموثوق لخدمات العمرة، النقل، الضيافة، واكتشاف أجمل وجهات المملكة.', primary: 'استكشف خدماتنا', secondary: 'صمّم رحلتك', scroll: 'مرّر للاستكشاف' },
    services: {
      kicker: 'كل ما تحتاجه في مكان واحد', title: 'خدماتنا', subtitle: 'نعتني بتفاصيل رحلتك من لحظة التخطيط وحتى العودة، بخبرة محلية وخدمة تليق بضيوف المملكة.',
      cards: [
        { icon: 'visa', title: 'تأشيرة العمرة', text: 'إصدار ومتابعة تأشيرة العمرة وإجراءاتها الرسمية.' },
        { icon: 'transport', title: 'النقل والمواصلات', text: 'تنقلات منظمة بين المطار والحرم والمواقع.' },
        { icon: 'tours', title: 'المزارات والتجارب', text: 'جولات في المواقع الدينية والتراثية والثقافية.' },
        { icon: 'hospitality', title: 'الضيافة والخدمات الاستثنائية', text: 'إقامة وخدمات استقبال بمستوى راقٍ.' },
      ],
    },
    transport: {
      kicker: 'أسطول يليق برحلتك', title: 'النقل', subtitle: 'من الفرد إلى المجموعة الكبيرة، نوفر مركبات حديثة وسائقين محترفين لرحلة مريحة وآمنة.',
      cards: [
        { title: 'حافلات سياحية كبيرة', text: 'سعة مثالية وراحة عالية للمجموعات الكبيرة.', meta: 'حتى 49 راكباً' },
        { title: 'Hyundai Staria', text: 'تصميم عصري مريح للعائلة والمجموعات الصغيرة.', meta: 'حتى 7 ركاب' },
        { title: 'سيارات VIP فاخرة', text: 'فخامة استثنائية وتنقل خاص بأعلى معايير الراحة.', meta: 'حتى 3 ركاب' },
        { title: 'Mercedes V-Class', text: 'مساحة رحبة وخصوصية عالية للعائلات والوفود.', meta: 'حتى 6 ركاب' },
      ],
    },
    discover: {
      kicker: 'اكتشف السعودية ومعرض الصور', title: 'اكتشف السعودية', subtitle: 'اختر نوع التجربة ودعنا نأخذك إلى وجهات المملكة الأكثر إلهاماً.',
      categories: [
        { id: 'religious', label: 'دينية', items: [{ name: 'المسجد الحرام', index: 0 }, { name: 'المسجد النبوي', index: 1 }, { name: 'جبل النور', index: 2 }] },
        { id: 'heritage', label: 'تراثية', items: [{ name: 'الحِجر في العلا', index: 3 }, { name: 'الدرعية التاريخية', index: 4 }, { name: 'جدة التاريخية', index: 5 }] },
        { id: 'tourism', label: 'سياحية', items: [{ name: 'حافة العالم', index: 6 }, { name: 'ساحل البحر الأحمر', index: 7 }, { name: 'مرتفعات أبها', index: 8 }] },
        { id: 'culture', label: 'ثقافية', items: [{ name: 'مركز إثراء', index: 9 }, { name: 'الأسواق الشعبية', index: 10 }, { name: 'المتحف الوطني', index: 11 }] },
      ], add: 'أضف إلى رحلتي', added: 'تمت الإضافة',
    },
    planner: {
      kicker: 'مصمم الرحلات', title: 'صمّم رحلتك', subtitle: 'خمس خطوات بسيطة تساعد فريقنا على فهم رحلتك وتجهيز العرض المناسب لك.',
      modePackages: 'اختر باقتك', modeCustom: 'صمّم رحلتك الخاصة',
      packagesTitle: 'باقات مصممة لكل أسلوب سفر', packagesSubtitle: 'اختر مستوى الخدمة المناسب، وسيتواصل معك فريقنا لتخصيص التفاصيل والسعر.',
      packages: [
        { id: 'economy', name: 'الاقتصادية', label: 'عملية ومريحة', description: 'الأساسيات التي تحتاجها لرحلة منظمة ومريحة بقيمة ذكية.', features: ['إقامة مختارة بعناية', 'تنقلات جماعية منظمة', 'دعم أساسي طوال الرحلة'], cta: 'اختر الاقتصادية' },
        { id: 'special', name: 'المميزة', label: 'الأكثر اختياراً', description: 'توازن مثالي بين الراحة والمرونة والتجارب المختارة.', features: ['إقامة من فئة راقية', 'تنقلات خاصة أو للمجموعات', 'مزارات وتجارب بإرشاد محلي'], cta: 'اختر المميزة', featured: true },
        { id: 'luxury', name: 'الفاخرة', label: 'تجربة استثنائية', description: 'خدمة راقية وخصوصية عالية في كل تفصيل من تفاصيل الرحلة.', features: ['إقامة خمس نجوم', 'مركبة فاخرة وسائق خاص', 'خدمة كونسيرج وأولوية متابعة'], cta: 'اختر الفاخرة' },
      ],
      packageNote: 'سيتم إرسال اختيارك إلى فريقنا لإعداد عرض مخصص حسب عدد المسافرين والتواريخ.',
      packageModal: {
        eyebrow: 'تفاصيل الباقة', included: 'تشمل الباقة', details: 'تفاصيل إضافية',
        formTitle: 'اطلب عرضاً مخصصاً', formDescription: 'شارك بيانات التواصل وسيتواصل معك فريقنا لتأكيد التفاصيل والسعر.',
        company: 'اسم الشركة', phone: 'رقم الهاتف', email: 'البريد الإلكتروني', notes: 'ملاحظات',
        notesPlaceholder: 'التواريخ المتوقعة، عدد المسافرين، أو أي طلبات خاصة…', send: 'إرسال الطلب', close: 'إغلاق تفاصيل الباقة',
        detailLabels: ['المدة المقترحة', 'مستوى الدعم', 'مرونة البرنامج'],
        detailValues: {
          economy: ['من 5 إلى 7 ليالٍ', 'دعم أساسي', 'برنامج محدد مسبقاً'],
          special: ['من 7 إلى 10 ليالٍ', 'منسق رحلة مخصص', 'برنامج مرن'],
          luxury: ['مدة مصممة حسب الطلب', 'خدمة كونسيرج على مدار الساعة', 'مرونة كاملة'],
        },
      },
      steps: [
        { number: '١', label: 'عدد الأفراد', field: 'people', type: 'number', placeholder: 'مثال: 4' },
        { number: '٢', label: 'أيام الإقامة', field: 'days', type: 'number', placeholder: 'مثال: 7' },
        { number: '٣', label: 'تصنيف الفندق', field: 'hotel', type: 'select', options: ['3 نجوم', '4 نجوم', '5 نجوم', 'شقق فندقية'] },
        { number: '٤', label: 'وسيلة النقل', field: 'vehicle', type: 'select', options: ['سيارة VIP', 'Mercedes V-Class', 'Hyundai Staria', 'حافلة سياحية'] },
        { number: '٥', label: 'مزارات إضافية', field: 'extras', type: 'text', placeholder: 'اكتب الوجهات التي تهمك' },
      ], submit: 'إرسال الطلب عبر واتساب', note: 'سيتم تجهيز ملخص رحلتك وإرساله إلى فريق خدمة العملاء.', ready: 'تم تجهيز طلبك. أضف رقم واتساب الأعمال لإتمام الإرسال.',
    },
    whatsapp: 'تواصل معنا عبر واتساب',
    footer: { statement: 'رحلتك إلى المملكة، نصنعها بعناية.', explore: 'استكشف', contact: 'تواصل', email: 'info@alkutbigroup.com', location: 'المملكة العربية السعودية', rights: 'جميع الحقوق محفوظة.' },
  },
  en: {
    brand: 'Alkutbi Group', brandEn: 'ALKUTBI GROUP', menu: 'Menu', close: 'Close', language: 'Change language', portal: 'Employee Portal',
    nav: [
      { label: 'Home', href: '#home' }, { label: 'Services', href: '#services' }, { label: 'Transport', href: '#transport' },
      { label: 'Discover Saudi', href: '#discover' }, { label: 'Plan your trip', href: '#trip-planner' },
    ],
    hero: { eyebrow: 'Saudi hospitality, exceptional standards', title: 'Alkutbi Group', subtitle: 'Your trusted companion for Umrah, transport, hospitality, and discovering Saudi Arabia.', primary: 'Explore our services', secondary: 'Plan your trip', scroll: 'Scroll to explore' },
    services: {
      kicker: 'Everything you need in one place', title: 'Our services', subtitle: 'We manage every detail from planning to return, combining local experience with exceptional service.',
      cards: [
        { icon: 'visa', title: 'Umrah visa', text: 'Issuing and following up Umrah visas and official procedures.' },
        { icon: 'transport', title: 'Transport', text: 'Organized transfers between airports, holy sites, and destinations.' },
        { icon: 'tours', title: 'Tours and experiences', text: 'Guided religious, heritage, and cultural experiences.' },
        { icon: 'hospitality', title: 'Exceptional hospitality', text: 'Premium accommodation and distinguished guest services.' },
      ],
    },
    transport: {
      kicker: 'A fleet for every journey', title: 'Transport', subtitle: 'From individuals to large groups, our modern fleet and professional drivers keep every journey comfortable and safe.',
      cards: [
        { title: 'Large tour coaches', text: 'Ideal capacity and comfort for large travel groups.', meta: 'Up to 49 guests' },
        { title: 'Hyundai Staria', text: 'Modern comfort for families and small groups.', meta: 'Up to 7 guests' },
        { title: 'Luxury VIP sedan', text: 'Private travel with exceptional comfort and refinement.', meta: 'Up to 3 guests' },
        { title: 'Mercedes V-Class', text: 'Generous space and privacy for families and delegations.', meta: 'Up to 6 guests' },
      ],
    },
    discover: {
      kicker: 'Explore Saudi and its visual stories', title: 'Discover Saudi', subtitle: 'Choose an experience and explore some of the Kingdom’s most inspiring destinations.',
      categories: [
        { id: 'religious', label: 'Religious', items: [{ name: 'The Grand Mosque', index: 0 }, { name: 'The Prophet’s Mosque', index: 1 }, { name: 'Jabal al-Noor', index: 2 }] },
        { id: 'heritage', label: 'Heritage', items: [{ name: 'Hegra, AlUla', index: 3 }, { name: 'Historic Diriyah', index: 4 }, { name: 'Historic Jeddah', index: 5 }] },
        { id: 'tourism', label: 'Tourism', items: [{ name: 'Edge of the World', index: 6 }, { name: 'The Red Sea coast', index: 7 }, { name: 'Abha highlands', index: 8 }] },
        { id: 'culture', label: 'Culture', items: [{ name: 'Ithra', index: 9 }, { name: 'Traditional souqs', index: 10 }, { name: 'National Museum', index: 11 }] },
      ], add: 'Add to my trip', added: 'Added',
    },
    planner: {
      kicker: 'Trip designer', title: 'Make your trip', subtitle: 'Five simple steps help our team understand your journey and prepare the right proposal.',
      modePackages: 'Choose your package', modeCustom: 'Custom design your trip',
      packagesTitle: 'A package for every way of travelling', packagesSubtitle: 'Choose your preferred service level and our team will tailor the details and quotation.',
      packages: [
        { id: 'economy', name: 'Economy', label: 'Smart essentials', description: 'Everything needed for a comfortable, well-organized journey at thoughtful value.', features: ['Carefully selected accommodation', 'Organized shared transport', 'Essential trip support'], cta: 'Choose Economy' },
        { id: 'special', name: 'Special', label: 'Most popular', description: 'A balanced combination of comfort, flexibility, and curated experiences.', features: ['Premium accommodation', 'Private or group transport', 'Locally guided visits'], cta: 'Choose Special', featured: true },
        { id: 'luxury', name: 'Luxurious', label: 'Signature experience', description: 'Exceptional service and elevated privacy throughout every part of the journey.', features: ['Five-star accommodation', 'Luxury vehicle and private driver', 'Concierge and priority support'], cta: 'Choose Luxurious' },
      ],
      packageNote: 'Your selection will be sent to our team for a quotation based on travel dates and group size.',
      packageModal: {
        eyebrow: 'Package details', included: 'What is included', details: 'Additional details',
        formTitle: 'Request a tailored quotation', formDescription: 'Share your contact details and our team will confirm availability, details, and pricing.',
        company: 'Company name', phone: 'Phone number', email: 'Email address', notes: 'Notes',
        notesPlaceholder: 'Expected dates, number of travellers, or any special requests…', send: 'Send inquiry', close: 'Close package details',
        detailLabels: ['Suggested duration', 'Support level', 'Itinerary flexibility'],
        detailValues: {
          economy: ['5–7 nights', 'Essential support', 'Pre-arranged itinerary'],
          special: ['7–10 nights', 'Dedicated trip coordinator', 'Flexible itinerary'],
          luxury: ['Tailored duration', '24/7 concierge service', 'Fully flexible'],
        },
      },
      steps: [
        { number: '1', label: 'Number of guests', field: 'people', type: 'number', placeholder: 'Example: 4' },
        { number: '2', label: 'Length of stay', field: 'days', type: 'number', placeholder: 'Example: 7' },
        { number: '3', label: 'Hotel category', field: 'hotel', type: 'select', options: ['3 stars', '4 stars', '5 stars', 'Hotel apartment'] },
        { number: '4', label: 'Transport', field: 'vehicle', type: 'select', options: ['VIP sedan', 'Mercedes V-Class', 'Hyundai Staria', 'Tour coach'] },
        { number: '5', label: 'Extra destinations', field: 'extras', type: 'text', placeholder: 'Tell us what interests you' },
      ], submit: 'Send request on WhatsApp', note: 'Your trip summary will be prepared and sent to our customer care team.', ready: 'Your request is ready. Add the business WhatsApp number to enable direct sending.',
    },
    whatsapp: 'Chat with us on WhatsApp',
    footer: { statement: 'Your journey to Saudi, designed with care.', explore: 'Explore', contact: 'Contact', email: 'info@alkutbigroup.com', location: 'Kingdom of Saudi Arabia', rights: 'All rights reserved.' },
  },
} as const;

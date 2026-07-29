export type Language = "ar" | "en";

export const content = {
  ar: {
    brand: "مجموعة الكتبي",
    brandEn: "ALKUTBI GROUP",
    menu: "القائمة",
    close: "إغلاق",
    language: "تغيير اللغة",
    portal: "بوابة الموظفين",
    nav: [
      { label: "الرئيسية", href: "#home" },
      { label: "خدماتنا", href: "#services" },
      { label: "تأشيرة العمرة", href: "#umrah-visa" },
      { label: "الباقات", href: "#trip-planner" },
      { label: "أسطولنا", href: "#transport" },
      { label: "العروض", href: "#offers" },
      { label: "اكتشف السعودية", href: "#discover" },
      { label: "آراء ضيوفنا", href: "#contact" },
    ],
    hero: {
      eyebrow: "رحلة روحانية وثقافية متكاملة",
      title: "مجموعة الكتبي",
      subtitle:
        "مع مجموعة الكتبي، كل تفصيلة في رحلتك بأيدٍ أمينة — من التأشيرة حتى العودة.",
      primary: "استكشف الباقات",
      secondary: "اصنع رحلتك بنفسك",
      scroll: "مرّر للاستكشاف",
    },
    services: {
      kicker: "02 — منظومة الخدمات",
      title: "كل ما تحتاجه في رحلتك، تحت سقف واحد",
      subtitle: "",
      cards: [
        {
          icon: "visa",
          title: "تأشيرة العمرة",
          text: "نتولى إصدار تأشيرتك ومتابعة إجراءاتها الرسمية بسهولة وسرعة.",
        },
        {
          icon: "transport",
          title: "النقل والمواصلات",
          text: "تنقلات منظّمة بين المطار والحرم والمزارات — في موعدك دائماً.",
        },
        {
          icon: "tours",
          title: "المزارات والتجارب",
          text: "جولات غنية في أبرز المواقع الدينية والتراثية والثقافية في المملكة.",
        },
        {
          icon: "hospitality",
          title: "الضيافة والخدمات الاستثنائية",
          text: "إقامة راقية واستقبال يليق بضيوف الرحمن.",
        },
      ],
    },
    visa: {
      kicker: "03 — طلب تأشيرة العمرة",
      title: "تأشيرة العمرة — بثلاث خطوات فقط",
      subtitle:
        "لا تعقيدات، لا انتظار طويل. أرسل طلبك عبر المنصة وسنتولى الباقي فوراً.",
      steps: [
        {
          title: "تعبئة نموذج الطلب",
          text: "أدخل تفاصيل رحلتك: رقم طلب نسك، تواريخ الوصول والمغادرة، عدد المعتمرين، الفندق، النقل، والمسار.",
        },
        {
          title: "إجراءات تلقائية فورية",
          text: "ستصلك رسالة واتساب فورية تؤكد استلام طلبك، ويُحفظ طلبك مباشرةً في قاعدة بياناتنا.",
        },
        {
          title: "نُكمل نيابةً عنك",
          text: "نتحقق من الطلب عبر منصة نسك، ونُصدر التأشيرة، ونُرسلها إليك بكل يسر.",
        },
      ],
    },
    transport: {
      kicker: "07 — أسطول النقل",
      title: "أسطولنا — راحتك في كل تنقل",
      subtitle: "مركبات حديثة ومجهّزة لتنقلاتك بين المطار والحرم والمزارات.",
      cards: [
        {
          title: "Mercedes S-Class · Lexus ES",
          text: "للأفراد والمجموعات الصغيرة — سعة حتى 3 ركاب، راحة وأناقة في آنٍ واحد.",
          meta: "حتى 3 ركاب",
        },
        {
          title: "سيارات VIP الفاخرة · GMC يوكن",
          text: "لمن يستحق الفخامة — سعة حتى 7 ركاب، بأعلى مستويات الخصوصية.",
          meta: "حتى 7 ركاب",
        },
        {
          title: "Hyundai Staria",
          text: "تصميم عصري ومساحة واسعة — سعة حتى 10 ركاب، مثالية للمجموعات المتوسطة.",
          meta: "حتى 10 ركاب",
        },
        {
          title: "الحافلات السياحية الكبيرة",
          text: "للمجموعات الكبيرة — سعة تصل إلى 49 راكباً بكل الأريحية.",
          meta: "حتى 49 راكباً",
        },
      ],
    },
    offers: {
      kicker: "08 — العروض الموسمية",
      title: "عروض لا تفوّتها",
      subtitle: "باقات مميزة في أبرز المواسم — احجز قبل انتهاء العرض.",
      offers: [
        {
          title: "باقات رمضان",
          text: "عِش تجربة العمرة في أقدس الأوقات. برامج مخصصة لشهر رمضان المبارك بمزايا استثنائية.",
        },
        {
          title: "عروض ديسمبر",
          text: "اختم عامك برحلة عمرة لا تُنسى. باقات موسم نهاية العام بأسعار مميزة.",
        },
        {
          title: "اليوم الوطني",
          text: "عروض خاصة بمناسبة اليوم الوطني.",
        },
      ],
    },
    discover: {
      kicker: "09 — اكتشف السعودية",
      title: "اكتشف السعودية",
      subtitle: "ما وراء الحرمين — أرض تحمل تاريخاً وحضارةً لا تُضاهى.",
      categories: [
        {
          id: "religious",
          label: "دينية",
          description: "تجوّل في أقدس البقاع وأكثرها أثراً في تاريخ الإسلام.",
          items: [
            { name: "المسجد الحرام", index: 0 },
            { name: "المسجد النبوي", index: 1 },
            { name: "جبل النور", index: 2 },
          ],
        },
        {
          id: "heritage",
          label: "تراثية",
          description:
            "استكشف مواقع عريقة نُقشت عليها حضارات عمرها آلاف السنين.",
          items: [
            { name: "الحِجر في العلا", index: 3 },
            { name: "الدرعية التاريخية", index: 4 },
            { name: "جدة التاريخية", index: 5 },
          ],
        },
        {
          id: "tourism",
          label: "سياحية",
          description: "اكتشف جمال المملكة من صحرائها إلى ساحلها.",
          items: [
            { name: "حافة العالم", index: 6 },
            { name: "ساحل البحر الأحمر", index: 7 },
            { name: "مرتفعات أبها", index: 8 },
          ],
        },
        {
          id: "culture",
          label: "ثقافية",
          description:
            "تعرّف على الهوية السعودية الأصيلة بأبعادها الفنية والإنسانية.",
          items: [
            { name: "مركز إثراء", index: 9 },
            { name: "الأسواق الشعبية", index: 10 },
            { name: "المتحف الوطني", index: 11 },
          ],
        },
      ],
      add: "أضف إلى رحلتي",
      added: "تمت الإضافة",
    },
    planner: {
      kicker: "06 — مصمّم الرحلات",
      title: "اصنع رحلتك بنفسك",
      subtitle: "رحلة عمرة على مقاسك — أنت تختار، ونحن ننفّذ.",
      packagesKicker: "04 — الباقات المخصّصة",
      modePackages: "اختر الباقة",
      modeCustom: "اصنع رحلتك بنفسك",
      packagesTitle: "اختر الباقة التي تناسبك",
      packagesSubtitle: "",
      packages: [
        {
          id: "economy",
          name: "الاقتصادية",
          label: "رحلة منظّمة",
          description:
            "رحلة عمرة منظّمة بكل الأساسيات التي تضمن لك راحة الأداء وطمأنينة البال.",
          features: [
            "رحلة عمرة منظّمة",
            "كل الأساسيات",
            "راحة الأداء وطمأنينة البال",
          ],
          cta: "اختر الاقتصادية",
        },
        {
          id: "special",
          name: "المميّزة",
          label: "الأكثر اختياراً",
          description:
            "مستوى أرقى من السكن والخدمات، لتجربة أكثر خصوصية وراحة.",
          features: [
            "مستوى أرقى من السكن",
            "خدمات أكثر تميزاً",
            "خصوصية وراحة أكبر",
          ],
          cta: "اختر المميزة",
          featured: true,
        },
        {
          id: "luxury",
          name: "الفاخرة",
          label: "تجربة استثنائية",
          description:
            "استقبال خاص، إقامة فاخرة، وأولوية كاملة في كل خطوة — لأن رحلتك تستحق الأفضل.",
          features: ["استقبال خاص", "إقامة فاخرة", "أولوية كاملة في كل خطوة"],
          cta: "اختر الفاخرة",
        },
      ],
      packageNote:
        "اختر الباقة المناسبة، وسيتواصل معك فريقنا لتأكيد تفاصيل الرحلة.",
      packageModal: {
        eyebrow: "تفاصيل الباقة",
        included: "تشمل الباقة",
        details: "تفاصيل إضافية",
        formTitle: "اطلب عرضاً مخصصاً",
        formDescription:
          "شارك بيانات التواصل وسيتواصل معك فريقنا لتأكيد التفاصيل والسعر.",
        company: "اسم الشركة",
        phone: "رقم الهاتف",
        email: "البريد الإلكتروني",
        notes: "ملاحظات",
        notesPlaceholder: "التواريخ المتوقعة، عدد المسافرين، أو أي طلبات خاصة…",
        send: "إرسال الطلب",
        close: "إغلاق تفاصيل الباقة",
        detailLabels: ["المدة المقترحة", "مستوى الدعم", "مرونة البرنامج"],
        detailValues: {
          economy: ["من 5 إلى 7 ليالٍ", "دعم أساسي", "برنامج محدد مسبقاً"],
          special: ["من 7 إلى 10 ليالٍ", "منسق رحلة مخصص", "برنامج مرن"],
          luxury: [
            "مدة مصممة حسب الطلب",
            "خدمة كونسيرج على مدار الساعة",
            "مرونة كاملة",
          ],
        },
      },
      steps: [
        {
          number: "١",
          label: "عدد الأفراد",
          field: "people",
          type: "number",
          placeholder: "مثال: 4",
        },
        {
          number: "٢",
          label: "أيام الإقامة",
          field: "days",
          type: "number",
          placeholder: "مثال: 7",
        },
        {
          number: "٣",
          label: "تصنيف الفندق",
          field: "hotel",
          type: "select",
          options: ["3 نجوم", "4 نجوم", "5 نجوم", "شقق فندقية"],
        },
        {
          number: "٤",
          label: "وسيلة النقل",
          field: "vehicle",
          type: "select",
          options: [
            "سيارة VIP",
            "Mercedes V-Class",
            "Hyundai Staria",
            "حافلة سياحية",
          ],
        },
        {
          number: "٥",
          label: "مزارات إضافية",
          field: "extras",
          type: "text",
          placeholder: "اكتب الوجهات التي تهمك",
        },
      ],
      submit: "أرسل طلبك — سنتواصل معك فوراً",
      note: "رحلة عمرة على مقاسك — أنت تختار، ونحن ننفّذ.",
      ready: "تم تجهيز طلبك. أضف رقم واتساب الأعمال لإتمام الإرسال.",
    },
    testimonialsContact: {
      kicker: "10 — آراء العملاء وقنوات التواصل",
      title: "ماذا قال ضيوفنا؟",
      testimonials: [
        {
          quote:
            "تنظيم دقيق وخدمة راقية جعلت رحلتنا سلسة من البداية إلى النهاية.",
          source: "ضيف من المالديف",
        },
        {
          quote:
            "استقبال مميّز وإقامة مريحة قريبة من الحرم — تجربة تستحق التوصية من كل قلب.",
          source: "ضيف من الباكستان",
        },
      ],
      contactTitle: "نحن هنا لخدمتك",
      contactIntro: "تواصل معنا بأي طريقة تناسبك.",
      channels: [
        "الرقم الموحّد",
        "البريد الإلكتروني",
        "العنوان",
        "نموذج التواصل",
        "واتساب (متاح دائماً)",
      ],
      form: {
        name: "الاسم",
        email: "البريد الإلكتروني",
        message: "كيف يمكننا مساعدتك؟",
        send: "إرسال الرسالة",
        subject: "طلب تواصل من موقع مجموعة الكتبي",
      },
      email: "info@alkutbigroup.com",
    },
    whatsapp: "تواصل معنا عبر واتساب",
    footer: {
      statement: "رحلتك إلى المملكة، نصنعها بعناية.",
      explore: "استكشف",
      contact: "تواصل",
      email: "info@alkutbigroup.com",
      location: "المملكة العربية السعودية",
      rights: "جميع الحقوق محفوظة.",
    },
  },
  en: {
    brand: "Alkutbi Group",
    brandEn: "ALKUTBI GROUP",
    menu: "Menu",
    close: "Close",
    language: "Change language",
    portal: "Employee Portal",
    nav: [
      { label: "Home", href: "#home" },
      { label: "Services", href: "#services" },
      { label: "Umrah Visa", href: "#umrah-visa" },
      { label: "Packages", href: "#trip-planner" },
      { label: "Our Fleet", href: "#transport" },
      { label: "Offers", href: "#offers" },
      { label: "Discover KSA", href: "#discover" },
      { label: "Feedback", href: "#contact" },
    ],
    hero: {
      eyebrow: "A Complete Spiritual & Cultural Journey",
      title: "Alkutbi Group",
      subtitle:
        "With Al-Kutbi Group, every detail of your trip is in trusted hands — from visa to return.",
      primary: "Explore Packages",
      secondary: "Build Your Own Trip",
      scroll: "Scroll to explore",
    },
    services: {
      kicker: "02 — Services",
      title: "Everything You Need for Your Journey, Under One Roof",
      subtitle: "",
      cards: [
        {
          icon: "visa",
          title: "Umrah Visa",
          text: "We handle your visa application and all official procedures — quickly and seamlessly.",
        },
        {
          icon: "transport",
          title: "Transportation",
          text: "Organized transfers between the airport, Haram, and key sites — always on time.",
        },
        {
          icon: "tours",
          title: "Tours & Experiences",
          text: "Rich guided tours of the Kingdom's most significant religious, heritage, and cultural landmarks.",
        },
        {
          icon: "hospitality",
          title: "Hospitality & Premium Services",
          text: "Upscale accommodation and a reception befitting the Guests of God.",
        },
      ],
    },
    visa: {
      kicker: "03 — Umrah Visa Request",
      title: "Umrah Visa — In Just Three Steps",
      subtitle:
        "No complexity, no long waits. Submit your request through our platform and we handle the rest immediately.",
      steps: [
        {
          title: "Fill in the Request Form",
          text: "Enter your trip details: Nusuk request number, arrival and departure dates, number of pilgrims, hotel, transport type, and route.",
        },
        {
          title: "Instant Automated Processing",
          text: "You'll receive an immediate WhatsApp confirmation, and your request is saved securely in our system.",
        },
        {
          title: "We Handle the Rest",
          text: "We verify through the Nusuk platform, issue the visa officially, and deliver it to you with ease.",
        },
      ],
    },
    transport: {
      kicker: "07 — Fleet",
      title: "Our Fleet — Comfort in Every Transfer",
      subtitle:
        "Modern, well-equipped vehicles for seamless transfers between the airport, Haram, and key sites.",
      cards: [
        {
          title: "Mercedes S-Class · Lexus ES",
          text: "Ideal for families and small groups — up to 3 passengers, blending comfort with elegance.",
          meta: "Up to 3 passengers",
        },
        {
          title: "VIP SUV · GMC Yukon",
          text: "For those who expect the finest — up to 7 passengers, with maximum privacy and refinement.",
          meta: "Up to 7 passengers",
        },
        {
          title: "Hyundai Staria",
          text: "Contemporary design and generous space — up to 10 passengers, perfect for mid-sized groups.",
          meta: "Up to 10 passengers",
        },
        {
          title: "Large Tourist Coaches",
          text: "For large delegations — capacity up to 49 passengers in full comfort.",
          meta: "Up to 49 passengers",
        },
      ],
    },
    offers: {
      kicker: "08 — Seasonal Offers",
      title: "Offers You Don't Want to Miss",
      subtitle:
        "Special packages for key seasons — book before the offer ends.",
      offers: [
        {
          title: "Ramadan Packages",
          text: "Experience Umrah in the holiest of months. Exclusive programs designed for the blessed month of Ramadan.",
        },
        {
          title: "December Offers",
          text: "End your year with a spiritual journey to remember. Year-end season packages at special rates.",
        },
        {
          title: "National Day",
          text: "Special offers for the Saudi National Day.",
        },
      ],
    },
    discover: {
      kicker: "09 — Discover Saudi Arabia",
      title: "Discover Saudi Arabia",
      subtitle:
        "Beyond the Two Holy Mosques — a land of unmatched history and civilization.",
      categories: [
        {
          id: "religious",
          label: "Religious",
          description:
            "Walk through the holiest and most historically significant sites in Islam.",
          items: [
            { name: "The Grand Mosque", index: 0 },
            { name: "The Prophet’s Mosque", index: 1 },
            { name: "Jabal al-Noor", index: 2 },
          ],
        },
        {
          id: "heritage",
          label: "Heritage",
          description:
            "Explore ancient sites inscribed with civilizations thousands of years old.",
          items: [
            { name: "Hegra, AlUla", index: 3 },
            { name: "Historic Diriyah", index: 4 },
            { name: "Historic Jeddah", index: 5 },
          ],
        },
        {
          id: "tourism",
          label: "Tourism",
          description:
            "Discover the Kingdom's stunning landscapes, from desert to coast.",
          items: [
            { name: "Edge of the World", index: 6 },
            { name: "The Red Sea coast", index: 7 },
            { name: "Abha highlands", index: 8 },
          ],
        },
        {
          id: "culture",
          label: "Culture",
          description:
            "Experience authentic Saudi identity through its arts, traditions, and people.",
          items: [
            { name: "Ithra", index: 9 },
            { name: "Traditional souqs", index: 10 },
            { name: "National Museum", index: 11 },
          ],
        },
      ],
      add: "Add to my trip",
      added: "Added",
    },
    planner: {
      kicker: "06 — Make Your Trip",
      title: "Build Your Own Trip",
      subtitle: "A tailor-made Umrah experience — you choose, we deliver.",
      packagesKicker: "04 — Packages",
      modePackages: "Choose a Package",
      modeCustom: "Build Your Own Trip",
      packagesTitle: "Choose the Package That Suits You",
      packagesSubtitle: "",
      packages: [
        {
          id: "economy",
          name: "Economy",
          label: "Organized essentials",
          description:
            "A fully organized Umrah trip with all the essentials — smooth, comfortable, and worry-free.",
          features: [
            "A fully organized Umrah trip",
            "All the essentials",
            "Smooth and worry-free",
          ],
          cta: "Choose Economy",
        },
        {
          id: "special",
          name: "Premium",
          label: "Most popular",
          description:
            "A step up in accommodation and service, for a more personal and refined experience.",
          features: [
            "Premium accommodation",
            "Elevated service",
            "A personal, refined experience",
          ],
          cta: "Choose Premium",
          featured: true,
        },
        {
          id: "luxury",
          name: "VIP",
          label: "Signature experience",
          description:
            "Private reception, luxury accommodation, and full priority at every step — because your journey deserves the best.",
          features: [
            "Private reception",
            "Luxury accommodation",
            "Full priority at every step",
          ],
          cta: "Choose VIP",
        },
      ],
      packageNote:
        "Choose the package that suits you and our team will confirm the journey details.",
      packageModal: {
        eyebrow: "Package details",
        included: "What is included",
        details: "Additional details",
        formTitle: "Request a tailored quotation",
        formDescription:
          "Share your contact details and our team will confirm availability, details, and pricing.",
        company: "Company name",
        phone: "Phone number",
        email: "Email address",
        notes: "Notes",
        notesPlaceholder:
          "Expected dates, number of travellers, or any special requests…",
        send: "Send inquiry",
        close: "Close package details",
        detailLabels: [
          "Suggested duration",
          "Support level",
          "Itinerary flexibility",
        ],
        detailValues: {
          economy: [
            "5–7 nights",
            "Essential support",
            "Pre-arranged itinerary",
          ],
          special: [
            "7–10 nights",
            "Dedicated trip coordinator",
            "Flexible itinerary",
          ],
          luxury: [
            "Tailored duration",
            "24/7 concierge service",
            "Fully flexible",
          ],
        },
      },
      steps: [
        {
          number: "1",
          label: "Number of guests",
          field: "people",
          type: "number",
          placeholder: "Example: 4",
        },
        {
          number: "2",
          label: "Length of stay",
          field: "days",
          type: "number",
          placeholder: "Example: 7",
        },
        {
          number: "3",
          label: "Hotel category",
          field: "hotel",
          type: "select",
          options: ["3 stars", "4 stars", "5 stars", "Hotel apartment"],
        },
        {
          number: "4",
          label: "Transport",
          field: "vehicle",
          type: "select",
          options: [
            "VIP sedan",
            "Mercedes V-Class",
            "Hyundai Staria",
            "Tour coach",
          ],
        },
        {
          number: "5",
          label: "Extra destinations",
          field: "extras",
          type: "text",
          placeholder: "Tell us what interests you",
        },
      ],
      submit: "Send Your Request — We'll Be in Touch Immediately",
      note: "A tailor-made Umrah experience — you choose, we deliver.",
      ready:
        "Your request is ready. Add the business WhatsApp number to enable direct sending.",
    },
    testimonialsContact: {
      kicker: "10 — Testimonials & Contact",
      title: "What Our Guests Say",
      testimonials: [
        {
          quote:
            "Precise organization and outstanding service made our trip seamless from start to finish.",
          source: "Guest from Maldives",
        },
        {
          quote:
            "Exceptional reception and comfortable accommodation steps from the Haram — an experience worth every recommendation.",
          source: "Guest from Pakistan",
        },
      ],
      contactTitle: "We're Here for You",
      contactIntro: "Reach us in whatever way works best for you.",
      channels: [
        "Unified phone number",
        "Email address",
        "Our address",
        "Contact form",
        "WhatsApp (always available)",
      ],
      form: {
        name: "Name",
        email: "Email address",
        message: "How can we help?",
        send: "Send message",
        subject: "Contact request from the Alkutbi Group website",
      },
      email: "info@alkutbigroup.com",
    },
    whatsapp: "Chat with us on WhatsApp",
    footer: {
      statement: "Your journey to Saudi, designed with care.",
      explore: "Explore",
      contact: "Contact",
      email: "info@alkutbigroup.com",
      location: "Kingdom of Saudi Arabia",
      rights: "All rights reserved.",
    },
  },
} as const;

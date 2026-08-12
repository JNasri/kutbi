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
      { label: "الرئيسية", href: "/" },
      { label: "خدماتنا", href: "/services" },
      { label: "صمّم رحلتك", href: "/trips" },
      { label: "تواصل معنا", href: "/contact" },
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
    about: {
      kicker: "مجموعة الكتبي · المملكة العربية السعودية",
      title: "من نحن",
      eyebrow: "إرثٌ راسخ في خدمة ضيوف الرحمن",
      mark: "أ",
      body: "مجموعة الكتبي هي شركة لها باع طويل في المشاركة الفعّالة في خدمة زوار مكة المكرمة والمدينة المنورة. عُرف اسم الكتبي منذ أن بدأ السيد محمد مكي الكتبي العمل على خدمة مجموعة من الحجاج، إلى أن تأسست الشركة على يد المهندس عبدالرزاق بديع محمد مكي الكتبي. ومنذ ذلك الحين، نمت أعمالها وتوسعت حتى احتلت مركزاً متميزاً بين أكبر خمس شركات عمرة في المملكة العربية السعودية.",
      facts: [
        { value: "مكة والمدينة", label: "في خدمة زوار المدينتين المقدستين" },
        { value: "عبر الأجيال", label: "اسمٌ راسخ في خدمة الحجاج والمعتمرين" },
        { value: "ضمن أكبر 5", label: "من شركات العمرة في المملكة" },
      ],
    },
    services: {
      kicker: "02 — منظومة الخدمات",
      title: "كل ما تحتاجه في رحلتك، تحت سقف واحد",
      subtitle: "",
      cards: [
        {
          image: "/images/service-umrah-visa.jpeg",
          title: "تأشيرة العمرة",
          text: "نتولى إصدار تأشيرتك ومتابعة إجراءاتها الرسمية بسهولة وسرعة.",
        },
        {
          image: "/images/service-transportation.jpeg",
          title: "النقل والمواصلات",
          text: "تنقلات منظّمة بين المطار والحرم والمزارات — في موعدك دائماً.",
        },
        {
          image: "/images/service-tours.jpeg",
          title: "المزارات والتجارب",
          text: "جولات غنية في أبرز المواقع الدينية والتراثية والثقافية في المملكة.",
        },
        {
          image: "/images/service-hospitality.jpeg",
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
          title: "تويوتا كراون",
          type: "سيدان",
          text: "سيارة سيدان فاخرة للأفراد والمجموعات الصغيرة، تجمع بين الراحة والأناقة في كل رحلة.",
          meta: "حتى 3 ركاب",
          images: [
            "/images/fleet-toyota-crown-exterior.jpeg",
            "/images/fleet-toyota-crown-detail.jpeg",
          ],
        },
        {
          title: "فورد تورس",
          type: "سيدان",
          text: "خيار أنيق وعملي للتنقلات الخاصة، مع مقصورة مريحة وتجربة قيادة راقية.",
          meta: "حتى 3 ركاب",
          images: [
            "/images/fleet-ford-taurus-exterior.jpeg",
            "/images/fleet-ford-taurus-detail.jpeg",
          ],
        },
        {
          title: "GMC يوكن VIP",
          type: "دفع رباعي VIP",
          text: "لمن يستحق الفخامة — مساحة رحبة بأعلى مستويات الخصوصية والراحة.",
          meta: "حتى 7 ركاب",
          images: [
            "/images/fleet-gmc-yukon-exterior.jpeg",
            "/images/fleet-gmc-yukon-detail.jpeg",
          ],
        },
        {
          title: "تويوتا هايس",
          type: "هايس",
          text: "مساحة عملية ورحبة للمجموعات المتوسطة، مثالية للتنقلات اليومية المنظمة.",
          meta: "حتى 10 ركاب",
          images: [
            "/images/fleet-toyota-hiace-exterior.jpeg",
            "/images/fleet-toyota-hiace-detail.jpeg",
          ],
        },
        {
          title: "الحافلات السياحية الكبيرة",
          type: "حافلة سياحية",
          text: "للمجموعات الكبيرة — سعة تصل إلى 49 راكباً بكل الأريحية.",
          meta: "حتى 49 راكباً",
          images: [
            "/images/fleet-coaches-exterior.jpeg",
            "/images/fleet-coaches-detail.jpeg",
          ],
        },
        {
          title: "حافلة VIP الفاخرة",
          type: "حافلة VIP",
          text: "مقصورة تنفيذية بمقاعد فاخرة وتجهيزات متقدمة لرحلات خاصة أكثر راحة وتميزاً.",
          meta: "حتى 9 ركاب",
          images: [
            "/images/fleet-vip-coach-exterior.jpeg",
            "/images/fleet-vip-coach-detail.jpeg",
          ],
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
      ready:
        "تم تجهيز طلبك. سيتم فتح واتساب لإرسال الطلب إلى +966 12 542 6662.",
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
        "واتساب: +966 12 542 6662 (متاح دائماً)",
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
      { label: "Home", href: "/" },
      { label: "Services", href: "/services" },
      { label: "Plan Your Trip", href: "/trips" },
      { label: "Contact", href: "/contact" },
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
    about: {
      kicker: "ALKUTBI GROUP · SAUDI ARABIA",
      title: "About Us",
      eyebrow: "A legacy of serving the Guests of God",
      mark: "A",
      body: "Al Kutbi Group has been known for years for actively serving visitors to Makkah and Al-Madinah. The Al Kutbi name became known when Mr. Muhammad Makki Al Kutbi began serving groups of pilgrims. The company was later founded by Eng. Abdul Razzaq Badie Muhammad Makki Al Kutbi, and its business continued to grow and expand until it secured a distinguished position among the five largest Umrah companies in the Kingdom of Saudi Arabia.",
      facts: [
        {
          value: "Makkah & Madinah",
          label: "Serving visitors to the two holy cities",
        },
        {
          value: "Across generations",
          label: "A name rooted in pilgrim service",
        },
        { value: "Top five", label: "Among the Kingdom's Umrah companies" },
      ],
    },
    services: {
      kicker: "02 — Services",
      title: "Everything You Need for Your Journey, Under One Roof",
      subtitle: "",
      cards: [
        {
          image: "/images/service-umrah-visa.jpeg",
          title: "Umrah Visa",
          text: "We handle your visa application and all official procedures — quickly and seamlessly.",
        },
        {
          image: "/images/service-transportation.jpeg",
          title: "Transportation",
          text: "Organized transfers between the airport, Haram, and key sites — always on time.",
        },
        {
          image: "/images/service-tours.jpeg",
          title: "Tours & Experiences",
          text: "Rich guided tours of the Kingdom's most significant religious, heritage, and cultural landmarks.",
        },
        {
          image: "/images/service-hospitality.jpeg",
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
          title: "Toyota Crown",
          type: "Sedan",
          text: "A refined luxury sedan for individuals and small groups, combining comfort and elegance on every journey.",
          meta: "Up to 3 passengers",
          images: [
            "/images/fleet-toyota-crown-exterior.jpeg",
            "/images/fleet-toyota-crown-detail.jpeg",
          ],
        },
        {
          title: "Ford Taurus",
          type: "Sedan",
          text: "An elegant and practical choice for private transfers, with a comfortable cabin and refined ride.",
          meta: "Up to 3 passengers",
          images: [
            "/images/fleet-ford-taurus-exterior.jpeg",
            "/images/fleet-ford-taurus-detail.jpeg",
          ],
        },
        {
          title: "VIP GMC Yukon",
          type: "VIP SUV",
          text: "For those who expect the finest — generous space with maximum privacy and comfort.",
          meta: "Up to 7 passengers",
          images: [
            "/images/fleet-gmc-yukon-exterior.jpeg",
            "/images/fleet-gmc-yukon-detail.jpeg",
          ],
        },
        {
          title: "Toyota Hiace",
          type: "Hiace",
          text: "A practical, spacious vehicle for mid-sized groups and smoothly organized daily transfers.",
          meta: "Up to 10 passengers",
          images: [
            "/images/fleet-toyota-hiace-exterior.jpeg",
            "/images/fleet-toyota-hiace-detail.jpeg",
          ],
        },
        {
          title: "Large Tourist Coaches",
          type: "Tourist Bus",
          text: "For large delegations — capacity up to 49 passengers in full comfort.",
          meta: "Up to 49 passengers",
          images: [
            "/images/fleet-coaches-exterior.jpeg",
            "/images/fleet-coaches-detail.jpeg",
          ],
        },
        {
          title: "Luxury VIP Coach",
          type: "VIP Bus",
          text: "An executive cabin with premium seating and advanced amenities for an exceptionally comfortable private journey.",
          meta: "Up to 9 passengers",
          images: [
            "/images/fleet-vip-coach-exterior.jpeg",
            "/images/fleet-vip-coach-detail.jpeg",
          ],
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
        "Your request is ready. WhatsApp will open to send it to +966 12 542 6662.",
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
        "WhatsApp: +966 12 542 6662 (always available)",
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

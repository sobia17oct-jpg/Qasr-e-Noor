export interface HallInfo {
  id: 'darbar' | 'noor-mahal';
  name: string;
  urduName: string;
  subtitle: string;
  capacity: string;
  privacyNote: string;
  image: string;
  imageAlt: string;
  description: string;
  features: string[];
}

export type CeremonyCategory = 'barat-walima' | 'mehndi-nikah';

export interface PackageTier {
  id: 'silver' | 'gold' | 'royal';
  name: string;
  urduTitle: string;
  pricePerHead: number;
  featured?: boolean;
  tagline: string;
  menus: Record<CeremonyCategory, string[]>;
  stageHighlight: Record<CeremonyCategory, string>;
}

export interface AmenityItem {
  id: string;
  title: string;
  summary: string;
  iconName: 'power' | 'parking' | 'climate' | 'bridal' | 'lighting' | 'staff';
}

export type GalleryCategory =
  | 'All'
  | 'Stage Decor'
  | 'Dining & Banquet'
  | 'Lighting & Entrance'
  | 'Exterior';

export interface GalleryItem {
  id: string;
  title: string;
  category: Exclude<GalleryCategory, 'All'>;
  hallLabel: string;
  image: string;
  alt: string;
}

export const VENUE_CONTACT = {
  brandEnglish: 'Qasr-e-Noor Wedding Hall',
  brandShort: 'Qasr-e-Noor',
  brandUrdu: 'قصرِ نور',
  brandUrduFull: 'قصرِ نور شادی ہال',
  phoneDisplay: '0341-0711313',
  phoneInternational: '+92 341-0711313',
  phoneHref: 'tel:+923410711313',
  whatsappNumber: '923410711313',
  whatsappUrl: 'https://wa.me/923410711313',
  visitingHours: '10:00 AM – 10:00 PM Daily',
  addressLine: 'Near Lali Masjid, Qaisar Abad (Paanr), Haji Baba Buner Road, Mingora, District Swat, KPK',
  landmarks: [
    '5 mins from Nishat Chowk / Mingora Bypass',
    'Direct wide approach via Haji Baba & Buner Road',
    'Landmark: Adjacent to Lali Masjid, Qaisar Abad (Paanr)',
  ],
  mapsQueryUrl:
    'https://www.google.com/maps/search/?api=1&query=Lali+Masjid+Qaisar+Abad+Haji+Baba+Buner+Road+Mingora+Swat',
};

export const HERO_IMAGE = '/src/assets/images/hero_banquet_hall_1794911123280.jpg';

export const HERO_HIGHLIGHTS = [
  'Up to 800+ Guests',
  'Separate Pardah Halls',
  'Ample Secure Parking',
  'Solar & Generator Backup',
];

export const HALLS_DATA: HallInfo[] = [
  {
    id: 'darbar',
    name: 'Grand Gents Hall',
    urduName: 'دربار ہال',
    subtitle: 'Darbar Hall',
    capacity: 'Up to 500 Guests',
    privacyNote: 'Dedicated Main Entrance',
    image: '/src/assets/images/gents_darbar_hall_1794911123414.jpg',
    imageAlt:
      'Grand Gents Darbar Hall with crystal chandeliers, emerald drapery, and royal banquet tables',
    description:
      'Engineered for dignified Swati gatherings and grand Barat receptions, featuring soaring chandelier bays, unobstructed stage sightlines, and spacious formal table service.',
    features: [
      'Capacity up to 500 seated guests',
      'Dedicated main road entrance & reception foyer',
      'Royal velvet & gold banquet seating',
      'Central winter heating & high-capacity summer AC',
      'Acoustic hall treatment & high-end sound system',
    ],
  },
  {
    id: 'noor-mahal',
    name: 'Exclusive Ladies Hall',
    urduName: 'نور محل',
    subtitle: 'Noor Mahal',
    capacity: 'Up to 400 Guests',
    privacyNote: 'Complete Pardah Privacy',
    image: '/src/assets/images/ladies_noor_mahal_1794911123604.jpg',
    imageAlt:
      'Exclusive Ladies Noor Mahal with lush floral wedding stage, crystal chandeliers, and private lounges',
    description:
      'An architectural sanctuary honoring family modesty and comfort, completely segregated from the gents wing with its own sheltered lobby, female hospitality team, and private bridal suite.',
    features: [
      '100% strict Pardah privacy & shielded access corridor',
      'Separate ladies entrance, reception lobby & restrooms',
      'Capacity up to 400 guests in luxury lounge seating',
      'Dedicated air-conditioned Bridal Dressing Suite',
      'Custom fresh floral stage setup & ambient lighting',
    ],
  },
];

export const PACKAGES_DATA: PackageTier[] = [
  {
    id: 'silver',
    name: 'Silver Package',
    urduTitle: 'سلور پیکج',
    pricePerHead: 2200,
    tagline: 'Refined classic hospitality for intimate Nikah, Walima & family gatherings.',
    menus: {
      'barat-walima': [
        'Chicken Qorma',
        'Chicken Biryani',
        'Roghani Naan',
        'Fresh Garden Salad & Mint Raita',
        'Traditional Shahi Kheer',
        'Assorted Soft Drinks & Mineral Water',
        'Standard Stage Decor Included',
      ],
      'mehndi-nikah': [
        'Aromatic Chicken Biryani',
        'Lahori Chicken Qorma',
        'Roghani Naan',
        'Fresh Salad & Mint Raita',
        'Creamy Shahi Kheer',
        'Soft Drinks, Mineral Water & Fresh Chai',
        'Standard Floral Mehndi / Nikah Stage',
      ],
    },
    stageHighlight: {
      'barat-walima': 'Standard Stage Decor with Crystal Backdrop',
      'mehndi-nikah': 'Classic Marigold & Ivory Nikah Stage',
    },
  },
  {
    id: 'gold',
    name: 'Gold Package',
    urduTitle: 'گولڈ پیکج',
    pricePerHead: 2850,
    featured: true,
    tagline: 'Our most sought-after Swati wedding feast balancing tradition and luxury decor.',
    menus: {
      'barat-walima': [
        'Mutton Karahi',
        'Kabuli Pulao',
        'Charcoal Chicken Tikka',
        'Roghani & Kandahari Naan',
        'Assorted Fresh Salads & Raita',
        'Warm Gulab Jamun & Fruit Trifle',
        'Fresh Tea / Swati Green Tea (Qehwa)',
        'Luxury Floral Stage Included',
      ],
      'mehndi-nikah': [
        'Peshawari Mutton Karahi',
        'Aromatic Kabuli Pulao',
        'Chicken Tikka & Seekh Platter',
        'Roghani & Kandahari Naan',
        'Assorted Salads & Chutney',
        'Warm Gulab Jamun & Custard Trifle',
        'Kashmiri Chai / Green Tea Service',
        'Luxury Floral Canopy & Brass Lanterns',
      ],
    },
    stageHighlight: {
      'barat-walima': 'Luxury Custom Floral Stage & Chandelier Glow',
      'mehndi-nikah': 'Designer Jasmine & Marigold Floral Stage',
    },
  },
  {
    id: 'royal',
    name: 'Royal Swat Feast',
    urduTitle: 'شاہی سوات ضیافت',
    pricePerHead: 3600,
    tagline: 'Unrivaled aristocratic Swati cuisine with live stations and VIP palace walkway.',
    menus: {
      'barat-walima': [
        'Traditional Swati Rosh',
        'Slow-Cooked Mutton Kunna',
        'Kabuli Afghani Pulao',
        'Authentic Chapli Kabab & Live BBQ Station',
        'Fresh Peshawari Naan',
        'Shahi Tukray & Zafrani Kheer',
        'Traditional Swati Qehwa Service',
        'VIP Royal Stage & Illuminated Entrance Walkway',
      ],
      'mehndi-nikah': [
        'Traditional Swati Namkeen Rosh',
        'Mutton Kunna & Kabuli Afghani Pulao',
        'Live Chapli Kabab & Charcoal BBQ Station',
        'Peshawari & Roghani Naan',
        'Assorted Royal Salads & Raita',
        'Shahi Tukray & Zafrani Kheer',
        'Cardamom Qehwa & Kashmiri Tea Bar',
        'VIP Royal Floral Stage & Grand Walkway',
      ],
    },
    stageHighlight: {
      'barat-walima': 'VIP Royal Stage & Grand Floral Entrance Walkway',
      'mehndi-nikah': 'Royal Heritage Mehndi Pavilion & Entrance Walkway',
    },
  },
];

export const AMENITIES_DATA: AmenityItem[] = [
  {
    id: 'power',
    title: 'Uninterrupted Power',
    summary: 'Heavy-duty soundproof standby generators paired with commercial solar backup so lighting, HVAC, and sound never falter.',
    iconName: 'power',
  },
  {
    id: 'parking',
    title: 'Spacious & Secure Parking',
    summary: 'Dedicated paved courtyard parking inside the gated perimeter supervised by trained security personnel.',
    iconName: 'parking',
  },
  {
    id: 'climate',
    title: 'All-Season Climate Control',
    summary: 'Centralized winter heating tailored for crisp Swat evenings and powerful multi-zone AC for summer celebrations.',
    iconName: 'climate',
  },
  {
    id: 'bridal',
    title: 'Bridal Suite & VIP Lounge',
    summary: 'Private luxury dressing rooms with full-length vanity mirrors, en-suite comfort, and secluded family lounge seating.',
    iconName: 'bridal',
  },
  {
    id: 'lighting',
    title: 'Custom Stage & Lighting',
    summary: 'Theme-based fresh floral arches, carved Mughal lattice backdrops, and dimmable crystal chandelier arrays.',
    iconName: 'lighting',
  },
  {
    id: 'staff',
    title: 'Professional Hospitality Staff',
    summary: 'Disciplined, uniformed male service stewards for Darbar Hall and dedicated female staff inside Noor Mahal.',
    iconName: 'staff',
  },
];

export const GALLERY_CATEGORIES: GalleryCategory[] = [
  'All',
  'Stage Decor',
  'Dining & Banquet',
  'Lighting & Entrance',
  'Exterior',
];

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'g-1',
    title: 'Royal Barat Ivory & Emerald Stage',
    category: 'Stage Decor',
    hallLabel: 'Darbar & Noor Mahal',
    image: '/src/assets/images/royal_stage_decor_1794911124723.jpg',
    alt: 'Custom ivory floral arch and carved gold Mughal wedding stage with velvet sofa',
  },
  {
    id: 'g-2',
    title: 'Traditional Mehndi & Nikah Floral Canopy',
    category: 'Stage Decor',
    hallLabel: 'Noor Mahal Ladies Wing',
    image: '/src/assets/images/floral_chandelier_stage_1794911140899.jpg',
    alt: 'Marigold and jasmine wedding stage with brass lanterns and emerald velvet seating',
  },
  {
    id: 'g-3',
    title: 'Authentic Swati Royal Banquet Spread',
    category: 'Dining & Banquet',
    hallLabel: 'Royal Swat Feast',
    image: '/src/assets/images/swati_royal_feast_1794911124896.jpg',
    alt: 'Copper serving vessels with Kabuli Pulao, Mutton Karahi, Chapli Kabab, and Roghani Naan',
  },
  {
    id: 'g-4',
    title: 'Darbar Hall Formal Table Setting',
    category: 'Dining & Banquet',
    hallLabel: 'Grand Gents Hall',
    image: '/src/assets/images/gents_darbar_hall_1794911123414.jpg',
    alt: 'Formal round dining tables dressed in ivory linen and emerald chairs under chandeliers',
  },
  {
    id: 'g-5',
    title: 'Illuminated Floral Entrance Walkway',
    category: 'Lighting & Entrance',
    hallLabel: 'VIP Ceremony Foyer',
    image: '/src/assets/images/lighting_entrance_walkway_1794911125665.jpg',
    alt: 'Grand marble entrance corridor with illuminated floral arches and crystal chandeliers',
  },
  {
    id: 'g-6',
    title: 'Crystal Chandelier Main Banquet Canopy',
    category: 'Lighting & Entrance',
    hallLabel: 'Main Celebration Hall',
    image: '/src/assets/images/hero_banquet_hall_1794911123280.jpg',
    alt: 'Soaring chandelier canopy with deep emerald velvet ceiling drapery',
  },
  {
    id: 'g-7',
    title: 'Twilight Palace Facade & Parking Courtyard',
    category: 'Exterior',
    hallLabel: 'Haji Baba Buner Road, Mingora',
    image: '/src/assets/images/exterior_palace_facade_clean_1794911141185.jpg',
    alt: 'Illuminated Qasr-e-Noor stone exterior facade against Swat mountains with paved parking',
  },
  {
    id: 'g-8',
    title: 'Noor Mahal Private Ladies Banquet',
    category: 'Dining & Banquet',
    hallLabel: 'Exclusive Ladies Hall',
    image: '/src/assets/images/ladies_noor_mahal_1794911123604.jpg',
    alt: 'Private ladies wedding hall with white rose stage and emerald lounge seating',
  },
];

export const EVENT_TYPES = [
  'Barat',
  'Walima',
  'Mehndi / Mayun',
  'Nikah',
  'Engagement',
  'Corporate / Jirga',
] as const;

export function formatPKR(amount: number): string {
  return `PKR ${amount.toLocaleString('en-PK')}`;
}

export function buildWhatsAppLink(message: string): string {
  return `${VENUE_CONTACT.whatsappUrl}?text=${encodeURIComponent(message)}`;
}

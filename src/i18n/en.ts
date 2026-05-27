/**
 * Dictionnaire anglais — doit matcher fr.ts structurellement (typage strict).
 */

import type { Dictionary } from './index';

const en: Dictionary = {
  common: {
    site_name: 'CarPIQ',
    tagline: 'Independent European car comparison platform',
    skip_to_content: 'Skip to main content',
  },

  meta: {
    home_title: 'CarPIQ: independent European car comparison platform',
    home_description:
      'Calculate the real monthly cost of a car in 3 minutes. Transparent methodology, no advertising, no commercial bias. 7 European countries.',
    methodology_title:
      'CarPIQ methodology: how we calculate car TCO',
    methodology_description:
      'Discover our transparent methodology: data sources, TCO algorithms, IMD academic validation. Rigorous approach for informed decisions.',
    about_title: 'About CarPIQ: who we are',
    about_description:
      'Discover the story and team behind CarPIQ, the independent European car comparison platform. Vision, values, founder.',
    contact_title: 'Contact CarPIQ',
    contact_description:
      'Contact the CarPIQ team: user support, press, partnerships. Response within 48 working hours.',
    legal_title: 'Legal notice and privacy | CarPIQ',
    legal_description:
      'Legal notice, privacy policy, terms of service and cookie management for CarPIQ.',
  },

  nav: {
    home: 'Home',
    methodology: 'Methodology',
    about: 'About',
    glossary: 'Glossary',
    contact: 'Contact',
    tokens: 'Design tokens',
    components: 'Components',
    open_menu: 'Open menu',
    close_menu: 'Close menu',
  },

  language: {
    label: 'Language',
    current: 'English',
    switch_to: 'Switch language',
    fr: 'French',
    en: 'English',
  },

  home: {
    hero: {
      title: 'Which car should you buy, and what will it really cost?',
      subtitle:
        '3 minutes. Personalised calculation based on your driving and vehicle age.',
      image_alt:
        'Panoramic view of a European road with cars, illustrating the choice of a car',
    },
    ctas: {
      question: 'What would you like to do?',
      find: {
        title: 'Find my next car',
        description:
          'Personalised analysis based on your budget and your needs',
        duration: '~3 minutes',
        button: 'Start',
        image_alt:
          'Illustration of a car showroom with several models to compare',
      },
      analyze: {
        title: 'Analyse my current car',
        description: 'Understand the real cost of your current car today',
        duration: '~2 minutes',
        button: 'Start',
        image_alt:
          'Illustration of a car being analysed with financial data displayed',
      },
      hesitating: "I don't know where to start → Guide me",
    },
    process: {
      section_title: 'How it works',
      step_1: {
        title: 'Your criteria',
        description:
          'A few questions about your budget, your trips, your preferences',
      },
      step_2: {
        title: 'Our analysis',
        description:
          'Rigorous methodology applied to 500+ European models',
      },
      step_3: {
        title: 'Your recommendation',
        description: 'The car that fits you, with its real monthly cost',
      },
    },
    values: {
      section_title: 'Why CarPIQ',
      independent: {
        title: 'Independent and neutral',
        description:
          'No advertising, no commercial ties with manufacturers',
      },
      transparent: {
        title: 'Transparent methodology',
        description:
          'Open data sources, verifiable calculations, explicit assumptions',
      },
      european: {
        title: 'European vision',
        description: '7 countries analysed, tax included, real market prices',
      },
    },
    methodology_preview: {
      section_title: 'Our methodology',
      preview:
        'The monthly cost of a car includes depreciation, fuel, insurance, tax and maintenance. CarPIQ calculates each of these items based on your profile and compares 500+ European models across 7 countries.',
      link: 'Discover the full methodology',
    },
  },

  methodology: {
    hero: {
      title: 'Our methodology: rigour at the service of your decision',
      subtitle:
        'Understand how CarPIQ calculates the true cost of a car. Sources, algorithms and transparent validations.',
    },
    approach: {
      section_title: 'Our approach',
      principle_1: {
        title: 'Primary data only',
        description:
          'No industry averages. Each number comes from a verifiable source: manufacturers, ADAC, Spritmonitor, national tax authorities.',
      },
      principle_2: {
        title: 'Public methodology',
        description:
          'All our calculations are documented and reproducible. You can challenge our assumptions and our sources.',
      },
      principle_3: {
        title: 'Commercial neutrality',
        description:
          'No advertising, no affiliate links, no bias towards any manufacturer or powertrain type.',
      },
    },
    sources: {
      section_title: 'Data sources',
      intro:
        'CarPIQ relies on primary European sources, verifiable and regularly updated.',
      price_label: 'Purchase price',
      price_desc:
        'Manufacturers (official catalogues), DAT (Germany), L’Argus (France)',
      consumption_label: 'Real-world consumption',
      consumption_desc: 'Spritmonitor.de (3M European users)',
      maintenance_label: 'Maintenance costs',
      maintenance_desc: 'ADAC Cost Calculator (European reference)',
      depreciation_label: 'Depreciation',
      depreciation_desc: 'Certified resale data by national market',
      tax_label: 'Taxation',
      tax_desc: 'National tax authorities (7 countries)',
    },
    algorithms: {
      section_title: 'TCO algorithms',
      intro:
        'Total Cost of Ownership (TCO) includes 6 main components. Click on each to understand our methodology.',
      price_title: 'Purchase price',
      price_body:
        'Official manufacturer catalogue price by country and configuration. Monthly update. Includes standard options, excludes optional equipment.',
      depreciation_title: 'Depreciation',
      depreciation_body:
        '5-step curve modelling (1, 2, 5, 7, 10 years) based on certified resale data. Specific to each model and each national market.',
      fuel_title: 'Fuel or energy',
      fuel_body:
        'Spritmonitor consumption (real user data) rather than WLTP (theoretical). Average annual energy prices by country. Modulation based on trip profile.',
      maintenance_title: 'Maintenance and repairs',
      maintenance_body:
        'ADAC costs by brand and vehicle category. Modulation based on age and cumulative mileage.',
      insurance_title: 'Insurance',
      insurance_body:
        'Estimate by risk category, segment and user profile. Sources: Allianz, AXA, national data.',
      tax_title: 'Taxation',
      tax_body:
        'National calculation for each target country: penalty taxes, annual taxes, business deductibility if applicable.',
    },
    academic: {
      section_title: 'Academic validation',
      paragraph_1:
        'Our methodology is undergoing academic validation with IMD Lausanne as part of a research partnership funded by Innosuisse.',
      paragraph_2:
        'The methodological white paper will be published soon. It details our assumptions, sources, algorithms and limitations.',
      cta_label: 'Download the white paper',
      cta_unavailable: 'Coming soon',
    },
    cta_section: {
      see_sources: 'See detailed sources',
      start_analysis: 'Start an analysis',
    },
  },

  about: {
    hero: {
      title: 'The team behind CarPIQ',
      subtitle:
        'CarPIQ exists to make automotive decisions more informed, more rational, and better aligned with the real needs of European drivers.',
    },
    mission: {
      section_title: 'Our mission',
      paragraph_1:
        'CarPIQ exists to make automotive decisions more informed, more rational, and better aligned with the real needs of European drivers.',
      paragraph_2:
        'Our conviction: current car comparison platforms serve commercial interests rather than buyers. CarPIQ changes that.',
    },
    founder: {
      section_title: 'The founder',
      name: 'Jérémie Blard',
      title: 'Founder of CarPIQ',
      bio: 'Jérémie has 17 years of industrial experience in technical and strategic roles. A graduate of IMD Lausanne (Strategy & Digital Acceleration, with distinction, 2026) and PMP certified, he launched CarPIQ in 2026 to answer a question that frustrated him personally: how do you really choose a car in Europe?',
      commitment:
        'CarPIQ is a full-time project run personally by Jérémie. No marketing team, no investors with a commercial agenda. Just one obsession: methodological rigour at the service of the user.',
      photo_placeholder_alt: 'Profile photo (coming soon)',
      linkedin_label: 'LinkedIn profile',
    },
    history: {
      section_title: 'Our history',
      milestone_2025: 'Initial idea, methodological research',
      milestone_2026_01: 'IMD CAS graduation, start of development',
      milestone_2026_06: 'Public launch of CarPIQ',
      milestone_2026_09: 'IMD academic partnership',
      milestone_2027: 'Full European vision',
    },
    values: {
      section_title: 'Our values',
      independence_title: 'Independence',
      independence_desc:
        'No advertising. No commercial partnership influencing our analysis.',
      transparency_title: 'Transparency',
      transparency_desc:
        'Public methodology. Verifiable sources. Honest limitations.',
      rigor_title: 'Rigour',
      rigor_desc:
        'Academic validation. Continuous data updates. Iteration based on feedback.',
      european_title: 'European',
      european_desc:
        '7 countries analysed. Authentic European vision, not a translated French product.',
    },
    contact_cta: {
      section_title: 'Contact and collaboration',
      intro: 'Are you a journalist, researcher, potential partner?',
      press: 'Press contact',
      general: 'General contact',
      partnerships: 'Partnerships',
    },
  },

  contact: {
    hero: {
      title: 'Contact',
      subtitle:
        'A question, a suggestion, a topic to explore? We read and respond to every message.',
    },
    topics: {
      section_title: 'How can we help?',
      support_title: 'User support',
      support_desc: 'A question about an analysis? A bug encountered?',
      press_title: 'Press and media',
      press_desc: 'Interview, press release, data for an article',
      partnerships_title: 'Partnerships',
      partnerships_desc: 'Commercial or academic collaboration',
    },
    section_form: 'Send us a message',
    field_name: 'Your name',
    placeholder_name: 'John Doe',
    field_email: 'Your email',
    field_topic: 'Category',
    field_subject: 'Subject',
    placeholder_subject: 'In a few words…',
    field_message: 'Your message',
    placeholder_message:
      'Describe your request (minimum 50 characters)…',
    help_message: 'Minimum 50 characters, maximum 5000.',
    topic_support: 'User support',
    topic_press: 'Press and media',
    topic_partnerships: 'Partnerships',
    error_name: 'Please enter your name (minimum 2 characters).',
    error_email: 'Please enter a valid email address.',
    error_subject: 'Subject must be at least 3 characters.',
    error_message_short: 'Your message must be at least 50 characters.',
    error_send:
      'An error occurred while sending. Please try again in a few moments.',
    error_network: 'Network error. Please check your connection.',
    error_title: 'Unable to send',
    success_title: 'Message sent',
    success_message:
      'Thank you for your message. We will respond within 48 working hours.',
    submit: 'Send message',
    submit_loading: 'Sending…',
    gdpr_notice:
      'By sending this form, you agree that CarPIQ processes your data solely to respond to you. No marketing use, no resale.',
    coordinates: {
      section_title: 'Contact details',
      email_general: 'General email',
      email_press: 'Press',
      email_partnerships: 'Partnerships',
      response_label: 'Response time',
      response_value: 'Within 48 working hours on average',
      location_label: 'Location',
      location_value: 'Switzerland (Lake Geneva Region)',
    },
  },

  legal: {
    hero: {
      title: 'Legal notice and privacy',
      subtitle:
        'Legal information, privacy policy, terms of service and cookie management.',
    },
    nav: {
      mentions: 'Legal notice',
      privacy: 'Privacy',
      cgu: 'Terms of service',
      cookies: 'Cookies',
    },
    mentions: {
      section_title: 'Legal notice',
      editor_title: 'Site publisher',
      editor_body:
        'The CarPIQ site is published by Jérémie Blard, founder, based in Switzerland (Lake Geneva Region). Contact: contact@carpiq.eu.',
      hosting_title: 'Hosting',
      hosting_body:
        'The site is hosted by Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, USA. More information at vercel.com.',
      ip_title: 'Intellectual property',
      ip_body:
        'All content on the site (text, methodology, illustrations, source code) is protected by copyright. Any reproduction without authorisation is prohibited.',
    },
    privacy: {
      section_title: 'Privacy policy',
      intro:
        'CarPIQ complies with the General Data Protection Regulation (GDPR) and the Swiss Federal Act on Data Protection. We collect only the data strictly necessary for the operation of the service.',
      data_collected_title: 'Data collected',
      data_collected_body:
        'When you use CarPIQ, we collect: (1) the answers you provide to the questionnaires (budget, mileage, etc.) — stored only in your browser, never on our servers without your consent; (2) your email address if you create an account; (3) anonymous browsing statistics (pages visited, duration).',
      no_sale_title: 'No data resale',
      no_sale_body:
        'CarPIQ does not sell, rent, or share your personal data with third parties for commercial purposes. No targeted advertising. No retargeting.',
      rights_title: 'Your rights',
      rights_body:
        'Under GDPR, you have the right to access, rectification, erasure, restriction, portability and objection regarding your personal data. To exercise these rights: contact@carpiq.eu.',
      retention_title: 'Retention period',
      retention_body:
        'Messages sent via the contact form are kept for a maximum of 24 months. Inactive user accounts are deleted after 36 months without login.',
    },
    cgu: {
      section_title: 'Terms of service',
      intro:
        'Using CarPIQ is free and subject to the conditions below. By accessing the site, you accept these conditions.',
      service_title: 'Nature of the service',
      service_body:
        'CarPIQ provides an estimate of the Total Cost of Ownership (TCO) of a vehicle for indicative purposes. Results are based on public sources and assumptions detailed in the methodology. They do not constitute personalised financial or purchase advice.',
      liability_title: 'Limitation of liability',
      liability_body:
        'CarPIQ cannot be held liable for purchase decisions made based on the analyses provided. Prices, taxes and costs change: it is the user’s responsibility to verify data against primary sources before any financial commitment.',
      conduct_title: 'Acceptable conduct',
      conduct_body:
        'Automated access (scraping, bots) to the site is prohibited without prior authorisation. Attempts to overload, intrude or hijack will result in immediate blocking.',
    },
    cookies: {
      section_title: 'Cookie policy',
      intro:
        'CarPIQ uses a limited number of cookies to ensure the operation of the site and to anonymously measure its usage.',
      essential_title: 'Essential cookies',
      essential_body:
        'These cookies are necessary for the site to function (language preference, session persistence). They cannot be disabled.',
      analytics_title: 'Analytics cookies (optional)',
      analytics_body:
        'With your consent, we use Plausible Analytics and Mixpanel to understand how the site is used (popular pages, completion rates). These tools do not use personal identifiers and do not track your activities on other sites.',
      optout_title: 'Refusal and withdrawal of consent',
      optout_body:
        'You can at any time refuse or withdraw your consent for analytics cookies via your browser settings or by contacting us: contact@carpiq.eu.',
    },
    last_updated: 'Last updated: ',
  },

  tokens: {
    title: 'CarPIQ V2 Design Tokens',
    intro: 'Visual reference of the tokens defined in global.css',
    primary_colors: 'Primary colors',
    semantic_colors: 'Semantic colors',
    typography: 'Typography',
    typography_display: 'Display (Playfair Display)',
    typography_body: 'Body (DM Sans)',
    typography_sample_brand: 'CarPIQ',
    typography_sample_h1: 'Comparator',
    typography_sample_h2: 'Car comparison',
    typography_sample_h3: 'Which car should I buy?',
    typography_sample_body:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    buttons_prototype: 'Buttons (prototypes — Phase 2 refactor)',
    button_primary_teal: 'Primary teal',
    button_accent_amber: 'Amber accent',
    button_secondary: 'Secondary',
    button_tertiary: 'Tertiary link',
    teal_label: 'Teal (primary)',
    amber_label: 'Amber (accent)',
    back_home: 'Back to home',
  },

  components: {
    title: 'Atomic components',
    intro:
      'Visual reference of the 5 atomic components for Phase 2: Button, Input, Badge, Icon, Card.',
    variants: 'Variants',
    sizes: 'Sizes',
    states: 'States',
    with_icons: 'With icons',
    full_width: 'Full width',
    paddings: 'Paddings',
    catalog: 'Catalog',
    section_button: 'Button',
    section_button_desc:
      '3 variants × 3 sizes + disabled / loading states + icons.',
    section_input: 'Input',
    section_input_desc:
      'Text or select field with label, help and error state.',
    section_badge: 'Badge',
    section_badge_desc:
      '6 semantic variants × 2 sizes. Optional icon.',
    section_icon: 'Icon',
    section_icon_desc_pre: 'Lightweight wrapper around lucide-vue-next.',
    section_icon_desc_post: 'mapped icons.',
    section_card: 'Card',
    section_card_desc: '3 variants × 4 paddings. Static component.',
    button_primary: 'Primary',
    button_secondary: 'Secondary',
    button_ghost: 'Ghost',
    button_small: 'Small',
    button_medium: 'Medium (default)',
    button_large: 'Large',
    button_normal: 'Normal',
    button_disabled: 'Disabled',
    button_loading: 'Loading…',
    button_next: 'Next',
    button_prev: 'Previous',
    button_validate: 'Validate',
    button_close: 'Close',
    button_fullwidth: 'Full width button',
    input_email_label: 'Email address',
    input_email_help: 'We will never share your email.',
    input_budget_label: 'Monthly budget (€)',
    input_budget_help: 'Maximum acceptable monthly payment.',
    input_country_label: 'Country',
    input_country_placeholder: '— Select —',
    input_email_error: 'Invalid email format.',
    input_disabled_label: 'Disabled field',
    input_disabled_value: 'Frozen value',
    input_ref_label: 'Reference',
    input_ref_help: 'Read only.',
    badge_default: 'Default',
    badge_recommended: 'Recommended',
    badge_new: 'New',
    badge_validated: 'Validated',
    badge_warning: 'Warning',
    badge_error: 'Error',
    badge_small: 'Small',
    badge_medium: 'Medium',
    badge_electric: 'Electric',
    badge_petrol: 'Petrol',
    badge_verified: 'Verified',
    badge_info: 'Info',
    card_default_title: 'Default',
    card_default_desc: 'Light border + subtle shadow. Common usage.',
    card_elevated_title: 'Elevated',
    card_elevated_desc:
      'Stronger shadow. Prominent cards (hero, results).',
    card_outlined_title: 'Outlined',
    card_outlined_desc: 'Border only, no shadow. More discreet.',
    card_padding_none: 'padding="none"',
    card_padding_sm: 'padding="sm" (16px)',
    card_padding_md: 'padding="md" (24px, default)',
    card_padding_lg: 'padding="lg" (32px)',
    footer_label: 'CarPIQ V2 — Atomic components',
  },

  countries: {
    fr: 'France',
    be: 'Belgium',
    ch: 'Switzerland',
    de: 'Germany',
    nl: 'Netherlands',
    it: 'Italy',
    es: 'Spain',
  },

  footer: {
    methodology: 'Methodology',
    about: 'About',
    contact: 'Contact',
    legal: 'Legal notice',
    privacy: 'Privacy',
    glossary: 'Glossary',
    copyright: 'CarPIQ — Independent European car comparison platform',
    no_ads: 'No advertising, no commercial partnerships, no commissions.',
  },
};

export default en;

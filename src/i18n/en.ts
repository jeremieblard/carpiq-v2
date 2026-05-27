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

  // ───────────────────────────────────────────────────────────────────────────
  // HOME
  // ───────────────────────────────────────────────────────────────────────────
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
        description:
          'Understand the real cost of your current car today',
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
        description:
          'The car that fits you, with its real monthly cost',
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
        description:
          '7 countries analysed, tax included, real market prices',
      },
    },

    methodology_preview: {
      section_title: 'Our methodology',
      preview:
        'The monthly cost of a car includes depreciation, fuel, insurance, tax and maintenance. CarPIQ calculates each of these items based on your profile and compares 500+ European models across 7 countries.',
      link: 'Discover the full methodology',
    },
  },

  // ───────────────────────────────────────────────────────────────────────────
  // TOKENS
  // ───────────────────────────────────────────────────────────────────────────
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

  // ───────────────────────────────────────────────────────────────────────────
  // COMPONENTS
  // ───────────────────────────────────────────────────────────────────────────
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

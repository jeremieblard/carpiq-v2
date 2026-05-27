/**
 * Dictionnaire anglais — doit matcher fr.ts structurellement.
 *
 * Si une clé manque par rapport à fr.ts, le helper `useT` fallback sur fr.
 * TypeScript ne contraint pas la structure (parce que `fr` est `as const`),
 * mais cohérence à vérifier manuellement.
 *
 * Note traductions : pour l'instant je traduis tout en EN moi-même. À terme,
 * spec section 4.5 dit qu'on devra passer par un traducteur professionnel
 * pour les pages méthodologie et institutionnelles.
 */

import type { Dictionary } from './index';

const en: Dictionary = {
  common: {
    site_name: 'CarPIQ',
    tagline: 'Independent European car comparison platform',
    skip_to_content: 'Skip to main content',
  },

  meta: {
    home_description:
      'CarPIQ helps you choose the car that truly fits your driving habits and budget, with no advertising or commercial partnerships.',
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
    title: 'CarPIQ V2',
    subtitle: 'Welcome to version 2 — under construction.',
    cta_explore: 'Explore components',
    cta_tokens: 'View design tokens',
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
    section_button_desc: '3 variants × 3 sizes + disabled / loading states + icons.',
    section_input: 'Input',
    section_input_desc: 'Text or select field with label, help and error state.',
    section_badge: 'Badge',
    section_badge_desc: '6 semantic variants × 2 sizes. Optional icon.',
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
    card_elevated_desc: 'Stronger shadow. Prominent cards (hero, results).',
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

/**
 * Dictionnaire français — source de vérité du type Dictionary.
 *
 * Conventions :
 *   - Clés en camelCase ou kebab-case selon contexte
 *   - Organisation par scope (common, nav, home, footer, etc.)
 *   - Pour les pluriels, expliciter avec _one / _other plus tard si nécessaire
 *   - Pas d'interpolation `{var}` pour l'instant — à ajouter si besoin via une
 *     fonction `tWithParams(key, params)` dans index.ts
 */

const fr = {
  common: {
    site_name: 'CarPIQ',
    tagline: 'Comparateur automobile européen indépendant',
    skip_to_content: 'Aller au contenu principal',
  },

  meta: {
    home_description:
      'CarPIQ vous aide à choisir la voiture qui correspond vraiment à votre usage et à votre budget, sans publicité ni partenariat commercial.',
  },

  nav: {
    home: 'Accueil',
    methodology: 'Méthodologie',
    about: 'À propos',
    glossary: 'Glossaire',
    contact: 'Contact',
    tokens: 'Design tokens',
    components: 'Composants',
    open_menu: 'Ouvrir le menu',
    close_menu: 'Fermer le menu',
  },

  language: {
    label: 'Langue',
    current: 'Français',
    switch_to: 'Changer de langue',
    fr: 'Français',
    en: 'Anglais',
  },

  home: {
    title: 'CarPIQ V2',
    subtitle: 'Bienvenue sur la version 2 en construction.',
    cta_explore: 'Explorer les composants',
    cta_tokens: 'Voir les design tokens',
  },

  tokens: {
    title: 'Design Tokens CarPIQ V2',
    intro: 'Référence visuelle des tokens définis dans global.css',
    primary_colors: 'Couleurs primaires',
    semantic_colors: 'Couleurs sémantiques',
    typography: 'Typographie',
    typography_display: 'Display (Playfair Display)',
    typography_body: 'Body (DM Sans)',
    typography_sample_brand: 'CarPIQ',
    typography_sample_h1: 'Comparateur',
    typography_sample_h2: 'Comparateur automobile',
    typography_sample_h3: 'Quelle voiture acheter ?',
    typography_sample_body:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    buttons_prototype: 'Boutons (prototypes — refonte Phase 2)',
    button_primary_teal: 'Primaire teal',
    button_accent_amber: 'Accent amber',
    button_secondary: 'Secondaire',
    button_tertiary: 'Lien tertiaire',
    teal_label: 'Teal (primaire)',
    amber_label: 'Amber (accent)',
    back_home: "Retour à l'accueil",
  },

  components: {
    title: 'Composants atomiques',
    intro:
      'Référence visuelle des 5 composants atomiques de la Phase 2 : Button, Input, Badge, Icon, Card.',
    variants: 'Variantes',
    sizes: 'Tailles',
    states: 'États',
    with_icons: 'Avec icônes',
    full_width: 'Pleine largeur',
    paddings: 'Paddings',
    catalog: 'Catalogue',
    section_button: 'Button',
    section_button_desc: '3 variantes × 3 tailles + états disabled / loading + icônes.',
    section_input: 'Input',
    section_input_desc: 'Champ texte ou select avec label, help, error state.',
    section_badge: 'Badge',
    section_badge_desc: '6 variantes sémantiques × 2 tailles. Icône optionnelle.',
    section_icon: 'Icon',
    section_icon_desc_pre: 'Wrapper léger autour de lucide-vue-next.',
    section_icon_desc_post: 'icônes mappées.',
    section_card: 'Card',
    section_card_desc: '3 variantes × 4 paddings. Composant statique.',
    button_primary: 'Primaire',
    button_secondary: 'Secondaire',
    button_ghost: 'Ghost',
    button_small: 'Small',
    button_medium: 'Medium (défaut)',
    button_large: 'Large',
    button_normal: 'Normal',
    button_disabled: 'Désactivé',
    button_loading: 'Chargement…',
    button_next: 'Suivant',
    button_prev: 'Précédent',
    button_validate: 'Valider',
    button_close: 'Fermer',
    button_fullwidth: 'Bouton pleine largeur',
    input_email_label: 'Adresse email',
    input_email_help: 'Nous ne partagerons jamais votre email.',
    input_budget_label: 'Budget mensuel (€)',
    input_budget_help: 'Mensualité maximale acceptable.',
    input_country_label: 'Pays',
    input_country_placeholder: '— Sélectionnez —',
    input_email_error: "Format d'email invalide.",
    input_disabled_label: 'Champ désactivé',
    input_disabled_value: 'Valeur figée',
    input_ref_label: 'Référence',
    input_ref_help: 'Lecture seule.',
    badge_default: 'Default',
    badge_recommended: 'Recommandé',
    badge_new: 'Nouveau',
    badge_validated: 'Validé',
    badge_warning: 'Attention',
    badge_error: 'Erreur',
    badge_small: 'Small',
    badge_medium: 'Medium',
    badge_electric: 'Électrique',
    badge_petrol: 'Essence',
    badge_verified: 'Vérifié',
    badge_info: 'Info',
    card_default_title: 'Default',
    card_default_desc: 'Bordure légère + ombre subtile. Usage courant.',
    card_elevated_title: 'Elevated',
    card_elevated_desc: 'Ombre plus marquée. Cards prominentes (hero, résultat).',
    card_outlined_title: 'Outlined',
    card_outlined_desc: "Bordure seule, pas d'ombre. Plus discret.",
    card_padding_none: 'padding="none"',
    card_padding_sm: 'padding="sm" (16px)',
    card_padding_md: 'padding="md" (24px, défaut)',
    card_padding_lg: 'padding="lg" (32px)',
    footer_label: 'CarPIQ V2 — Composants atomiques',
  },

  countries: {
    fr: 'France',
    be: 'Belgique',
    ch: 'Suisse',
    de: 'Allemagne',
    nl: 'Pays-Bas',
    it: 'Italie',
    es: 'Espagne',
  },

  footer: {
    methodology: 'Méthodologie',
    about: 'À propos',
    contact: 'Contact',
    legal: 'Mentions légales',
    privacy: 'Confidentialité',
    glossary: 'Glossaire',
    copyright: 'CarPIQ — Comparateur automobile européen indépendant',
    no_ads:
      'Aucune publicité, aucun partenariat commercial, aucune commission.',
  },
};

export default fr;

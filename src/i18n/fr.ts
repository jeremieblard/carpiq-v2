/**
 * Dictionnaire français — source de vérité du type Dictionary.
 *
 * Conventions :
 *   - Clés en camelCase ou snake_case selon contexte
 *   - Organisation par scope (common, nav, home, footer, etc.)
 *   - Contenu home conforme à la spec annexe A section 1.5
 */

const fr = {
  common: {
    site_name: 'CarPIQ',
    tagline: 'Comparateur automobile européen indépendant',
    skip_to_content: 'Aller au contenu principal',
  },

  meta: {
    home_title: 'CarPIQ : comparateur automobile européen indépendant',
    home_description:
      "Calculez le coût mensuel réel d'une voiture en 3 minutes. Méthodologie transparente, sans publicité, sans biais commercial. 7 pays européens.",
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

  // ───────────────────────────────────────────────────────────────────────────
  // HOME (spec annexe A section 1.5)
  // ───────────────────────────────────────────────────────────────────────────
  home: {
    hero: {
      title: 'Quelle voiture acheter, et combien va-t-elle vraiment coûter ?',
      subtitle:
        "3 minutes. Calcul personnalisé selon vos trajets et l'âge du véhicule.",
      image_alt:
        "Vue panoramique d'une route européenne avec des voitures, illustrant le choix automobile",
    },

    ctas: {
      question: 'Que souhaitez-vous faire ?',
      find: {
        title: 'Trouver ma future voiture',
        description:
          'Analyse personnalisée selon votre budget et vos besoins',
        duration: '~3 minutes',
        button: 'Commencer',
        image_alt:
          "Illustration d'un showroom automobile avec plusieurs modèles à comparer",
      },
      analyze: {
        title: 'Analyser ma voiture actuelle',
        description:
          "Comprenez le vrai coût de votre voiture aujourd'hui",
        duration: '~2 minutes',
        button: 'Commencer',
        image_alt:
          "Illustration d'une voiture analysée avec des données financières affichées",
      },
      hesitating: 'Je ne sais pas par où commencer → Guide-moi',
    },

    process: {
      section_title: 'Comment ça marche',
      step_1: {
        title: 'Vos critères',
        description:
          'Quelques questions sur votre budget, vos trajets, vos préférences',
      },
      step_2: {
        title: 'Notre analyse',
        description:
          'Méthodologie rigoureuse appliquée à 500+ modèles européens',
      },
      step_3: {
        title: 'Votre recommandation',
        description:
          'La voiture qui vous correspond, avec son vrai coût mensuel',
      },
    },

    values: {
      section_title: 'Pourquoi CarPIQ',
      independent: {
        title: 'Indépendant et neutre',
        description:
          'Aucune publicité, aucun lien commercial avec les constructeurs',
      },
      transparent: {
        title: 'Méthodologie transparente',
        description:
          'Sources de données ouvertes, calculs vérifiables, hypothèses explicites',
      },
      european: {
        title: 'Vision européenne',
        description:
          '7 pays analysés, fiscalité incluse, prix réels du marché',
      },
    },

    methodology_preview: {
      section_title: 'Notre méthodologie',
      preview:
        "Le coût mensuel d'une voiture intègre la dépréciation, le carburant, l'assurance, la taxe et l'entretien. CarPIQ calcule chacun de ces postes selon votre profil et compare 500+ modèles européens dans 7 pays.",
      link: 'Découvrir la méthodologie complète',
    },
  },

  // ───────────────────────────────────────────────────────────────────────────
  // TOKENS (page /tokens)
  // ───────────────────────────────────────────────────────────────────────────
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

  // ───────────────────────────────────────────────────────────────────────────
  // COMPONENTS (page /components)
  // ───────────────────────────────────────────────────────────────────────────
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
    section_button_desc:
      '3 variantes × 3 tailles + états disabled / loading + icônes.',
    section_input: 'Input',
    section_input_desc:
      'Champ texte ou select avec label, help, error state.',
    section_badge: 'Badge',
    section_badge_desc:
      '6 variantes sémantiques × 2 tailles. Icône optionnelle.',
    section_icon: 'Icon',
    section_icon_desc_pre: 'Wrapper léger autour de lucide-vue-next.',
    section_icon_desc_post: 'icônes mappées.',
    section_card: 'Card',
    section_card_desc:
      '3 variantes × 4 paddings. Composant statique.',
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
    card_elevated_desc:
      'Ombre plus marquée. Cards prominentes (hero, résultat).',
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

/**
 * Dictionnaire français — source de vérité du type Dictionary.
 *
 * Conventions :
 *   - Clés en camelCase ou snake_case selon contexte
 *   - Organisation par scope (common, nav, home, methodology, about, etc.)
 *   - Contenu conforme à la spec annexe A sections 1-5
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
    methodology_title:
      'Méthodologie CarPIQ : comment nous calculons le TCO automobile',
    methodology_description:
      'Découvrez notre méthodologie transparente : sources de données, algorithmes TCO, validation académique IMD. Approche rigoureuse pour des décisions éclairées.',
    about_title: 'À propos de CarPIQ : qui sommes-nous',
    about_description:
      "Découvrez l'histoire et l'équipe derrière CarPIQ, le comparateur automobile européen indépendant. Vision, valeurs, fondateur.",
    contact_title: 'Contact CarPIQ',
    contact_description:
      "Contactez l'équipe CarPIQ : support utilisateur, presse, partenariats. Réponse sous 48 heures ouvrées.",
    legal_title: 'Mentions légales et confidentialité | CarPIQ',
    legal_description:
      'Mentions légales, politique de confidentialité, conditions générales et gestion des cookies CarPIQ.',
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
  // HOME (Livrable 3)
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
        description: "Comprenez le vrai coût de votre voiture aujourd'hui",
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
        description: '7 pays analysés, fiscalité incluse, prix réels du marché',
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
  // METHODOLOGY (spec annexe A section 2.5)
  // ───────────────────────────────────────────────────────────────────────────
  methodology: {
    hero: {
      title: 'Notre méthodologie : la rigueur au service de votre décision',
      subtitle:
        "Comprenez comment CarPIQ calcule le vrai coût d'une voiture. Sources, algorithmes et validations transparentes.",
    },
    approach: {
      section_title: 'Notre approche',
      principle_1: {
        title: 'Données primaires uniquement',
        description:
          "Pas de moyennes industrielles. Chaque chiffre vient d'une source vérifiable : constructeurs, ADAC, Spritmonitor, autorités fiscales nationales.",
      },
      principle_2: {
        title: 'Méthodologie publique',
        description:
          'Tous nos calculs sont documentés et reproductibles. Vous pouvez challenger nos hypothèses et nos sources.',
      },
      principle_3: {
        title: 'Neutralité commerciale',
        description:
          "Aucune publicité, aucun lien d'affiliation, aucun biais en faveur d'un constructeur ou d'un type de motorisation.",
      },
    },
    sources: {
      section_title: 'Sources de données',
      intro:
        "CarPIQ s'appuie sur des sources primaires européennes, vérifiables et régulièrement mises à jour.",
      price_label: "Prix d'achat",
      price_desc:
        'Constructeurs (catalogues officiels), DAT (Allemagne), L’Argus (France)',
      consumption_label: 'Consommation réelle',
      consumption_desc:
        'Spritmonitor.de (3M utilisateurs européens)',
      maintenance_label: "Coûts d'entretien",
      maintenance_desc: 'ADAC Cost Calculator (référence européenne)',
      depreciation_label: 'Dépréciation',
      depreciation_desc:
        'Données de revente certifiées par marché national',
      tax_label: 'Fiscalité',
      tax_desc: 'Autorités fiscales nationales (7 pays)',
    },
    algorithms: {
      section_title: 'Algorithmes TCO',
      intro:
        'Le Coût Total de Possession (TCO) intègre 6 composantes principales. Cliquez sur chacune pour comprendre notre méthodologie.',
      price_title: "Prix d'achat",
      price_body:
        'Prix catalogue constructeur officiel par pays et configuration. Mise à jour mensuelle. Inclus options de série, exclus options optionnelles.',
      depreciation_title: 'Dépréciation',
      depreciation_body:
        'Modélisation par courbe à 5 paliers (1, 2, 5, 7, 10 ans) basée sur les données de revente certifiées. Spécifique à chaque modèle et chaque marché national.',
      fuel_title: 'Carburant ou énergie',
      fuel_body:
        'Consommation Spritmonitor (réelle utilisateurs) plutôt que WLTP (théorique). Prix énergétiques moyens annuels par pays. Modulation selon profil de trajet.',
      maintenance_title: 'Entretien et réparations',
      maintenance_body:
        'Coûts ADAC par marque et catégorie de véhicule. Modulation selon âge et kilométrage cumulé.',
      insurance_title: 'Assurance',
      insurance_body:
        'Estimation par catégorie de risque, segment, et profil utilisateur. Sources : Allianz, AXA, données nationales.',
      tax_title: 'Fiscalité',
      tax_body:
        'Calcul national pour chaque pays cible : malus, taxes annuelles, déductibilité professionnelle si applicable.',
    },
    academic: {
      section_title: 'Validation académique',
      paragraph_1:
        'Notre méthodologie est en cours de validation académique avec l’IMD Lausanne dans le cadre d’un partenariat de recherche financé par Innosuisse.',
      paragraph_2:
        'Le white paper méthodologique sera publié prochainement. Il détaille nos hypothèses, sources, algorithmes et limitations.',
      cta_label: 'Télécharger le white paper',
      cta_unavailable: 'Disponible prochainement',
    },
    cta_section: {
      see_sources: 'Voir les sources détaillées',
      start_analysis: 'Commencer une analyse',
    },
  },

  // ───────────────────────────────────────────────────────────────────────────
  // ABOUT (spec annexe A section 3.4)
  // ───────────────────────────────────────────────────────────────────────────
  about: {
    hero: {
      title: 'L’équipe derrière CarPIQ',
      subtitle:
        'CarPIQ existe pour rendre les décisions automobiles plus éclairées, plus rationnelles, et plus alignées avec les besoins réels des conducteurs européens.',
    },
    mission: {
      section_title: 'Notre mission',
      paragraph_1:
        'CarPIQ existe pour rendre les décisions automobiles plus éclairées, plus rationnelles, et plus alignées avec les besoins réels des conducteurs européens.',
      paragraph_2:
        'Notre conviction : les comparateurs automobiles actuels servent les intérêts commerciaux plutôt que ceux des acheteurs. CarPIQ change cela.',
    },
    founder: {
      section_title: 'Le fondateur',
      name: 'Jérémie Blard',
      title: 'Fondateur de CarPIQ',
      bio: "Jérémie a 17 ans d'expérience industrielle dans des fonctions techniques et stratégiques. Diplômé du IMD Lausanne (Strategy & Digital Acceleration, mention exceptionnelle, 2026) et certifié PMP, il a lancé CarPIQ en 2026 pour répondre à une question qui le frustrait personnellement : comment vraiment choisir une voiture en Europe ?",
      commitment:
        "CarPIQ est un projet à temps plein dirigé personnellement par Jérémie. Pas d'équipe marketing, pas d'investisseurs avec agenda commercial. Juste une obsession : la rigueur méthodologique au service de l'utilisateur.",
      photo_placeholder_alt: 'Photo de profil (à venir)',
      linkedin_label: 'Profil LinkedIn',
    },
    history: {
      section_title: 'Notre histoire',
      milestone_2025: 'Idée initiale, recherche méthodologique',
      milestone_2026_01: 'Diplôme IMD CAS, début du développement',
      milestone_2026_06: 'Lancement public CarPIQ',
      milestone_2026_09: 'Partenariat académique IMD',
      milestone_2027: 'Vision européenne complète',
    },
    values: {
      section_title: 'Nos valeurs',
      independence_title: 'Indépendance',
      independence_desc:
        'Aucune publicité. Aucun partenariat commercial influençant nos analyses.',
      transparency_title: 'Transparence',
      transparency_desc:
        'Méthodologie publique. Sources vérifiables. Limitations assumées.',
      rigor_title: 'Rigueur',
      rigor_desc:
        'Validation académique. Mise à jour continue des données. Itération basée sur les retours.',
      european_title: 'Européanité',
      european_desc:
        '7 pays analysés. Vision européenne authentique, pas un produit français traduit.',
    },
    contact_cta: {
      section_title: 'Contact et collaboration',
      intro:
        'Vous êtes journaliste, chercheur, partenaire potentiel ?',
      press: 'Contact presse',
      general: 'Contact général',
      partnerships: 'Partenariats',
    },
  },

  // ───────────────────────────────────────────────────────────────────────────
  // CONTACT (spec annexe A section 4.4)
  // ───────────────────────────────────────────────────────────────────────────
  contact: {
    hero: {
      title: 'Contact',
      subtitle:
        'Une question, une suggestion, un sujet à explorer ? Nous lisons et répondons à tous les messages.',
    },
    topics: {
      section_title: 'Comment pouvons-nous aider ?',
      support_title: 'Support utilisateur',
      support_desc: 'Une question sur une analyse ? Un bug rencontré ?',
      press_title: 'Presse et médias',
      press_desc: 'Interview, communiqué, données pour article',
      partnerships_title: 'Partenariats',
      partnerships_desc: 'Collaboration commerciale ou académique',
    },
    section_form: 'Envoyez-nous un message',
    field_name: 'Votre nom',
    placeholder_name: 'Jean Dupont',
    field_email: 'Votre email',
    field_topic: 'Catégorie',
    field_subject: 'Sujet',
    placeholder_subject: 'En quelques mots…',
    field_message: 'Votre message',
    placeholder_message: 'Détaillez votre demande (minimum 50 caractères)…',
    help_message: '50 caractères minimum, 5000 maximum.',
    topic_support: 'Support utilisateur',
    topic_press: 'Presse et médias',
    topic_partnerships: 'Partenariats',
    error_name: 'Veuillez saisir votre nom (2 caractères minimum).',
    error_email: 'Veuillez saisir une adresse email valide.',
    error_subject: 'Le sujet doit faire au moins 3 caractères.',
    error_message_short: 'Votre message doit faire au moins 50 caractères.',
    error_send:
      "Une erreur est survenue lors de l'envoi. Merci de réessayer dans quelques instants.",
    error_network: 'Erreur réseau. Merci de vérifier votre connexion.',
    error_title: 'Envoi impossible',
    success_title: 'Message envoyé',
    success_message:
      "Merci de votre message. Nous vous répondrons sous 48 heures ouvrées.",
    submit: 'Envoyer le message',
    submit_loading: 'Envoi en cours…',
    gdpr_notice:
      'En envoyant ce formulaire, vous acceptez que CarPIQ traite vos données dans le seul but de vous répondre. Aucun usage marketing, aucune revente.',
    coordinates: {
      section_title: 'Coordonnées',
      email_general: 'Email général',
      email_press: 'Presse',
      email_partnerships: 'Partenariats',
      response_label: 'Délai de réponse',
      response_value: 'Sous 48 heures ouvrées en moyenne',
      location_label: 'Localisation',
      location_value: 'Suisse (Région lémanique)',
    },
  },

  // ───────────────────────────────────────────────────────────────────────────
  // LEGAL (spec annexe A section 5.3 — contenu RGPD/CGU générique)
  // ───────────────────────────────────────────────────────────────────────────
  legal: {
    hero: {
      title: 'Mentions légales et confidentialité',
      subtitle:
        'Informations légales, politique de confidentialité, conditions générales et gestion des cookies.',
    },
    nav: {
      mentions: 'Mentions légales',
      privacy: 'Confidentialité',
      cgu: "Conditions d'utilisation",
      cookies: 'Cookies',
    },
    mentions: {
      section_title: 'Mentions légales',
      editor_title: "Éditeur du site",
      editor_body:
        "Le site CarPIQ est édité par Jérémie Blard, fondateur, situé en Suisse (Région lémanique). Contact : contact@carpiq.eu.",
      hosting_title: 'Hébergement',
      hosting_body:
        "Le site est hébergé par Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, USA. Plus d'informations sur vercel.com.",
      ip_title: 'Propriété intellectuelle',
      ip_body:
        "L'ensemble du contenu du site (textes, méthodologie, illustrations, code source) est protégé par le droit d'auteur. Toute reproduction sans autorisation est interdite.",
    },
    privacy: {
      section_title: 'Politique de confidentialité',
      intro:
        "CarPIQ respecte le Règlement Général sur la Protection des Données (RGPD) et la loi suisse sur la protection des données. Nous collectons uniquement les données strictement nécessaires au fonctionnement du service.",
      data_collected_title: 'Données collectées',
      data_collected_body:
        "Lorsque vous utilisez CarPIQ, nous collectons : (1) les réponses que vous fournissez aux questionnaires (budget, kilométrage, etc.) — uniquement stockées dans votre navigateur, jamais sur nos serveurs sans votre consentement ; (2) votre adresse email si vous créez un compte ; (3) des statistiques anonymes de navigation (pages visitées, durée).",
      no_sale_title: 'Pas de vente de données',
      no_sale_body:
        'CarPIQ ne vend, ne loue, ni ne partage vos données personnelles à des tiers à des fins commerciales. Aucune publicité ciblée. Aucun retargeting.',
      rights_title: 'Vos droits',
      rights_body:
        "Conformément au RGPD, vous disposez d'un droit d'accès, de rectification, d'effacement, de limitation, de portabilité et d'opposition concernant vos données personnelles. Pour exercer ces droits : contact@carpiq.eu.",
      retention_title: 'Durée de conservation',
      retention_body:
        "Les messages envoyés via le formulaire de contact sont conservés au maximum 24 mois. Les comptes utilisateurs inactifs sont supprimés après 36 mois sans connexion.",
    },
    cgu: {
      section_title: "Conditions générales d'utilisation",
      intro:
        "L'utilisation de CarPIQ est gratuite et soumise aux conditions ci-dessous. En accédant au site, vous acceptez ces conditions.",
      service_title: 'Nature du service',
      service_body:
        "CarPIQ fournit une estimation du coût total de possession (TCO) d'un véhicule à titre indicatif. Les résultats sont basés sur des sources publiques et des hypothèses explicitées dans la méthodologie. Ils ne constituent pas un conseil financier ou d'achat personnalisé.",
      liability_title: 'Limitation de responsabilité',
      liability_body:
        "CarPIQ ne peut être tenu responsable de décisions d'achat prises sur la base des analyses fournies. Les prix, taxes et coûts évoluent : il appartient à l'utilisateur de vérifier les données auprès des sources primaires avant tout engagement financier.",
      conduct_title: 'Conduite acceptable',
      conduct_body:
        "L'accès automatisé (scraping, bots) au site est interdit sans autorisation préalable. Les tentatives de surcharge, d'intrusion ou de détournement entraîneront un blocage immédiat.",
    },
    cookies: {
      section_title: 'Politique cookies',
      intro:
        "CarPIQ utilise un nombre limité de cookies pour assurer le fonctionnement du site et mesurer son usage de manière anonyme.",
      essential_title: 'Cookies essentiels',
      essential_body:
        "Ces cookies sont nécessaires au fonctionnement du site (préférence de langue, persistance de session). Ils ne peuvent pas être désactivés.",
      analytics_title: 'Cookies analytiques (optionnels)',
      analytics_body:
        "Avec votre consentement, nous utilisons Plausible Analytics et Mixpanel pour comprendre comment le site est utilisé (pages populaires, taux de complétion). Ces outils n'utilisent pas d'identifiants personnels et ne suivent pas vos activités sur d'autres sites.",
      optout_title: 'Refus et retrait du consentement',
      optout_body:
        "Vous pouvez à tout moment refuser ou retirer votre consentement aux cookies analytiques via les paramètres de votre navigateur ou en nous contactant : contact@carpiq.eu.",
    },
    last_updated: 'Dernière mise à jour : ',
  },

  // ───────────────────────────────────────────────────────────────────────────
  // TOKENS / COMPONENTS (Livrables 1-2)
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

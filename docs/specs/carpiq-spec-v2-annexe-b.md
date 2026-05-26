# CarPIQ V2 — Annexe B : Patterns d'implémentation et composants réutilisables

**Destinataire** : développeur(s) CarPIQ
**Statut** : complément opérationnel de la spec V2 consolidée
**Version** : 1.0
**Date** : 26 mai 2026
**Périmètre** : patterns techniques pour les 6 mécanismes de divulgation progressive, composants UI standards, système de routing, gestion d'état

---

## Préambule sur l'utilisation de cette annexe

Cette annexe est destinée à être consultée pendant le développement de chaque composant ou pattern. Elle fournit du code de référence (TypeScript/Astro/React/CSS) qui peut être adapté au contexte technique final retenu par le développeur.

Les exemples de code utilisent Astro 4.x avec React 19 pour les îlots interactifs, qui est ma recommandation principale. Si Next.js est finalement choisi, les patterns restent valides avec des adaptations syntaxiques mineures.

Tous les composants suivent une convention de nommage cohérente :
- PascalCase pour les composants (ButtonPrimary, CardExpandable)
- camelCase pour les fonctions et props
- kebab-case pour les classes CSS et noms de fichiers
- SCREAMING_SNAKE_CASE pour les constantes

---

## Table des matières

1. Architecture des composants et conventions
2. Système de design tokens
3. Mécanisme 1 : Cards expandables avec accordion
4. Mécanisme 2 : Tabs et toggles
5. Mécanisme 3 : Modales et drawer panels
6. Mécanisme 4 : Tooltips et infobulles
7. Mécanisme 5 : Liens vers pages dédiées
8. Mécanisme 6 : Navigation séquentielle
9. Composants UI standards
10. Système de routing et navigation
11. Gestion d'état partagé
12. Patterns d'interaction mobile
13. Performance et optimisation

---

## 1. Architecture des composants et conventions

### 1.1 Hiérarchie des composants

CarPIQ V2 utilise une architecture à 3 niveaux pour organiser les composants.

**Niveau 1 — Composants atomiques** : éléments UI de base réutilisables sur toutes les pages. Boutons, inputs, badges, icônes. Aucune logique métier, juste de la présentation.

**Niveau 2 — Composants composés** : assemblages de composants atomiques avec une logique métier limitée. Cards de véhicules, sliders de budget, formulaires d'étape. Réutilisables mais avec un contexte d'usage spécifique.

**Niveau 3 — Composants de page** : composants spécifiques à une page particulière. Hero de page d'accueil, page de résultats personnalisés. Utilisent les composants atomiques et composés mais ne sont pas eux-mêmes réutilisables.

### 1.2 Structure de dossiers recommandée

```
src/
├── components/
│   ├── atoms/                    # Niveau 1 - Atomiques
│   │   ├── Button.astro
│   │   ├── Badge.astro
│   │   ├── Icon.astro
│   │   ├── Input.astro
│   │   └── ...
│   ├── molecules/                # Niveau 2 - Composés
│   │   ├── CardExpandable.astro
│   │   ├── Modal.astro
│   │   ├── Tooltip.astro
│   │   ├── ProgressBar.astro
│   │   └── ...
│   ├── organisms/                # Niveau 2 - Composés complexes
│   │   ├── SiteHeader.astro
│   │   ├── SiteFooter.astro
│   │   ├── HeroSection.astro
│   │   ├── VehicleCard.astro
│   │   └── ...
│   ├── interactive/              # Composants React/Vue (îlots)
│   │   ├── BudgetSlider.tsx
│   │   ├── ComparisonView.tsx
│   │   ├── QuestionnaireFlow.tsx
│   │   └── ...
│   └── pages/                    # Niveau 3 - Spécifiques page
│       ├── HomeHero.astro
│       ├── ResultsHero.astro
│       └── ...
├── layouts/
│   ├── BaseLayout.astro
│   ├── PageLayout.astro
│   └── FunnelLayout.astro
├── pages/
│   ├── fr/
│   ├── en/
│   └── ...
├── lib/
│   ├── utils.ts
│   ├── api.ts
│   ├── tracking.ts
│   └── ...
└── styles/
    ├── tokens.css
    ├── global.css
    └── ...
```

### 1.3 Convention de props

Tous les composants suivent une convention de props cohérente.

**Props obligatoires en premier** : les props critiques au fonctionnement du composant sont listées en premier.

**Props optionnelles avec valeurs par défaut** : toujours fournir des valeurs par défaut sensées plutôt que de forcer le composant utilisateur à les définir.

**Props de personnalisation visuelle** : `variant`, `size`, `tone` pour adapter l'apparence. Variants standards : "primary", "secondary", "ghost", "danger".

**Props d'accessibilité** : `aria-label`, `role`, etc. systématiquement supportées.

**Exemple type** :

```typescript
interface ButtonProps {
  // Props obligatoires
  label: string;
  onClick: () => void;

  // Props avec défauts
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  icon?: 'arrow-right' | 'arrow-left' | 'check' | 'close';

  // Props d'accessibilité
  ariaLabel?: string;

  // Props de personnalisation avancée
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  label,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  ariaLabel,
  className = '',
}) => {
  // ... implémentation
};
```

---

## 2. Système de design tokens

### 2.1 Tokens CSS variables

Tous les tokens sont définis comme variables CSS dans `tokens.css` puis consommés par les composants. Cela permet une modification centralisée et une cohérence garantie.

```css
:root {
  /* === COULEURS PRIMAIRES === */
  --color-teal: #0F4C4A;
  --color-teal-light: #1F6B68;
  --color-teal-dark: #083130;
  --color-cream: #F5F1E8;
  --color-cream-light: #FAFAF7;
  --color-amber: #D4A574;
  --color-amber-light: #E5BC8D;
  --color-slate: #4A5568;

  /* === COULEURS SÉMANTIQUES === */
  --color-primary: var(--color-teal);
  --color-primary-hover: var(--color-teal-dark);
  --color-accent: var(--color-amber);
  --color-text-primary: var(--color-teal-dark);
  --color-text-secondary: var(--color-slate);
  --color-text-muted: #94A3B8;
  --color-bg-primary: var(--color-cream-light);
  --color-bg-secondary: var(--color-cream);
  --color-border: #E2E8F0;
  --color-success: #10B981;
  --color-warning: #F59E0B;
  --color-error: #EF4444;

  /* === TYPOGRAPHIE === */
  --font-serif: 'Playfair Display', Georgia, serif;
  --font-sans: 'DM Sans', system-ui, -apple-system, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;

  --text-xs: 12px;
  --text-sm: 14px;
  --text-base: 16px;
  --text-lg: 18px;
  --text-xl: 20px;
  --text-2xl: 24px;
  --text-3xl: 30px;
  --text-4xl: 36px;
  --text-5xl: 48px;

  --leading-tight: 1.2;
  --leading-normal: 1.5;
  --leading-relaxed: 1.7;

  --weight-light: 300;
  --weight-regular: 400;
  --weight-medium: 500;
  --weight-semibold: 600;
  --weight-bold: 700;

  /* === ESPACEMENTS === */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;
  --space-10: 40px;
  --space-12: 48px;
  --space-16: 64px;
  --space-20: 80px;
  --space-24: 96px;

  /* === BORDER RADIUS === */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --radius-2xl: 24px;
  --radius-full: 9999px;

  /* === SHADOWS === */
  --shadow-sm: 0 1px 2px rgba(15, 76, 74, 0.05);
  --shadow-md: 0 4px 6px rgba(15, 76, 74, 0.08);
  --shadow-lg: 0 10px 15px rgba(15, 76, 74, 0.10);
  --shadow-xl: 0 20px 25px rgba(15, 76, 74, 0.12);
  --shadow-2xl: 0 25px 50px rgba(15, 76, 74, 0.15);

  /* === TRANSITIONS === */
  --transition-fast: 150ms ease;
  --transition-base: 250ms ease;
  --transition-slow: 400ms ease;
  --transition-bouncy: 350ms cubic-bezier(0.34, 1.56, 0.64, 1);

  /* === Z-INDEX === */
  --z-base: 1;
  --z-dropdown: 10;
  --z-sticky: 20;
  --z-modal-backdrop: 40;
  --z-modal: 50;
  --z-toast: 60;
  --z-tooltip: 70;

  /* === BREAKPOINTS === */
  --bp-sm: 640px;
  --bp-md: 768px;
  --bp-lg: 1024px;
  --bp-xl: 1280px;
  --bp-2xl: 1536px;

  /* === LAYOUT === */
  --container-sm: 640px;
  --container-md: 768px;
  --container-lg: 1024px;
  --container-xl: 1280px;
  --container-2xl: 1440px;
  --container-content: 720px;
  --container-reading: 680px;
}

/* Dark mode optionnel pour V2.1 */
@media (prefers-color-scheme: dark) {
  :root {
    /* Définitions sombres si dark mode activé */
  }
}
```

### 2.2 Usage des tokens dans les composants

```css
/* Bon usage : utilise systématiquement les tokens */
.button-primary {
  background-color: var(--color-primary);
  color: var(--color-cream-light);
  padding: var(--space-3) var(--space-6);
  font-family: var(--font-sans);
  font-size: var(--text-base);
  font-weight: var(--weight-medium);
  border-radius: var(--radius-md);
  transition: background-color var(--transition-fast);
}

.button-primary:hover {
  background-color: var(--color-primary-hover);
}

/* Mauvais usage : valeurs hardcodées qui rompent la cohérence */
.button-primary {
  background-color: #0F4C4A;        /* ❌ */
  padding: 12px 24px;                /* ❌ */
  border-radius: 8px;                /* ❌ */
}
```

---

## 3. Mécanisme 1 : Cards expandables avec accordion

### 3.1 Pattern et usage

Les cards expandables sont utilisées pour les sections optionnelles que l'utilisateur peut choisir d'approfondir. Exemples : "Pourquoi cette question ?", "Détail du TCO", "Méthodologie appliquée".

### 3.2 Implémentation Astro avec hydration React

```typescript
// src/components/molecules/CardExpandable.tsx
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface CardExpandableProps {
  title: string;
  defaultOpen?: boolean;
  variant?: 'default' | 'compact' | 'highlighted';
  children: React.ReactNode;
  onToggle?: (isOpen: boolean) => void;
}

export const CardExpandable: React.FC<CardExpandableProps> = ({
  title,
  defaultOpen = false,
  variant = 'default',
  children,
  onToggle,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const handleToggle = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    onToggle?.(newState);
  };

  return (
    <div className={`card-expandable card-expandable--${variant}`}>
      <button
        className="card-expandable__header"
        onClick={handleToggle}
        aria-expanded={isOpen}
        aria-controls={`content-${title.replace(/\s+/g, '-')}`}
      >
        <span className="card-expandable__title">{title}</span>
        <ChevronDown
          className={`card-expandable__icon ${isOpen ? 'card-expandable__icon--open' : ''}`}
          size={20}
        />
      </button>
      <div
        id={`content-${title.replace(/\s+/g, '-')}`}
        className={`card-expandable__content ${isOpen ? 'card-expandable__content--open' : ''}`}
      >
        <div className="card-expandable__inner">
          {children}
        </div>
      </div>
    </div>
  );
};
```

### 3.3 CSS associé

```css
.card-expandable {
  background-color: var(--color-bg-primary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  margin-bottom: var(--space-3);
  overflow: hidden;
  transition: border-color var(--transition-fast);
}

.card-expandable:hover {
  border-color: var(--color-teal-light);
}

.card-expandable--compact {
  margin-bottom: var(--space-2);
}

.card-expandable--highlighted {
  background-color: var(--color-bg-secondary);
  border-color: var(--color-amber);
}

.card-expandable__header {
  width: 100%;
  padding: var(--space-4) var(--space-5);
  background: none;
  border: none;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  font-family: var(--font-sans);
  font-size: var(--text-base);
  font-weight: var(--weight-medium);
  color: var(--color-text-primary);
  text-align: left;
  min-height: 48px; /* Touch target */
}

.card-expandable__title {
  flex: 1;
}

.card-expandable__icon {
  transition: transform var(--transition-base);
  color: var(--color-text-secondary);
}

.card-expandable__icon--open {
  transform: rotate(180deg);
}

.card-expandable__content {
  max-height: 0;
  overflow: hidden;
  transition: max-height var(--transition-base);
}

.card-expandable__content--open {
  max-height: 1000px; /* Valeur volontairement grande pour permettre tout contenu */
}

.card-expandable__inner {
  padding: 0 var(--space-5) var(--space-5);
  color: var(--color-text-secondary);
  line-height: var(--leading-relaxed);
}

/* Animation d'ouverture améliorée */
.card-expandable__content--open .card-expandable__inner {
  animation: fadeIn var(--transition-slow) ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-4px); }
  to { opacity: 1; transform: translateY(0); }
}
```

### 3.4 Usage dans une page

```astro
---
// Page véhicule individuelle
import { CardExpandable } from '@/components/molecules/CardExpandable';
---

<section class="vehicle-details">
  <CardExpandable
    title="Décomposition du TCO mensuel"
    defaultOpen={true}
    client:visible
  >
    <p>Le coût mensuel de CHF 487 se décompose ainsi :</p>
    <ul>
      <li>Dépréciation : 38% (CHF 185)</li>
      <li>Énergie : 22% (CHF 107)</li>
      <li>Entretien : 18% (CHF 88)</li>
      <li>Assurance : 14% (CHF 68)</li>
      <li>Fiscalité : 8% (CHF 39)</li>
    </ul>
  </CardExpandable>

  <CardExpandable
    title="Caractéristiques techniques"
    client:visible
  >
    <!-- Contenu détaillé -->
  </CardExpandable>

  <CardExpandable
    title="Méthodologie appliquée"
    variant="highlighted"
    client:visible
  >
    <!-- Contenu méthodologie -->
  </CardExpandable>
</section>
```

### 3.5 Variations possibles

**Variation 1 — Card expandable groupée (accordion exclusif)** : un seul élément ouvert à la fois dans un groupe. Utile pour les FAQ ou les sections où l'on veut limiter la confusion.

**Variation 2 — Card expandable avec preview** : affiche un aperçu de 1-2 lignes du contenu avant expansion, indique implicitement qu'il y a plus à découvrir.

**Variation 3 — Card expandable avec indicateur de longueur** : affiche "Lecture 2 min" ou "5 éléments" pour aider l'utilisateur à anticiper l'effort d'engagement.

---

## 4. Mécanisme 2 : Tabs et toggles

### 4.1 Pattern et usage

Les tabs permettent de présenter plusieurs vues alternatives du même contenu. Utilisés pour les comparaisons (vue par âge, vue par motorisation), les détails techniques structurés, les sections de la page véhicule.

### 4.2 Implémentation React

```typescript
// src/components/molecules/Tabs.tsx
import { useState } from 'react';

interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
  badge?: string;
}

interface TabsProps {
  tabs: Tab[];
  defaultActiveTab?: string;
  variant?: 'underline' | 'pills' | 'segments';
  onChange?: (activeTab: string) => void;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  defaultActiveTab,
  variant = 'underline',
  onChange,
}) => {
  const [activeTab, setActiveTab] = useState(defaultActiveTab || tabs[0]?.id);

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    onChange?.(tabId);
  };

  const activeContent = tabs.find(t => t.id === activeTab)?.content;

  return (
    <div className={`tabs tabs--${variant}`}>
      <div className="tabs__list" role="tablist">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`panel-${tab.id}`}
            id={`tab-${tab.id}`}
            className={`tabs__trigger ${activeTab === tab.id ? 'tabs__trigger--active' : ''}`}
            onClick={() => handleTabClick(tab.id)}
          >
            <span className="tabs__label">{tab.label}</span>
            {tab.badge && (
              <span className="tabs__badge">{tab.badge}</span>
            )}
          </button>
        ))}
      </div>

      <div
        className="tabs__panel"
        role="tabpanel"
        id={`panel-${activeTab}`}
        aria-labelledby={`tab-${activeTab}`}
      >
        {activeContent}
      </div>
    </div>
  );
};
```

### 4.3 CSS pour les 3 variantes

```css
.tabs {
  width: 100%;
}

.tabs__list {
  display: flex;
  gap: var(--space-1);
  margin-bottom: var(--space-6);
  overflow-x: auto;
  scrollbar-width: none;
}

.tabs__list::-webkit-scrollbar {
  display: none;
}

.tabs__trigger {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-5);
  background: none;
  border: none;
  font-family: var(--font-sans);
  font-size: var(--text-base);
  font-weight: var(--weight-medium);
  color: var(--color-text-secondary);
  cursor: pointer;
  white-space: nowrap;
  transition: all var(--transition-fast);
  min-height: 44px;
}

.tabs__trigger:hover {
  color: var(--color-text-primary);
}

/* Variante underline */
.tabs--underline .tabs__list {
  border-bottom: 1px solid var(--color-border);
}

.tabs--underline .tabs__trigger {
  position: relative;
  padding-bottom: var(--space-3);
}

.tabs--underline .tabs__trigger--active {
  color: var(--color-primary);
}

.tabs--underline .tabs__trigger--active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  right: 0;
  height: 2px;
  background-color: var(--color-primary);
  border-radius: 2px 2px 0 0;
}

/* Variante pills */
.tabs--pills .tabs__trigger {
  border-radius: var(--radius-full);
  background-color: var(--color-bg-secondary);
}

.tabs--pills .tabs__trigger--active {
  background-color: var(--color-primary);
  color: var(--color-cream-light);
}

/* Variante segments */
.tabs--segments .tabs__list {
  background-color: var(--color-bg-secondary);
  border-radius: var(--radius-md);
  padding: var(--space-1);
}

.tabs--segments .tabs__trigger {
  flex: 1;
  border-radius: var(--radius-sm);
  justify-content: center;
}

.tabs--segments .tabs__trigger--active {
  background-color: var(--color-bg-primary);
  color: var(--color-primary);
  box-shadow: var(--shadow-sm);
}

.tabs__badge {
  background-color: var(--color-amber);
  color: var(--color-teal-dark);
  font-size: var(--text-xs);
  padding: 2px var(--space-2);
  border-radius: var(--radius-full);
  font-weight: var(--weight-semibold);
}

.tabs__panel {
  animation: fadeIn var(--transition-base);
}
```

### 4.4 Usage exemple page véhicule

```astro
---
import { Tabs } from '@/components/molecules/Tabs';
---

<section class="vehicle-comparison">
  <Tabs
    variant="pills"
    defaultActiveTab="age-2"
    tabs={[
      { id: 'age-new', label: 'Neuf', content: <VehicleByAge age="new" /> },
      { id: 'age-2', label: '2 ans', content: <VehicleByAge age="2" />, badge: 'Recommandé' },
      { id: 'age-5', label: '5 ans', content: <VehicleByAge age="5" /> },
      { id: 'age-7', label: '7 ans', content: <VehicleByAge age="7" /> },
    ]}
    client:load
  />
</section>
```

---

## 5. Mécanisme 3 : Modales et drawer panels

### 5.1 Pattern et usage

Pour les contenus substantiels qui méritent une focus dédiée sans quitter le contexte. Modales sur desktop, drawers (panneau qui glisse depuis le bas) sur mobile.

### 5.2 Implémentation hybride mobile/desktop

```typescript
// src/components/molecules/Modal.tsx
import { useEffect, useState } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  children: React.ReactNode;
  showCloseButton?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  size = 'md',
  children,
  showCloseButton = true,
}) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleEscape);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className={`modal-backdrop ${isMobile ? 'modal-backdrop--mobile' : 'modal-backdrop--desktop'}`}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className={`modal modal--${size} ${isMobile ? 'modal--drawer' : 'modal--centered'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <header className="modal__header">
          <h2 id="modal-title" className="modal__title">{title}</h2>
          {showCloseButton && (
            <button
              className="modal__close"
              onClick={onClose}
              aria-label="Fermer la modale"
            >
              <X size={24} />
            </button>
          )}
        </header>

        <div className="modal__content">
          {children}
        </div>
      </div>
    </div>
  );
};
```

### 5.3 CSS pour modal desktop et drawer mobile

```css
.modal-backdrop {
  position: fixed;
  inset: 0;
  background-color: rgba(15, 76, 74, 0.5);
  z-index: var(--z-modal-backdrop);
  animation: fadeIn var(--transition-base);
}

.modal-backdrop--desktop {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-4);
}

.modal-backdrop--mobile {
  display: flex;
  align-items: flex-end;
}

.modal {
  background-color: var(--color-bg-primary);
  z-index: var(--z-modal);
  display: flex;
  flex-direction: column;
  max-height: 90vh;
}

.modal--centered {
  border-radius: var(--radius-xl);
  width: 100%;
  box-shadow: var(--shadow-2xl);
  animation: modalSlideUp var(--transition-base) cubic-bezier(0.34, 1.56, 0.64, 1);
}

.modal--centered.modal--sm { max-width: 400px; }
.modal--centered.modal--md { max-width: 600px; }
.modal--centered.modal--lg { max-width: 800px; }
.modal--centered.modal--xl { max-width: 1000px; }

.modal--drawer {
  width: 100%;
  border-top-left-radius: var(--radius-2xl);
  border-top-right-radius: var(--radius-2xl);
  max-height: 85vh;
  animation: drawerSlideUp var(--transition-base);
}

.modal__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-5);
  border-bottom: 1px solid var(--color-border);
  flex-shrink: 0;
}

.modal__title {
  font-family: var(--font-serif);
  font-size: var(--text-xl);
  font-weight: var(--weight-semibold);
  color: var(--color-text-primary);
  margin: 0;
}

.modal__close {
  background: none;
  border: none;
  cursor: pointer;
  padding: var(--space-2);
  border-radius: var(--radius-full);
  color: var(--color-text-secondary);
  transition: background-color var(--transition-fast);
  min-width: 44px;
  min-height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal__close:hover {
  background-color: var(--color-bg-secondary);
}

.modal__content {
  padding: var(--space-5);
  overflow-y: auto;
  flex: 1;
}

/* Drawer handle visuel sur mobile */
.modal--drawer::before {
  content: '';
  position: absolute;
  top: var(--space-2);
  left: 50%;
  transform: translateX(-50%);
  width: 40px;
  height: 4px;
  background-color: var(--color-border);
  border-radius: var(--radius-full);
}

@keyframes modalSlideUp {
  from { opacity: 0; transform: translateY(16px) scale(0.98); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

@keyframes drawerSlideUp {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}
```

### 5.4 Support swipe-to-close sur mobile

```typescript
// Hook personnalisé pour le swipe down
import { useEffect, useRef, useState } from 'react';

export const useSwipeToClose = (onClose: () => void) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const handleTouchStart = (e: TouchEvent) => {
      setTouchStart(e.touches[0].clientY);
      setTouchEnd(null);
    };

    const handleTouchMove = (e: TouchEvent) => {
      setTouchEnd(e.touches[0].clientY);
    };

    const handleTouchEnd = () => {
      if (!touchStart || !touchEnd) return;

      const distance = touchEnd - touchStart;
      const isSwipeDown = distance > 100;

      if (isSwipeDown) {
        onClose();
      }

      setTouchStart(null);
      setTouchEnd(null);
    };

    element.addEventListener('touchstart', handleTouchStart);
    element.addEventListener('touchmove', handleTouchMove);
    element.addEventListener('touchend', handleTouchEnd);

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [touchStart, touchEnd, onClose]);

  return elementRef;
};
```

---

## 6. Mécanisme 4 : Tooltips et infobulles

### 6.1 Pattern et usage

Pour les définitions courtes, les sources de chiffres, les précisions méthodologiques sur 1-2 phrases. Affichés au hover desktop ou tap mobile.

### 6.2 Implémentation accessible

```typescript
// src/components/molecules/Tooltip.tsx
import { useState, useRef, useEffect } from 'react';
import { Info } from 'lucide-react';

interface TooltipProps {
  content: string | React.ReactNode;
  children?: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  trigger?: 'hover' | 'click' | 'both';
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = 'top',
  trigger = 'both',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (triggerRef.current && !triggerRef.current.contains(e.target as Node)) {
        setIsVisible(false);
      }
    };

    if (isVisible) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [isVisible]);

  const handleMouseEnter = () => {
    if (trigger === 'hover' || trigger === 'both') {
      setIsVisible(true);
    }
  };

  const handleMouseLeave = () => {
    if (trigger === 'hover' || trigger === 'both') {
      setIsVisible(false);
    }
  };

  const handleClick = () => {
    if (trigger === 'click' || trigger === 'both') {
      setIsVisible(!isVisible);
    }
  };

  return (
    <span className="tooltip-wrapper">
      <button
        ref={triggerRef}
        className="tooltip-trigger"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        aria-describedby={isVisible ? 'tooltip-content' : undefined}
        aria-expanded={isVisible}
      >
        {children || <Info size={16} className="tooltip-icon" />}
      </button>

      {isVisible && (
        <span
          id="tooltip-content"
          role="tooltip"
          className={`tooltip tooltip--${position}`}
        >
          {content}
        </span>
      )}
    </span>
  );
};
```

### 6.3 CSS positionnement

```css
.tooltip-wrapper {
  display: inline-flex;
  position: relative;
  align-items: center;
}

.tooltip-trigger {
  background: none;
  border: none;
  padding: 4px;
  cursor: help;
  color: var(--color-text-secondary);
  transition: color var(--transition-fast);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 24px;
  min-height: 24px;
}

.tooltip-trigger:hover {
  color: var(--color-primary);
}

.tooltip {
  position: absolute;
  background-color: var(--color-teal-dark);
  color: var(--color-cream-light);
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  line-height: var(--leading-normal);
  max-width: 280px;
  white-space: normal;
  z-index: var(--z-tooltip);
  animation: fadeIn var(--transition-fast);
  pointer-events: none;
}

.tooltip::before {
  content: '';
  position: absolute;
  width: 0;
  height: 0;
  border-style: solid;
}

.tooltip--top {
  bottom: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%);
}

.tooltip--top::before {
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border-width: 6px 6px 0 6px;
  border-color: var(--color-teal-dark) transparent transparent transparent;
}

.tooltip--bottom {
  top: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%);
}

.tooltip--bottom::before {
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  border-width: 0 6px 6px 6px;
  border-color: transparent transparent var(--color-teal-dark) transparent;
}

/* Adaptation mobile : tooltip plus large et positionnement fixe */
@media (max-width: 768px) {
  .tooltip {
    max-width: 90vw;
    position: fixed;
    bottom: var(--space-4);
    left: var(--space-4);
    right: var(--space-4);
    transform: none;
  }

  .tooltip::before {
    display: none;
  }
}
```

### 6.4 Usage exemple

```astro
---
import { Tooltip } from '@/components/molecules/Tooltip';
---

<div class="tco-display">
  <span class="tco-label">TCO mensuel</span>
  <span class="tco-value">CHF 487</span>
  <Tooltip
    content="Coût Total de Possession : somme de la dépréciation, énergie, entretien, assurance et fiscalité, divisée par la durée de détention prévue."
    position="top"
    client:visible
  />
</div>
```

---

## 7. Mécanisme 5 : Liens vers pages dédiées

### 7.1 Pattern et usage

Pour les contenus substantiels qui méritent leur propre page indexable par Google. Pas un détail caché dans un accordion, une vraie page avec URL propre.

### 7.2 Composant LinkButton standard

```typescript
// src/components/atoms/LinkButton.tsx
import { ArrowRight, ArrowUpRight } from 'lucide-react';

interface LinkButtonProps {
  href: string;
  label: string;
  description?: string;
  variant?: 'inline' | 'card' | 'cta';
  external?: boolean;
  iconType?: 'arrow' | 'external' | 'none';
}

export const LinkButton: React.FC<LinkButtonProps> = ({
  href,
  label,
  description,
  variant = 'inline',
  external = false,
  iconType = 'arrow',
}) => {
  const IconComponent = iconType === 'external' ? ArrowUpRight : ArrowRight;

  return (
    <a
      href={href}
      className={`link-button link-button--${variant}`}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
    >
      <div className="link-button__content">
        <span className="link-button__label">{label}</span>
        {description && variant === 'card' && (
          <span className="link-button__description">{description}</span>
        )}
      </div>
      {iconType !== 'none' && (
        <IconComponent
          size={variant === 'cta' ? 20 : 16}
          className="link-button__icon"
        />
      )}
    </a>
  );
};
```

### 7.3 CSS pour les 3 variantes

```css
.link-button {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  text-decoration: none;
  transition: all var(--transition-fast);
  font-family: var(--font-sans);
}

/* Variante inline : lien textuel discret */
.link-button--inline {
  color: var(--color-primary);
  font-weight: var(--weight-medium);
  padding: 2px 0;
  border-bottom: 1px solid transparent;
}

.link-button--inline:hover {
  color: var(--color-teal-dark);
  border-bottom-color: currentColor;
}

.link-button--inline .link-button__icon {
  transition: transform var(--transition-fast);
}

.link-button--inline:hover .link-button__icon {
  transform: translateX(2px);
}

/* Variante card : lien dans une card cliquable */
.link-button--card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: var(--space-5);
  background-color: var(--color-bg-primary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  color: var(--color-text-primary);
  min-height: 100px;
}

.link-button--card:hover {
  border-color: var(--color-primary);
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.link-button--card .link-button__content {
  flex: 1;
}

.link-button--card .link-button__label {
  font-size: var(--text-lg);
  font-weight: var(--weight-semibold);
  margin-bottom: var(--space-2);
  display: block;
}

.link-button--card .link-button__description {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  line-height: var(--leading-normal);
}

.link-button--card .link-button__icon {
  align-self: flex-end;
  color: var(--color-primary);
}

/* Variante cta : bouton large d'action */
.link-button--cta {
  background-color: var(--color-primary);
  color: var(--color-cream-light);
  padding: var(--space-4) var(--space-6);
  border-radius: var(--radius-md);
  font-weight: var(--weight-medium);
  font-size: var(--text-base);
  justify-content: center;
}

.link-button--cta:hover {
  background-color: var(--color-teal-dark);
}

.link-button--cta .link-button__icon {
  transition: transform var(--transition-base);
}

.link-button--cta:hover .link-button__icon {
  transform: translateX(4px);
}
```

---

## 8. Mécanisme 6 : Navigation séquentielle

### 8.1 Pattern et usage

Pour les listes longues, chargement progressif. Permet d'afficher d'abord les premiers éléments puis charger la suite à la demande.

### 8.2 Implémentation avec pagination ou infinite scroll

```typescript
// src/components/molecules/LoadMore.tsx
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface LoadMoreProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  initialCount?: number;
  incrementCount?: number;
  loadMoreLabel?: string;
  className?: string;
}

export function LoadMore<T>({
  items,
  renderItem,
  initialCount = 5,
  incrementCount = 5,
  loadMoreLabel = 'Voir plus',
  className = '',
}: LoadMoreProps<T>) {
  const [displayCount, setDisplayCount] = useState(initialCount);

  const visibleItems = items.slice(0, displayCount);
  const hasMore = displayCount < items.length;
  const remaining = items.length - displayCount;

  const handleLoadMore = () => {
    setDisplayCount(Math.min(displayCount + incrementCount, items.length));
  };

  return (
    <div className={`load-more ${className}`}>
      <div className="load-more__items">
        {visibleItems.map((item, index) => renderItem(item, index))}
      </div>

      {hasMore && (
        <button
          className="load-more__button"
          onClick={handleLoadMore}
        >
          <span>
            {loadMoreLabel} ({remaining} de plus)
          </span>
          <ChevronDown size={20} />
        </button>
      )}
    </div>
  );
}
```

---

## 9. Composants UI standards

### 9.1 Bouton standard

```typescript
// src/components/atoms/Button.tsx
import { ReactNode } from 'react';
import { ArrowRight, Check, X, Loader } from 'lucide-react';

interface ButtonProps {
  label: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  disabled?: boolean;
  loading?: boolean;
  icon?: 'arrow' | 'check' | 'close' | ReactNode;
  iconPosition?: 'left' | 'right';
}

export const Button: React.FC<ButtonProps> = ({
  label,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'right',
}) => {
  const renderIcon = () => {
    if (loading) return <Loader size={16} className="button__icon button__icon--spinning" />;
    if (icon === 'arrow') return <ArrowRight size={16} className="button__icon" />;
    if (icon === 'check') return <Check size={16} className="button__icon" />;
    if (icon === 'close') return <X size={16} className="button__icon" />;
    return icon;
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        button
        button--${variant}
        button--${size}
        ${fullWidth ? 'button--full' : ''}
      `}
    >
      {iconPosition === 'left' && renderIcon()}
      <span className="button__label">{label}</span>
      {iconPosition === 'right' && renderIcon()}
    </button>
  );
};
```

```css
.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  border: none;
  border-radius: var(--radius-md);
  font-family: var(--font-sans);
  font-weight: var(--weight-medium);
  cursor: pointer;
  transition: all var(--transition-fast);
  min-height: 44px;
}

.button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Tailles */
.button--sm { padding: var(--space-2) var(--space-4); font-size: var(--text-sm); min-height: 36px; }
.button--md { padding: var(--space-3) var(--space-5); font-size: var(--text-base); min-height: 44px; }
.button--lg { padding: var(--space-4) var(--space-6); font-size: var(--text-lg); min-height: 52px; }

/* Variantes */
.button--primary {
  background-color: var(--color-primary);
  color: var(--color-cream-light);
}
.button--primary:hover:not(:disabled) {
  background-color: var(--color-teal-dark);
}

.button--secondary {
  background-color: var(--color-bg-secondary);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);
}
.button--secondary:hover:not(:disabled) {
  background-color: var(--color-cream);
  border-color: var(--color-primary);
}

.button--ghost {
  background-color: transparent;
  color: var(--color-text-primary);
}
.button--ghost:hover:not(:disabled) {
  background-color: var(--color-bg-secondary);
}

.button--danger {
  background-color: var(--color-error);
  color: white;
}

/* Full width */
.button--full {
  width: 100%;
}

/* Animation icône spin */
.button__icon--spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
```

### 9.2 Card véhicule standard

```typescript
// src/components/organisms/VehicleCard.tsx
interface VehicleCardProps {
  vehicle: {
    id: string;
    brand: string;
    model: string;
    variant?: string;
    image: string;
    tco_monthly: number;
    price: number;
    segment: string;
  };
  variant?: 'compact' | 'detailed' | 'comparison';
  onAddToGarage?: () => void;
  onCompare?: () => void;
}

export const VehicleCard: React.FC<VehicleCardProps> = ({
  vehicle,
  variant = 'detailed',
  onAddToGarage,
  onCompare,
}) => {
  const url = `/fr/voiture/${vehicle.brand}-${vehicle.model}-${vehicle.variant}`
    .toLowerCase()
    .replace(/\s+/g, '-');

  return (
    <article className={`vehicle-card vehicle-card--${variant}`}>
      <a href={url} className="vehicle-card__link">
        <img
          src={vehicle.image}
          alt={`${vehicle.brand} ${vehicle.model}`}
          loading="lazy"
          className="vehicle-card__image"
        />

        <div className="vehicle-card__content">
          <span className="vehicle-card__segment">{vehicle.segment}</span>
          <h3 className="vehicle-card__title">
            {vehicle.brand} {vehicle.model}
          </h3>
          {vehicle.variant && (
            <p className="vehicle-card__variant">{vehicle.variant}</p>
          )}

          <div className="vehicle-card__pricing">
            <div className="vehicle-card__tco">
              <span className="vehicle-card__tco-value">
                CHF {vehicle.tco_monthly}
              </span>
              <span className="vehicle-card__tco-label">/ mois</span>
            </div>
            <div className="vehicle-card__price">
              à partir de CHF {vehicle.price}
            </div>
          </div>
        </div>
      </a>

      {variant === 'detailed' && (
        <div className="vehicle-card__actions">
          {onAddToGarage && (
            <button
              className="vehicle-card__action"
              onClick={onAddToGarage}
              aria-label="Ajouter au garage"
            >
              🏠
            </button>
          )}
          {onCompare && (
            <button
              className="vehicle-card__action"
              onClick={onCompare}
              aria-label="Ajouter à la comparaison"
            >
              📊
            </button>
          )}
        </div>
      )}
    </article>
  );
};
```

---

## 10. Système de routing et navigation

### 10.1 Structure des routes Astro

```typescript
// src/pages/[lang]/index.astro - Page d'accueil multilangue
---
import HomeLayout from '@/layouts/HomeLayout.astro';

export async function getStaticPaths() {
  return [
    { params: { lang: 'fr' } },
    { params: { lang: 'en' } },
    { params: { lang: 'de' } },
    { params: { lang: 'nl' } },
    { params: { lang: 'es' } },
    { params: { lang: 'it' } },
    { params: { lang: 'pt' } },
  ];
}

const { lang } = Astro.params;
---

<HomeLayout lang={lang}>
  <!-- Contenu page d'accueil -->
</HomeLayout>
```

### 10.2 Routes dynamiques pour pages véhicules

```typescript
// src/pages/[lang]/voiture/[slug].astro
---
import VehiclePageLayout from '@/layouts/VehiclePageLayout.astro';
import { getVehicleBySlug, getAllVehicleSlugs } from '@/lib/vehicles';

export async function getStaticPaths() {
  const slugs = await getAllVehicleSlugs();
  const langs = ['fr', 'en', 'de', 'nl', 'es', 'it', 'pt'];

  return slugs.flatMap(slug =>
    langs.map(lang => ({
      params: { lang, slug },
      props: { slug, lang },
    }))
  );
}

const { slug, lang } = Astro.props;
const vehicle = await getVehicleBySlug(slug);
---

<VehiclePageLayout vehicle={vehicle} lang={lang}>
  <!-- Contenu page véhicule -->
</VehiclePageLayout>
```

### 10.3 Préservation de la session pendant la navigation

```typescript
// src/lib/sessionState.ts
interface SessionState {
  questionnaireAnswers: Record<string, any>;
  selectedVehicles: string[];
  preferences: {
    language: string;
    country: string;
  };
}

const SESSION_KEY = 'carpiq_session';

export const sessionState = {
  save(state: Partial<SessionState>): void {
    if (typeof window === 'undefined') return;
    const current = this.load();
    const updated = { ...current, ...state };
    localStorage.setItem(SESSION_KEY, JSON.stringify(updated));
  },

  load(): SessionState {
    if (typeof window === 'undefined') {
      return { questionnaireAnswers: {}, selectedVehicles: [], preferences: { language: 'fr', country: 'ch' } };
    }
    try {
      const data = localStorage.getItem(SESSION_KEY);
      return data ? JSON.parse(data) : { questionnaireAnswers: {}, selectedVehicles: [], preferences: { language: 'fr', country: 'ch' } };
    } catch {
      return { questionnaireAnswers: {}, selectedVehicles: [], preferences: { language: 'fr', country: 'ch' } };
    }
  },

  clear(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(SESSION_KEY);
  },
};
```

---

## 11. Gestion d'état partagé

### 11.1 Pattern recommandé : Nano stores

Pour Astro avec îlots React, les nano stores sont la solution la plus efficace pour partager l'état entre composants interactifs.

```typescript
// src/lib/stores/questionnaire.ts
import { atom, map } from 'nanostores';

export interface QuestionnaireState {
  currentStep: number;
  totalSteps: number;
  answers: {
    budget?: number;
    usage?: {
      mileage: string;
      tripType: string;
      charging: string;
    };
    segment?: string[];
    location?: {
      country: string;
      ageRange: string;
    };
  };
  isComplete: boolean;
}

export const $questionnaire = map<QuestionnaireState>({
  currentStep: 1,
  totalSteps: 5,
  answers: {},
  isComplete: false,
});

export const updateBudget = (budget: number) => {
  $questionnaire.setKey('answers', {
    ...$questionnaire.get().answers,
    budget,
  });
};

export const nextStep = () => {
  const current = $questionnaire.get().currentStep;
  $questionnaire.setKey('currentStep', current + 1);
};
```

### 11.2 Usage dans un composant React

```typescript
// src/components/interactive/BudgetSlider.tsx
import { useStore } from '@nanostores/react';
import { $questionnaire, updateBudget } from '@/lib/stores/questionnaire';

export const BudgetSlider: React.FC = () => {
  const state = useStore($questionnaire);
  const currentBudget = state.answers.budget || 25000;

  return (
    <div className="budget-slider">
      <div className="budget-slider__value">CHF {currentBudget}</div>
      <input
        type="range"
        min={8000}
        max={80000}
        step={1000}
        value={currentBudget}
        onChange={(e) => updateBudget(Number(e.target.value))}
        className="budget-slider__input"
      />
    </div>
  );
};
```

---

## 12. Patterns d'interaction mobile

### 12.1 Touch targets et zones tactiles

```css
/* Standard CarPIQ : minimum 48px pour tous éléments interactifs */
.touch-target {
  min-width: 48px;
  min-height: 48px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

/* Espacement minimum entre éléments tactiles : 8px */
.tactile-group > * + * {
  margin-left: 8px;
}

/* Zone tactile élargie pour petits éléments visuels */
.icon-button {
  position: relative;
  padding: 12px;
}

.icon-button::before {
  content: '';
  position: absolute;
  inset: -4px;
  /* Zone invisible étendue pour faciliter le tap */
}
```

### 12.2 Floating Action Button mobile

```typescript
// src/components/molecules/FloatingActionButton.tsx
interface FABProps {
  primaryAction: { label: string; onClick: () => void; icon?: React.ReactNode };
  secondaryActions?: Array<{ label: string; onClick: () => void; icon?: React.ReactNode }>;
}

export const FloatingActionButton: React.FC<FABProps> = ({
  primaryAction,
  secondaryActions,
}) => {
  return (
    <div className="fab-container">
      {secondaryActions && (
        <div className="fab-secondary-actions">
          {secondaryActions.map((action, index) => (
            <button
              key={index}
              className="fab fab--secondary"
              onClick={action.onClick}
              aria-label={action.label}
            >
              {action.icon}
            </button>
          ))}
        </div>
      )}

      <button
        className="fab fab--primary"
        onClick={primaryAction.onClick}
        aria-label={primaryAction.label}
      >
        {primaryAction.icon}
      </button>
    </div>
  );
};
```

```css
/* FAB visible uniquement sur mobile */
.fab-container {
  display: none;
}

@media (max-width: 768px) {
  .fab-container {
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
    position: fixed;
    bottom: var(--space-6);
    right: var(--space-4);
    z-index: var(--z-sticky);
  }

  .fab {
    width: 56px;
    height: 56px;
    border-radius: var(--radius-full);
    border: none;
    cursor: pointer;
    box-shadow: var(--shadow-lg);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all var(--transition-fast);
  }

  .fab--primary {
    background-color: var(--color-primary);
    color: var(--color-cream-light);
  }

  .fab--primary:hover,
  .fab--primary:active {
    background-color: var(--color-teal-dark);
    transform: scale(1.05);
  }

  .fab--secondary {
    background-color: var(--color-bg-primary);
    color: var(--color-primary);
    border: 1px solid var(--color-border);
    width: 48px;
    height: 48px;
  }
}
```

### 12.3 Bottom navigation mobile

```typescript
// src/components/organisms/MobileBottomNav.tsx
import { Home, Search, Garage, User } from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Accueil', href: '/fr/', icon: <Home size={24} /> },
  { label: 'Recherche', href: '/fr/trouver-ma-voiture', icon: <Search size={24} /> },
  { label: 'Garage', href: '/fr/garage', icon: <Garage size={24} /> },
  { label: 'Compte', href: '/fr/compte', icon: <User size={24} /> },
];

export const MobileBottomNav: React.FC<{ currentPath: string }> = ({ currentPath }) => {
  return (
    <nav className="mobile-bottom-nav" role="navigation" aria-label="Navigation principale">
      {NAV_ITEMS.map((item) => (
        <a
          key={item.href}
          href={item.href}
          className={`mobile-bottom-nav__item ${currentPath === item.href ? 'mobile-bottom-nav__item--active' : ''}`}
        >
          {item.icon}
          <span className="mobile-bottom-nav__label">{item.label}</span>
        </a>
      ))}
    </nav>
  );
};
```

---

## 13. Performance et optimisation

### 13.1 Stratégie de chargement des images

```typescript
// Composant image optimisé
interface OptimizedImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  priority?: boolean;
  sizes?: string;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  priority = false,
  sizes = '100vw',
}) => {
  return (
    <picture>
      <source
        srcSet={`${src}?format=webp&w=${width}`}
        type="image/webp"
        sizes={sizes}
      />
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        fetchPriority={priority ? 'high' : 'auto'}
      />
    </picture>
  );
};
```

### 13.2 Préchargement intelligent

```typescript
// src/lib/prefetch.ts
export const prefetchPage = (url: string) => {
  if (typeof window === 'undefined') return;

  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = url;
  document.head.appendChild(link);
};

// Usage : précharger la page suivante au hover du CTA
export const usePrefetchOnHover = (url: string) => {
  return {
    onMouseEnter: () => prefetchPage(url),
    onTouchStart: () => prefetchPage(url),
  };
};
```

### 13.3 Code splitting et hydration sélective

```astro
---
// Composants critiques : hydration immédiate
import { BudgetSlider } from '@/components/interactive/BudgetSlider';
---

<!-- Hydration au chargement -->
<BudgetSlider client:load />

<!-- Hydration au scroll proche -->
<BudgetSlider client:visible />

<!-- Hydration au idle -->
<BudgetSlider client:idle />

<!-- Hydration uniquement sur mobile -->
<MobileFAB client:media="(max-width: 768px)" />
```

---

## Conclusion de l'annexe B

Cette annexe fournit les patterns techniques et les composants réutilisables nécessaires pour implémenter CarPIQ V2 avec cohérence et qualité.

Le développeur dispose maintenant de :
- Une architecture de composants à 3 niveaux clairement définie
- Un système de design tokens complet
- Six mécanismes de divulgation progressive avec code de référence
- Des composants UI standards (boutons, cards, etc.)
- Un système de routing pour l'architecture multi-pages
- Des patterns de gestion d'état adaptés à Astro avec îlots
- Des optimisations de performance dès la conception

Les annexes C (migration code existant) et D (design system étendu) compléteront cette référence opérationnelle au moment où elles deviendront pertinentes dans le phasage du projet.

---

*Document produit le 26 mai 2026. Annexe B de la spec V2 consolidée CarPIQ. À utiliser comme référence opérationnelle pour les patterns d'implémentation et composants réutilisables.*

<script setup lang="ts">
/**
 * Icon.vue — Wrapper léger autour de lucide-vue-next.
 *
 * Source de référence : annexe B section 9 (icônes via lucide-react en spec,
 * on porte vers lucide-vue-next ici).
 *
 * Permet de passer un nom d'icône en string et de la rendre avec taille
 * et classes Tailwind, sans avoir à importer chaque icône individuellement
 * dans les composants consommateurs.
 *
 * Set d'icônes : on garde un mapping explicite des icônes utilisées dans
 * l'app (~15-20). Ajouter une nouvelle icône = ajouter une entrée dans
 * iconMap ci-dessous. Garde le bundle léger.
 */
import {
  ArrowRight,
  ArrowLeft,
  Check,
  X,
  Loader,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Menu,
  Search,
  AlertCircle,
  Info,
  HelpCircle,
  ExternalLink,
  Plus,
  Minus,
  Car,
  Euro,
  Zap,
  Fuel,
  Settings,
} from 'lucide-vue-next';
import type { Component } from 'vue';
import { computed } from 'vue';

/** Mapping des noms publics vers les composants Lucide. */
const iconMap: Record<string, Component> = {
  arrow: ArrowRight,
  'arrow-right': ArrowRight,
  'arrow-left': ArrowLeft,
  check: Check,
  close: X,
  x: X,
  loader: Loader,
  'chevron-down': ChevronDown,
  'chevron-up': ChevronUp,
  'chevron-left': ChevronLeft,
  'chevron-right': ChevronRight,
  menu: Menu,
  search: Search,
  alert: AlertCircle,
  info: Info,
  help: HelpCircle,
  external: ExternalLink,
  plus: Plus,
  minus: Minus,
  car: Car,
  euro: Euro,
  zap: Zap,
  fuel: Fuel,
  settings: Settings,
};

export type IconName = keyof typeof iconMap;

export interface IconProps {
  /** Nom de l'icône (cf. iconMap). */
  name: IconName;
  /** Taille en px (défaut 16). */
  size?: number;
  /** Classes CSS additionnelles. */
  class?: string;
  /** Couleur de trait (CSS valid, ex: 'currentColor'). Par défaut hérite du parent. */
  color?: string;
  /** Épaisseur du trait (lucide default = 2). */
  strokeWidth?: number;
  /** Label aria pour les icônes décoratives (sinon aria-hidden). */
  ariaLabel?: string;
}

const props = withDefaults(defineProps<IconProps>(), {
  size: 16,
  strokeWidth: 2,
});

const IconComponent = computed(() => iconMap[props.name]);
</script>

<template>
  <component
    :is="IconComponent"
    v-if="IconComponent"
    :size="size"
    :stroke-width="strokeWidth"
    :color="color"
    :class="props.class"
    :aria-label="ariaLabel"
    :aria-hidden="ariaLabel ? undefined : true"
  />
</template>

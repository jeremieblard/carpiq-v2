<script setup lang="ts">
/**
 * Badge.vue — Étiquette/tag visuel.
 *
 * Source de référence : annexe B (cf. patterns Cards, indicateurs visuels).
 *
 * Utilisé pour étiqueter du contenu avec une variante sémantique :
 *   - default : neutre, fond gris
 *   - primary : teal (couleur de marque)
 *   - accent  : amber (accent secondaire)
 *   - success : vert
 *   - warning : amber/orange
 *   - error   : rouge
 *
 * Taille par défaut "sm" (typique pour des badges inline dans des cards).
 */
import Icon from './Icon.vue';
import type { IconName } from './Icon.vue';
import { computed } from 'vue';

export type BadgeVariant =
  | 'default'
  | 'primary'
  | 'accent'
  | 'success'
  | 'warning'
  | 'error';

export type BadgeSize = 'sm' | 'md';

export interface BadgeProps {
  variant?: BadgeVariant;
  size?: BadgeSize;
  /** Icône optionnelle à gauche du label. */
  icon?: IconName;
}

const props = withDefaults(defineProps<BadgeProps>(), {
  variant: 'default',
  size: 'sm',
});

const variantClasses = computed<Record<BadgeVariant, string>>(() => ({
  default: 'bg-gray-100 text-gray-800',
  primary: 'bg-teal-50 text-teal-900',
  accent: 'bg-amber-50 text-amber-900',
  success: 'bg-green-50 text-green-900',
  warning: 'bg-amber-100 text-amber-900',
  error: 'bg-red-50 text-red-900',
}));

const sizeClasses = computed<Record<BadgeSize, string>>(() => ({
  sm: 'text-xs px-2 py-0.5 gap-1',
  md: 'text-sm px-2.5 py-1 gap-1.5',
}));

const iconSize = computed(() => (props.size === 'sm' ? 12 : 14));
</script>

<template>
  <span
    class="inline-flex items-center font-medium rounded-full"
    :class="[variantClasses[variant], sizeClasses[size]]"
  >
    <Icon v-if="icon" :name="icon" :size="iconSize" aria-hidden="true" />
    <slot />
  </span>
</template>

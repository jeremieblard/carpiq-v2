<script setup lang="ts">
/**
 * Button.vue — Bouton standard CarPIQ V2.
 *
 * Source de référence : annexe B section 9.1 (spec React portée en Vue).
 *
 * Variantes :
 *   - primary   : fond teal-700, texte blanc (action principale)
 *   - secondary : fond gris clair, bordure, texte ink (action secondaire)
 *   - ghost     : transparent, texte ink (action tertiaire)
 *
 * Note : la spec d'origine prévoyait aussi "danger". Reporté à Phase 3
 * (sera utile pour les confirmations de suppression).
 *
 * Tailles :
 *   - sm : 36px min-height (utilisé inline)
 *   - md : 44px (défaut, conforme touch target mobile)
 *   - lg : 52px (CTA principal page résultats)
 *
 * États : disabled, loading.
 * Icônes : optionnelles, position left ou right.
 */
import { computed } from 'vue';
import Icon from './Icon.vue';
import type { IconName } from './Icon.vue';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';
export type ButtonType = 'button' | 'submit' | 'reset';
export type IconPosition = 'left' | 'right';

export interface ButtonProps {
  /** Label texte (alternative au slot par défaut). */
  label?: string;
  /** Type HTML du bouton. */
  type?: ButtonType;
  /** Variante visuelle. */
  variant?: ButtonVariant;
  /** Taille. */
  size?: ButtonSize;
  /** Prend toute la largeur du parent. */
  fullWidth?: boolean;
  /** Désactivé. */
  disabled?: boolean;
  /** En chargement (icône spinner + disabled). */
  loading?: boolean;
  /** Icône à afficher. */
  icon?: IconName;
  /** Position de l'icône. */
  iconPosition?: IconPosition;
}

const props = withDefaults(defineProps<ButtonProps>(), {
  type: 'button',
  variant: 'primary',
  size: 'md',
  fullWidth: false,
  disabled: false,
  loading: false,
  iconPosition: 'right',
});

const emit = defineEmits<{
  click: [event: MouseEvent];
}>();

function handleClick(e: MouseEvent) {
  if (props.disabled || props.loading) return;
  emit('click', e);
}

const isDisabled = computed(() => props.disabled || props.loading);

const variantClasses = computed<Record<ButtonVariant, string>>(() => ({
  primary:
    'bg-teal-700 text-white hover:bg-teal-800 focus-visible:ring-teal-500',
  secondary:
    'bg-gray-50 text-gray-900 border border-gray-300 hover:bg-gray-100 hover:border-teal-500 focus-visible:ring-teal-500',
  ghost:
    'bg-transparent text-gray-900 hover:bg-gray-100 focus-visible:ring-teal-500',
}));

const sizeClasses = computed<Record<ButtonSize, string>>(() => ({
  sm: 'text-sm px-4 py-2 min-h-[36px] gap-1.5',
  md: 'text-base px-5 py-3 min-h-[44px] gap-2',
  lg: 'text-lg px-6 py-4 min-h-[52px] gap-2.5',
}));

const iconSize = computed(() =>
  props.size === 'sm' ? 14 : props.size === 'md' ? 16 : 18,
);

const displayedIcon = computed<IconName | undefined>(() =>
  props.loading ? 'loader' : props.icon,
);
</script>

<template>
  <button
    :type="type"
    :disabled="isDisabled"
    :aria-busy="loading ? 'true' : undefined"
    :class="[
      // Base
      'inline-flex items-center justify-center font-medium rounded-lg',
      'transition-colors duration-150',
      'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      // Variante + taille
      variantClasses[variant],
      sizeClasses[size],
      // Full width
      fullWidth ? 'w-full' : '',
    ]"
    @click="handleClick"
  >
    <Icon
      v-if="displayedIcon && iconPosition === 'left'"
      :name="displayedIcon"
      :size="iconSize"
      :class="loading ? 'animate-spin' : ''"
      aria-hidden="true"
    />
    <span><slot>{{ label }}</slot></span>
    <Icon
      v-if="displayedIcon && iconPosition === 'right'"
      :name="displayedIcon"
      :size="iconSize"
      :class="loading ? 'animate-spin' : ''"
      aria-hidden="true"
    />
  </button>
</template>

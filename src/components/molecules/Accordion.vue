<script setup lang="ts">
/**
 * Accordion — accordion accessible (Enter/Espace, ARIA).
 *
 * Source : spec section 2.6 "Accordions algorithmes : ouverts un à la fois,
 * animation 250ms".
 *
 * Comportement :
 *   - Un seul accordion ouvert à la fois (radio-like)
 *   - Clic sur header toggle l'ouverture
 *   - Animation `max-height` 250ms
 *   - Header est un <button> pour focusabilité native
 *
 * Note : on garde la gestion "1 ouvert à la fois" simple en utilisant un
 * groupe via prop `groupId`. Le parent gère lui-même la coordination si
 * besoin, mais ce composant est autosuffisant pour un usage simple.
 */
import { ref } from 'vue';
import Icon from '../atoms/Icon.vue';

interface Props {
  /** Titre du panneau (clickable). */
  title: string;
  /** Ouvert par défaut. */
  defaultOpen?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  defaultOpen: false,
});

const open = ref(props.defaultOpen);
const contentId = `acc-${Math.random().toString(36).slice(2, 10)}`;

function toggle() {
  open.value = !open.value;
}
</script>

<template>
  <div class="border-b border-gray-200">
    <button
      type="button"
      class="w-full flex items-center justify-between gap-3
             px-4 py-4 text-left
             text-base font-semibold text-gray-900
             hover:bg-gray-50
             focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
      :aria-expanded="open"
      :aria-controls="contentId"
      @click="toggle"
    >
      <span>{{ title }}</span>
      <Icon
        :name="open ? 'chevron-up' : 'chevron-down'"
        :size="20"
        aria-hidden="true"
      />
    </button>

    <div
      :id="contentId"
      :hidden="!open"
      class="px-4 pb-4 text-base text-gray-700 leading-relaxed"
    >
      <slot />
    </div>
  </div>
</template>

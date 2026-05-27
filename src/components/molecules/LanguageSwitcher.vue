<script setup lang="ts">
/**
 * LanguageSwitcher — dropdown pour changer de langue.
 *
 * Affiche la langue courante avec un dropdown contenant les autres langues
 * disponibles. Au clic, redirige vers la même page dans la langue cible.
 *
 * Accessibilité :
 *   - Bouton avec aria-haspopup + aria-expanded
 *   - Menu ul avec role="menu" et items role="menuitem"
 *   - Trap focus dans le menu ouvert + Escape pour fermer
 *   - Click outside ferme le menu
 *
 * Note : on n'utilise pas la prop reactivity de Vue pour le pathname car
 * cette info vient de l'URL côté serveur (Astro). Donc on accepte juste
 * la prop `currentPath` qui doit être passée par la page Astro parent.
 */
import { ref, onMounted, onBeforeUnmount, computed } from 'vue';
import Icon from '../atoms/Icon.vue';
import { LANGUAGES, useT, pathInLang, type Lang } from '../../i18n';

interface Props {
  /** Langue courante (passée par la page Astro depuis getLangFromUrl). */
  lang: Lang;
  /** Path courant de l'URL (Astro.url.pathname). */
  currentPath: string;
}

const props = defineProps<Props>();

const t = useT(props.lang);
const open = ref(false);
const containerRef = ref<HTMLElement | null>(null);

const otherLanguages = computed(() => LANGUAGES.filter((l) => l !== props.lang));

function toggle() {
  open.value = !open.value;
}

function close() {
  open.value = false;
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && open.value) {
    close();
    // Restituer le focus au bouton parent
    const btn = containerRef.value?.querySelector('button');
    if (btn instanceof HTMLButtonElement) btn.focus();
  }
}

function onClickOutside(e: MouseEvent) {
  if (!containerRef.value) return;
  if (!containerRef.value.contains(e.target as Node)) {
    close();
  }
}

onMounted(() => {
  document.addEventListener('keydown', onKeydown);
  document.addEventListener('click', onClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener('keydown', onKeydown);
  document.removeEventListener('click', onClickOutside);
});
</script>

<template>
  <div ref="containerRef" class="relative inline-block">
    <button
      type="button"
      :aria-label="t('language.switch_to')"
      :aria-expanded="open"
      aria-haspopup="menu"
      class="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg
             text-sm font-medium text-gray-900
             hover:bg-gray-100
             focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
      @click.stop="toggle"
    >
      <span class="uppercase">{{ lang }}</span>
      <Icon name="chevron-down" :size="14" aria-hidden="true" />
    </button>

    <ul
      v-if="open"
      role="menu"
      class="absolute right-0 mt-1 min-w-[10rem] py-1
             bg-white border border-gray-200 rounded-lg shadow-lg
             z-50"
    >
      <li
        v-for="otherLang in otherLanguages"
        :key="otherLang"
        role="none"
      >
        <a
          :href="pathInLang(currentPath, otherLang)"
          role="menuitem"
          class="block px-4 py-2 text-sm text-gray-900
                 hover:bg-teal-50 hover:text-teal-900
                 focus:outline-none focus:bg-teal-50 focus:text-teal-900"
        >
          <span class="uppercase font-medium mr-2">{{ otherLang }}</span>
          <span class="text-gray-600">{{ t(`language.${otherLang}` as 'language.fr' | 'language.en') }}</span>
        </a>
      </li>
    </ul>
  </div>
</template>

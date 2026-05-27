<script setup lang="ts">
/**
 * NavBar — navigation responsive.
 *
 * Desktop : liens horizontaux.
 * Mobile  : burger qui ouvre un menu plein écran (drawer).
 *
 * Le breakpoint est `md:` (768px). Sous md, on affiche le burger.
 *
 * Accessibilité :
 *   - aria-controls + aria-expanded sur le bouton burger
 *   - role="navigation" sur le nav
 *   - Escape ferme le menu mobile
 *   - Click sur backdrop ferme le menu
 *
 * Les items de menu sont passés en prop pour rester découplé de la logique
 * i18n (parent Astro résout les libellés + URLs avec la bonne langue).
 */
import { ref, onMounted, onBeforeUnmount } from 'vue';
import Icon from '../atoms/Icon.vue';
import { useT, type Lang } from '../../i18n';

export interface NavItem {
  label: string;
  href: string;
  current?: boolean;
}

interface Props {
  lang: Lang;
  items: NavItem[];
}

const props = defineProps<Props>();

const t = useT(props.lang);
const mobileOpen = ref(false);

function toggleMobile() {
  mobileOpen.value = !mobileOpen.value;
}

function closeMobile() {
  mobileOpen.value = false;
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && mobileOpen.value) closeMobile();
}

onMounted(() => {
  document.addEventListener('keydown', onKeydown);
});

onBeforeUnmount(() => {
  document.removeEventListener('keydown', onKeydown);
});
</script>

<template>
  <nav role="navigation" class="flex items-center">
    <!-- Desktop: liens horizontaux -->
    <ul class="hidden md:flex items-center gap-1">
      <li v-for="item in items" :key="item.href">
        <a
          :href="item.href"
          :aria-current="item.current ? 'page' : undefined"
          class="px-3 py-2 rounded-lg text-sm font-medium text-gray-900
                 hover:bg-gray-100
                 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
          :class="item.current ? 'bg-teal-50 text-teal-900' : ''"
        >
          {{ item.label }}
        </a>
      </li>
    </ul>

    <!-- Mobile: burger -->
    <button
      type="button"
      class="md:hidden inline-flex items-center justify-center
             w-11 h-11 rounded-lg text-gray-900
             hover:bg-gray-100
             focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
      :aria-label="mobileOpen ? t('nav.close_menu') : t('nav.open_menu')"
      :aria-expanded="mobileOpen"
      aria-controls="mobile-menu"
      @click="toggleMobile"
    >
      <Icon :name="mobileOpen ? 'close' : 'menu'" :size="22" aria-hidden="true" />
    </button>

    <!-- Mobile menu drawer -->
    <div
      v-if="mobileOpen"
      class="md:hidden fixed inset-0 z-40"
    >
      <!-- Backdrop -->
      <div
        class="absolute inset-0 bg-black/50"
        aria-hidden="true"
        @click="closeMobile"
      ></div>

      <!-- Panel -->
      <div
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        class="absolute top-0 right-0 bottom-0 w-72 max-w-[85vw]
               bg-white shadow-xl p-6
               flex flex-col gap-4 overflow-y-auto"
      >
        <button
          type="button"
          class="self-end w-11 h-11 inline-flex items-center justify-center rounded-lg
                 text-gray-900 hover:bg-gray-100
                 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
          :aria-label="t('nav.close_menu')"
          @click="closeMobile"
        >
          <Icon name="close" :size="22" aria-hidden="true" />
        </button>

        <ul class="flex flex-col gap-1">
          <li v-for="item in items" :key="item.href">
            <a
              :href="item.href"
              :aria-current="item.current ? 'page' : undefined"
              class="block px-3 py-3 rounded-lg text-base font-medium text-gray-900
                     hover:bg-gray-100
                     focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
              :class="item.current ? 'bg-teal-50 text-teal-900' : ''"
              @click="closeMobile"
            >
              {{ item.label }}
            </a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

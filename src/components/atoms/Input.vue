<script setup lang="ts">
/**
 * Input.vue — Champ de formulaire (texte ou select).
 *
 * Source de référence : annexe B (composants atomiques, formulaires
 * Phase 3 quiz).
 *
 * Type unique pour gérer :
 *   - text / email / number / tel / password (type natif HTML)
 *   - select avec options
 *
 * Inclut : label, help text, error state, prefix/suffix slots.
 * Accessibilité : aria-describedby pour error/help, aria-invalid.
 */
import { computed } from 'vue';

export type InputType =
  | 'text'
  | 'email'
  | 'number'
  | 'tel'
  | 'password'
  | 'search'
  | 'url'
  | 'select';

export interface InputOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

export interface InputProps {
  /** Nom du champ (utilisé pour id si non fourni). */
  name: string;
  /** Valeur (v-model). */
  modelValue?: string | number;
  /** Type du champ. */
  type?: InputType;
  /** Label visible (recommandé). */
  label?: string;
  /** Texte d'aide sous le champ. */
  help?: string;
  /** Message d'erreur (déclenche aria-invalid + style). */
  error?: string;
  /** Placeholder (texte vide en select = première option grisée). */
  placeholder?: string;
  /** Options pour type=select. */
  options?: InputOption[];
  /** Désactivé. */
  disabled?: boolean;
  /** Lecture seule. */
  readonly?: boolean;
  /** Requis (asterisque dans label + attribut HTML). */
  required?: boolean;
  /** Champ pleine largeur (défaut true). */
  fullWidth?: boolean;
  /** ID explicite (sinon dérivé de name). */
  id?: string;
}

const props = withDefaults(defineProps<InputProps>(), {
  type: 'text',
  disabled: false,
  readonly: false,
  required: false,
  fullWidth: true,
});

const emit = defineEmits<{
  'update:modelValue': [value: string | number];
  blur: [event: FocusEvent];
  focus: [event: FocusEvent];
}>();

const fieldId = computed(() => props.id ?? `input-${props.name}`);
const helpId = computed(() => `${fieldId.value}-help`);
const errorId = computed(() => `${fieldId.value}-error`);
const isInvalid = computed(() => !!props.error);

const describedBy = computed(() => {
  const ids: string[] = [];
  if (props.help) ids.push(helpId.value);
  if (props.error) ids.push(errorId.value);
  return ids.length ? ids.join(' ') : undefined;
});

const isSelect = computed(() => props.type === 'select');

function onInput(e: Event) {
  const target = e.target as HTMLInputElement | HTMLSelectElement;
  const raw = target.value;
  // Type 'number' : convertit en number (sauf chaîne vide)
  const value: string | number =
    props.type === 'number' && raw !== '' ? Number(raw) : raw;
  emit('update:modelValue', value);
}
</script>

<template>
  <div :class="['flex flex-col gap-1.5', fullWidth ? 'w-full' : '']">
    <!-- Label -->
    <label
      v-if="label"
      :for="fieldId"
      class="text-sm font-medium text-gray-900"
    >
      {{ label }}
      <span v-if="required" class="text-red-600" aria-label="requis">*</span>
    </label>

    <!-- Select -->
    <select
      v-if="isSelect"
      :id="fieldId"
      :name="name"
      :value="modelValue"
      :disabled="disabled"
      :required="required"
      :aria-invalid="isInvalid"
      :aria-describedby="describedBy"
      :class="[
        'block px-3 py-2 rounded-lg border bg-white text-gray-900',
        'min-h-[44px]',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-teal-500',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        isInvalid
          ? 'border-red-500 focus-visible:ring-red-500'
          : 'border-gray-300',
        fullWidth ? 'w-full' : '',
      ]"
      @change="onInput"
      @blur="(e: FocusEvent) => emit('blur', e)"
      @focus="(e: FocusEvent) => emit('focus', e)"
    >
      <option v-if="placeholder" value="" disabled>{{ placeholder }}</option>
      <option
        v-for="opt in options ?? []"
        :key="opt.value"
        :value="opt.value"
        :disabled="opt.disabled"
      >
        {{ opt.label }}
      </option>
    </select>

    <!-- Input texte/number/etc. -->
    <input
      v-else
      :id="fieldId"
      :name="name"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      :required="required"
      :aria-invalid="isInvalid"
      :aria-describedby="describedBy"
      :class="[
        'block px-3 py-2 rounded-lg border bg-white text-gray-900',
        'min-h-[44px]',
        'placeholder:text-gray-400',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-teal-500',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        isInvalid
          ? 'border-red-500 focus-visible:ring-red-500'
          : 'border-gray-300',
        fullWidth ? 'w-full' : '',
      ]"
      @input="onInput"
      @blur="(e: FocusEvent) => emit('blur', e)"
      @focus="(e: FocusEvent) => emit('focus', e)"
    />

    <!-- Help text -->
    <p
      v-if="help && !error"
      :id="helpId"
      class="text-xs text-gray-600"
    >
      {{ help }}
    </p>

    <!-- Error message -->
    <p
      v-if="error"
      :id="errorId"
      class="text-xs text-red-600 font-medium"
      role="alert"
    >
      {{ error }}
    </p>
  </div>
</template>

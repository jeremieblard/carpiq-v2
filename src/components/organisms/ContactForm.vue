<script setup lang="ts">
/**
 * ContactForm — formulaire de contact avec validation côté client + submit
 * vers /api/contact (qui appelle Resend).
 *
 * Champs (spec annexe A section 4.4) :
 *   - Nom (requis, 2-100 caractères)
 *   - Email (requis, format valide)
 *   - Catégorie (select : support / press / partnerships)
 *   - Sujet (requis, 3-200 caractères)
 *   - Message (requis, 50-5000 caractères)
 *   - Honeypot _gotcha (hidden, anti-spam)
 *
 * États :
 *   - idle : formulaire vierge
 *   - submitting : POST en cours, bouton disabled+loading
 *   - success : message envoyé, formulaire reset
 *   - error : erreur réseau ou validation serveur, affichage du message
 *
 * Accessibilité :
 *   - Labels associés aux inputs
 *   - aria-invalid + aria-describedby sur les champs en erreur
 *   - role="alert" sur les messages d'erreur / succès
 *   - Focus sur la 1re erreur après submit échoué
 */
import { ref, computed } from 'vue';
import Input from '../atoms/Input.vue';
import Button from '../atoms/Button.vue';
import { useT, type Lang } from '../../i18n';

interface Props {
  lang: Lang;
  /** Pré-sélection de la catégorie (si l'utilisateur clique un bouton topic). */
  initialTopic?: 'support' | 'press' | 'partnerships';
}

const props = withDefaults(defineProps<Props>(), {
  initialTopic: 'support',
});

const t = useT(props.lang);

// État du formulaire
const name = ref('');
const email = ref('');
const topic = ref<'support' | 'press' | 'partnerships'>(props.initialTopic);
const subject = ref('');
const message = ref('');
const gotcha = ref(''); // honeypot

// État de soumission
type SubmitState = 'idle' | 'submitting' | 'success' | 'error';
const submitState = ref<SubmitState>('idle');
const errorMessage = ref('');

// Erreurs de validation par champ
const errors = ref<Record<string, string>>({});

const topicOptions = computed(() => [
  { value: 'support', label: t('contact.topic_support') },
  { value: 'press', label: t('contact.topic_press') },
  { value: 'partnerships', label: t('contact.topic_partnerships') },
]);

function validate(): boolean {
  const newErrors: Record<string, string> = {};
  if (!name.value.trim() || name.value.trim().length < 2) {
    newErrors.name = t('contact.error_name');
  }
  if (!email.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    newErrors.email = t('contact.error_email');
  }
  if (!subject.value.trim() || subject.value.trim().length < 3) {
    newErrors.subject = t('contact.error_subject');
  }
  if (!message.value.trim() || message.value.trim().length < 50) {
    newErrors.message = t('contact.error_message_short');
  }
  errors.value = newErrors;
  return Object.keys(newErrors).length === 0;
}

async function handleSubmit() {
  if (submitState.value === 'submitting') return;
  if (!validate()) {
    // Focus sur la 1re erreur
    const firstErrorField = Object.keys(errors.value)[0];
    if (firstErrorField) {
      const el = document.querySelector(`[name="${firstErrorField}"]`);
      if (el instanceof HTMLElement) el.focus();
    }
    return;
  }

  submitState.value = 'submitting';
  errorMessage.value = '';

  try {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: name.value.trim(),
        email: email.value.trim(),
        topic: topic.value,
        subject: subject.value.trim(),
        message: message.value.trim(),
        _gotcha: gotcha.value,
      }),
    });

    const data = (await res.json()) as { ok: boolean; error?: string };

    if (data.ok) {
      submitState.value = 'success';
      // Reset formulaire
      name.value = '';
      email.value = '';
      subject.value = '';
      message.value = '';
    } else {
      submitState.value = 'error';
      errorMessage.value = t('contact.error_send');
    }
  } catch {
    submitState.value = 'error';
    errorMessage.value = t('contact.error_network');
  }
}
</script>

<template>
  <form
    @submit.prevent="handleSubmit"
    novalidate
    class="flex flex-col gap-4 w-full max-w-xl"
  >
    <!-- Honeypot anti-spam (caché aux humains, visible aux bots) -->
    <div aria-hidden="true" style="position: absolute; left: -9999px;">
      <label>
        Don't fill this in:
        <input
          type="text"
          name="_gotcha"
          v-model="gotcha"
          tabindex="-1"
          autocomplete="off"
        />
      </label>
    </div>

    <Input
      name="name"
      type="text"
      :label="t('contact.field_name')"
      :placeholder="t('contact.placeholder_name')"
      v-model="name"
      :error="errors.name"
      required
    />

    <Input
      name="email"
      type="email"
      :label="t('contact.field_email')"
      placeholder="jean.dupont@example.com"
      v-model="email"
      :error="errors.email"
      required
    />

    <Input
      name="topic"
      type="select"
      :label="t('contact.field_topic')"
      v-model="topic"
      :options="topicOptions"
      required
    />

    <Input
      name="subject"
      type="text"
      :label="t('contact.field_subject')"
      :placeholder="t('contact.placeholder_subject')"
      v-model="subject"
      :error="errors.subject"
      required
    />

    <!-- Message textarea : pas dans Input.vue, on l'inline ici -->
    <div class="flex flex-col gap-1.5 w-full">
      <label
        for="contact-message"
        class="text-sm font-medium text-gray-900"
      >
        {{ t('contact.field_message') }}
        <span class="text-red-600" aria-label="requis">*</span>
      </label>
      <textarea
        id="contact-message"
        name="message"
        v-model="message"
        rows="6"
        :placeholder="t('contact.placeholder_message')"
        :aria-invalid="!!errors.message"
        :aria-describedby="errors.message ? 'msg-error' : 'msg-help'"
        required
        :class="[
          'block px-3 py-2 rounded-lg border bg-white text-gray-900',
          'min-h-[140px] resize-y',
          'placeholder:text-gray-400',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-teal-500',
          errors.message ? 'border-red-500 focus-visible:ring-red-500' : 'border-gray-300',
        ]"
      ></textarea>
      <p v-if="!errors.message" id="msg-help" class="text-xs text-gray-600">
        {{ t('contact.help_message') }}
      </p>
      <p v-else id="msg-error" class="text-xs text-red-600 font-medium" role="alert">
        {{ errors.message }}
      </p>
    </div>

    <!-- Consentement RGPD -->
    <p class="text-xs text-gray-600 mt-2">
      {{ t('contact.gdpr_notice') }}
    </p>

    <!-- Bouton submit -->
    <div class="mt-4">
      <Button
        type="submit"
        variant="primary"
        size="md"
        :loading="submitState === 'submitting'"
        :disabled="submitState === 'submitting' || submitState === 'success'"
        :label="
          submitState === 'submitting'
            ? t('contact.submit_loading')
            : t('contact.submit')
        "
        icon="arrow-right"
      />
    </div>

    <!-- Feedback succès -->
    <div
      v-if="submitState === 'success'"
      role="alert"
      class="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-900"
    >
      <p class="font-semibold">{{ t('contact.success_title') }}</p>
      <p class="text-sm mt-1">{{ t('contact.success_message') }}</p>
    </div>

    <!-- Feedback erreur -->
    <div
      v-if="submitState === 'error' && errorMessage"
      role="alert"
      class="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-900"
    >
      <p class="font-semibold">{{ t('contact.error_title') }}</p>
      <p class="text-sm mt-1">{{ errorMessage }}</p>
    </div>
  </form>
</template>

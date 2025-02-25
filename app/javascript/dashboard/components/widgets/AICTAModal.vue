<template>
  <div class="px-0 min-w-0 flex-1">
    <woot-modal-header
      :header-title="$t('INTEGRATION_SETTINGS.OPEN_AI.CTA_MODAL.TITLE')"
      :header-content="$t('INTEGRATION_SETTINGS.OPEN_AI.CTA_MODAL.DESC')"
    />
    <form
      class="flex flex-wrap flex-col modal-content"
      @submit.prevent="finishOpenAI"
    >
      <div class="mt-2 w-full">
        <woot-input
          v-model="value"
          type="text"
          :class="{ error: $v.value.$error }"
          :placeholder="
            $t('INTEGRATION_SETTINGS.OPEN_AI.CTA_MODAL.KEY_PLACEHOLDER')
          "
          @blur="$v.value.$touch"
        />
      </div>
      <div class="flex flex-row justify-between gap-2 py-2 px-0 w-full">
        <woot-button variant="link" @click.prevent="openOpenAIDoc">
          {{ $t('INTEGRATION_SETTINGS.OPEN_AI.CTA_MODAL.BUTTONS.NEED_HELP') }}
        </woot-button>
        <div class="flex items-center gap-1">
          <woot-button variant="clear" @click.prevent="onDismiss">
            {{ $t('INTEGRATION_SETTINGS.OPEN_AI.CTA_MODAL.BUTTONS.DISMISS') }}
          </woot-button>
          <woot-button :is-disabled="$v.value.$invalid">
            {{ $t('INTEGRATION_SETTINGS.OPEN_AI.CTA_MODAL.BUTTONS.FINISH') }}
          </woot-button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import { required } from 'vuelidate/lib/validators';
import { mapGetters } from 'vuex';
import aiMixin from 'dashboard/mixins/aiMixin';
import alertMixin from 'shared/mixins/alertMixin';
import uiSettingsMixin from 'dashboard/mixins/uiSettings';
import { OPEN_AI_EVENTS } from 'dashboard/helper/AnalyticsHelper/events';

export default {
  mixins: [aiMixin, alertMixin, uiSettingsMixin],
  data() {
    return {
      value: '',
    };
  },
  validations: {
    value: {
      required,
    },
  },
  computed: {
    ...mapGetters({
      appIntegrations: 'integrations/getAppIntegrations',
    }),
  },
  methods: {
    onClose() {
      this.$emit('close');
    },

    onDismiss() {
      this.showAlert(
        this.$t('INTEGRATION_SETTINGS.OPEN_AI.CTA_MODAL.DISMISS_MESSAGE')
      );
      this.updateUISettings({
        is_open_ai_cta_modal_dismissed: true,
      });
      this.onClose();
    },

    async finishOpenAI() {
      const payload = {
        app_id: 'openai',
        settings: {
          api_key: this.value,
        },
      };
      try {
        await this.$store.dispatch('integrations/createHook', payload);
        this.alertMessage = this.$t(
          'INTEGRATION_SETTINGS.OPEN_AI.CTA_MODAL.SUCCESS_MESSAGE'
        );
        this.recordAnalytics(
          OPEN_AI_EVENTS.ADDED_AI_INTEGRATION_VIA_CTA_BUTTON
        );
        this.onClose();
      } catch (error) {
        const errorMessage = error?.response?.data?.message;
        this.alertMessage =
          errorMessage || this.$t('INTEGRATION_APPS.ADD.API.ERROR_MESSAGE');
      } finally {
        this.showAlert(this.alertMessage);
      }
    },
    openOpenAIDoc() {
      window.open('https://chatcore.aligned-tech.com/blog/v2-17', '_blank');
    },
  },
};
</script>

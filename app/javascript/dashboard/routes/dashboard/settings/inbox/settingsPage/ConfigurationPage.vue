<template>
  <div v-if="isATwilioChannel" class="settings--content">
    <settings-section
      :title="$t('INBOX_MGMT.ADD.TWILIO.API_CALLBACK.TITLE')"
      :sub-title="$t('INBOX_MGMT.ADD.TWILIO.API_CALLBACK.SUBTITLE')"
    >
      <woot-code :script="inbox.callback_webhook_url" lang="html" />
    </settings-section>
  </div>
  <div v-else-if="isALineChannel" class="settings--content">
    <settings-section
      :title="$t('INBOX_MGMT.ADD.LINE_CHANNEL.API_CALLBACK.TITLE')"
      :sub-title="$t('INBOX_MGMT.ADD.LINE_CHANNEL.API_CALLBACK.SUBTITLE')"
    >
      <woot-code :script="inbox.callback_webhook_url" lang="html" />
    </settings-section>
  </div>
  <div v-else-if="isAWebWidgetInbox">
    <div class="settings--content">
      <settings-section
        :title="$t('INBOX_MGMT.SETTINGS_POPUP.MESSENGER_HEADING')"
        :sub-title="$t('INBOX_MGMT.SETTINGS_POPUP.MESSENGER_SUB_HEAD')"
      >
        <woot-code
          :script="inbox.web_widget_script"
          lang="html"
          :codepen-title="`${inbox.name} - Asigned Widget Test`"
          :enable-code-pen="true"
        />
      </settings-section>

      <settings-section
        :title="$t('INBOX_MGMT.SETTINGS_POPUP.HMAC_VERIFICATION')"
      >
        <woot-code :script="inbox.hmac_token" />
        <template #subTitle>
          {{ $t('INBOX_MGMT.SETTINGS_POPUP.HMAC_DESCRIPTION') }}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://chatcore.aligned-tech.com/docs/product/channels/live-chat/sdk/identity-validation/"
          >
            {{ $t('INBOX_MGMT.SETTINGS_POPUP.HMAC_LINK_TO_DOCS') }}
          </a>
        </template>
      </settings-section>
      <settings-section
        :title="$t('INBOX_MGMT.SETTINGS_POPUP.HMAC_MANDATORY_VERIFICATION')"
        :sub-title="$t('INBOX_MGMT.SETTINGS_POPUP.HMAC_MANDATORY_DESCRIPTION')"
      >
        <div class="enter-to-send--checkbox">
          <input
            id="hmacMandatory"
            v-model="hmacMandatory"
            type="checkbox"
            @change="handleHmacFlag"
          />
          <label for="hmacMandatory">
            {{ $t('INBOX_MGMT.EDIT.ENABLE_HMAC.LABEL') }}
          </label>
        </div>
      </settings-section>
    </div>
  </div>
  <div v-else-if="isAPIInbox" class="settings--content">
    <settings-section
      :title="$t('INBOX_MGMT.SETTINGS_POPUP.INBOX_IDENTIFIER')"
      :sub-title="$t('INBOX_MGMT.SETTINGS_POPUP.INBOX_IDENTIFIER_SUB_TEXT')"
    >
      <woot-code :script="inbox.inbox_identifier" />
    </settings-section>

    <settings-section
      :title="$t('INBOX_MGMT.SETTINGS_POPUP.HMAC_VERIFICATION')"
      :sub-title="$t('INBOX_MGMT.SETTINGS_POPUP.HMAC_DESCRIPTION')"
    >
      <woot-code :script="inbox.hmac_token" />
    </settings-section>
    <settings-section
      :title="$t('INBOX_MGMT.SETTINGS_POPUP.HMAC_MANDATORY_VERIFICATION')"
      :sub-title="$t('INBOX_MGMT.SETTINGS_POPUP.HMAC_MANDATORY_DESCRIPTION')"
    >
      <div class="enter-to-send--checkbox">
        <input
          id="hmacMandatory"
          v-model="hmacMandatory"
          type="checkbox"
          @change="handleHmacFlag"
        />
        <label for="hmacMandatory">
          {{ $t('INBOX_MGMT.EDIT.ENABLE_HMAC.LABEL') }}
        </label>
      </div>
    </settings-section>
  </div>
  <div v-else-if="isAnEmailChannel">
    <div class="settings--content">
      <settings-section
        :title="$t('INBOX_MGMT.SETTINGS_POPUP.FORWARD_EMAIL_TITLE')"
        :sub-title="$t('INBOX_MGMT.SETTINGS_POPUP.FORWARD_EMAIL_SUB_TEXT')"
      >
        <woot-code :script="inbox.forward_to_email" />
      </settings-section>
    </div>
    <imap-settings :inbox="inbox" />
    <smtp-settings v-if="inbox.imap_enabled" :inbox="inbox" />
    <microsoft-reauthorize
      v-if="inbox.microsoft_reauthorization"
      :inbox="inbox"
    />
  </div>
  <div v-else-if="isAWhatsAppChannel && !isATwilioChannel">
    <div v-if="inbox.provider_config" class="settings--content">
      <settings-section
        :title="$t('INBOX_MGMT.SETTINGS_POPUP.WHATSAPP_WEBHOOK_TITLE')"
        :sub-title="$t('INBOX_MGMT.SETTINGS_POPUP.WHATSAPP_WEBHOOK_SUBHEADER')"
      >
        <woot-code :script="inbox.provider_config.webhook_verify_token" />
      </settings-section>
      <settings-section
        :title="$t('INBOX_MGMT.SETTINGS_POPUP.WHATSAPP_SECTION_TITLE')"
        :sub-title="$t('INBOX_MGMT.SETTINGS_POPUP.WHATSAPP_SECTION_SUBHEADER')"
      >
        <woot-code :script="inbox.provider_config.api_key" />
      </settings-section>
      <settings-section
        :title="$t('INBOX_MGMT.SETTINGS_POPUP.WHATSAPP_SECTION_UPDATE_TITLE')"
        :sub-title="
          $t('INBOX_MGMT.SETTINGS_POPUP.WHATSAPP_SECTION_UPDATE_SUBHEADER')
        "
      >
        <div class="whatsapp-settings--content">
          <woot-input
            v-model.trim="whatsAppInboxAPIKey"
            type="text"
            class="input"
            :placeholder="
              $t(
                'INBOX_MGMT.SETTINGS_POPUP.WHATSAPP_SECTION_UPDATE_PLACEHOLDER'
              )
            "
          />
          <woot-button
            :disabled="$v.whatsAppInboxAPIKey.$invalid"
            @click="updateWhatsAppInboxAPIKey"
          >
            {{ $t('INBOX_MGMT.SETTINGS_POPUP.WHATSAPP_SECTION_UPDATE_BUTTON') }}
          </woot-button>
        </div>
      </settings-section>
    </div>
  </div>
</template>

<script>
import alertMixin from 'shared/mixins/alertMixin';
import inboxMixin from 'shared/mixins/inboxMixin';
import SettingsSection from '../../../../../components/SettingsSection';
import ImapSettings from '../ImapSettings';
import SmtpSettings from '../SmtpSettings';
import MicrosoftReauthorize from '../channels/microsoft/Reauthorize';
import { required } from 'vuelidate/lib/validators';

export default {
  components: {
    SettingsSection,
    ImapSettings,
    SmtpSettings,
    MicrosoftReauthorize,
  },
  mixins: [inboxMixin, alertMixin],
  props: {
    inbox: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      hmacMandatory: false,
      whatsAppInboxAPIKey: '',
    };
  },
  validations: {
    whatsAppInboxAPIKey: { required },
  },
  watch: {
    inbox() {
      this.setDefaults();
    },
  },
  mounted() {
    this.setDefaults();
  },
  methods: {
    setDefaults() {
      this.hmacMandatory = this.inbox.hmac_mandatory || false;
    },
    handleHmacFlag() {
      this.updateInbox();
    },
    async updateInbox() {
      try {
        const payload = {
          id: this.inbox.id,
          formData: false,
          channel: {
            hmac_mandatory: this.hmacMandatory,
          },
        };
        await this.$store.dispatch('inboxes/updateInbox', payload);
        this.showAlert(this.$t('INBOX_MGMT.EDIT.API.SUCCESS_MESSAGE'));
      } catch (error) {
        this.showAlert(this.$t('INBOX_MGMT.EDIT.API.ERROR_MESSAGE'));
      }
    },
    async updateWhatsAppInboxAPIKey() {
      try {
        const payload = {
          id: this.inbox.id,
          formData: false,
          channel: {},
        };

        payload.channel.provider_config = {
          ...this.inbox.provider_config,
          api_key: this.whatsAppInboxAPIKey,
        };

        await this.$store.dispatch('inboxes/updateInbox', payload);
        this.showAlert(this.$t('INBOX_MGMT.EDIT.API.SUCCESS_MESSAGE'));
      } catch (error) {
        this.showAlert(this.$t('INBOX_MGMT.EDIT.API.ERROR_MESSAGE'));
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.whatsapp-settings--content {
  align-items: center;
  display: flex;
  flex: 1;
  justify-content: space-between;
  margin-top: var(--space-small);

  .input {
    flex: 1;
    margin-right: var(--space-small);
    ::v-deep input {
      margin-bottom: 0;
    }
  }
}

.hmac-link-to-docs {
  margin-top: var(--space-small);
}
</style>

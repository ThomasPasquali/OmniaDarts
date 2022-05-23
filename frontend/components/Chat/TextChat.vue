<template>
  <div class="textchat">
    <div class="messages">
      <TextMessage
        v-for="(m, i) in messages"
        :key="i"
        :msg="m"
      />
    </div>

    <van-form @submit="sendMessage" class="bottom_bar">
      <van-cell-group inset>
        <van-field class="textarea" v-model="text" :placeholder="$t('message_placeholder')">
          <template #button>
            <van-button size="small" native-type="submit" type="primary" icon="comment" round></van-button>
          </template>
        </van-field>
      </van-cell-group>
    </van-form>

  </div>
</template>

<script>
import TextMessage from '~/components/Chat/TextMessage';

export default {
  name: 'TextChat',
  components: {TextMessage},
  data() {
    return {
      text: ''
    }
  },
  props: {
    id: {type: String, required: true},
  },
  computed: {
    messages() {
      return (this.$store.getters['textchats/chat'](this.id) && this.$store.getters['textchats/chat'](this.id).messages) || []
    }
  },
  emits: ['sendMessage'],
  methods: {
    sendMessage() {
      this.$emit('sendMessage', this.text)
      this.text = ''
    }
  },
  created() {
    this.$store.commit('textchats/newChat', this.id)
  }
}
</script>

<style scoped>
.textchat {
  display: flex;
  flex-direction: column;
  align-items: stretch;
}

.messages {
  width: 100%;
  background: white;
  flex: 1;
  margin-bottom: 3.4rem;  /* FIXME */
  margin-top: .4rem;
}

.bottom_bar {
  width: 100%;
  background: white;
  position: fixed;
  bottom: 0;
  overflow: hidden;
  height: 3rem;  /* FIXME */
  border-top: solid 1px gray;
}

.textarea {
  max-height: 33%;
}

.van-cell {
  padding-left: 0 !important;
  padding-right: 0 !important;
}
.van-cell-group{
  margin-left: .8rem !important;
  margin-right: .6rem !important;
}



</style>

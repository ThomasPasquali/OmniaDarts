<template>
  <div>

    <TextMessage
      v-for="(m, i) in messages"
      :key="i"
      :msg="m"
    />

    <input type="text" v-model="text" @focusout="sendMessage">

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

</style>

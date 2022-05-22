<template>
  <div>
    <TextChat :id="chatID" @sendMessage="sendMessage"/>
    <pre>{{ lastMessageSent }}</pre>
  </div>
</template>

<script>
import TextChat from "~/components/Chat/TextChat";

export default {
  name: "TextChatDev",
  components: {TextChat},
  data() {
    return {
      chatID: 'dev'
    }
  },
  computed: {
    lastMessageSent() {
      return this.$store.getters["textchats/lastMessageSent"]
    }
  },
  methods: {
    sendMessage(text) {
      this.$store.dispatch('textchats/newTextMessage', { chatID: this.chatID, text, sender: this.$auth.user.nickname })
    }
  },
  mounted() {
    this.sockets = {
      textchats: this.$store.getters.newIo(this, 'textchats') //Setup io for notifications
    }
  }
}
</script>

<style scoped>

</style>

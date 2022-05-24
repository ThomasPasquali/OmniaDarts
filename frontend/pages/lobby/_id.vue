<template>
  <div>
    <TextChat :id="match.lobby.chatID" @sendMessage="sendMessage"/>
    <pre>
      {{match}}
    </pre>
  </div>
</template>

<script>
import TextChat from "~/components/Chat/TextChat";
export default {
  name: "SpecificLobbyPage",
  components: {TextChat},
  params: ['id'],
  async asyncData(ctx) {
    return { match: await ctx.$axios.$get('matches/'+ctx.params.id)}
  },
  mounted() {
    console.log()
    this.socket = this.$store.getters.newIo(this, 'textchats?chatID='+this.match.lobby.chatID)
  },
  methods: {
    sendMessage(text) {
      this.$store.dispatch('textchats/newMessage', { chatID: this.match.lobby.chatID, text, sender: this.$auth.user.nickname })
      console.log(this.$store.getters["textchats/chat"](this.match.lobby.chatID))
    }
  }
}
</script>

<style scoped>

</style>

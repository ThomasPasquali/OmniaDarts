<template>
  <div>
    <div v-if="match !== null">
      <TextChat :id="match.lobby.chatID" @sendMessage="sendMessage"/>
      <pre>
        {{match}}
      </pre>
    </div>
    <div v-else>
      {{ $t('lobby_waiting_to_join') }}
      <van-button @click="back">Back</van-button>
    </div>
  </div>
</template>

<script>
import TextChat from "~/components/Chat/TextChat";
export default {
  name: "SpecificLobbyPage",
  components: {TextChat},
  params: ['id'],
  data() {
    return {
      match: null
    }
  },
  async asyncData(ctx) {
    let match = null;
    try {
      match = await ctx.$axios.$get('matches/'+ctx.params.id)
    }catch (e) {
      console.log(e)
    }
    return { match }
  },
  mounted() {
    this.sockets = {
      lobby: this.$store.getters.newIo(this, 'lobbies?lobbyID='+this.id)
    }
    if(this.match)
      this.sockets.chat = this.$store.getters.newIo(this, 'textchats?chatID='+this.match.lobby.chatID)
  },
  methods: {
    sendMessage(text) {
      this.$store.dispatch('textchats/newMessage', { chatID: this.match.lobby.chatID, text, sender: this.$auth.user.nickname })
      //console.log(this.$store.getters["textchats/chat"](this.match.lobby.chatID))
    },
    back() {
      window.history.go(-1)
    }
  }
}
</script>

<style scoped>

</style>

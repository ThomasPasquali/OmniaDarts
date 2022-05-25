<template>
  <div v-if="match !== null">
    <div v-if="isCurrentUserLobbyOwner(match)">
      <h1>Join requests</h1>
      <div v-for="req in joinRequests" :key="req._id">
        <p>{{req.nickname}}</p>
        <van-button icon="success" @click="acceptJoinRequest(req)"/>
        <van-button icon="cross" @click="rejectJoinRequest(req)"/>
      </div>
    </div>

      <!-- <TextChat :id="match.lobby.chatID" @sendMessage="sendMessage"/> -->
      <pre>
        {{match}}
      </pre>
  </div>
  <div v-else>
    {{ $t('lobby_waiting_to_join') }}
    <van-button @click="back">Back</van-button>
  </div>
</template>

<script>
import TextChat from "~/components/Chat/TextChat";
export default {
  name: "SpecificLobbyPage",
  components: {TextChat},
  async asyncData({ params }) {
    const id = params.id
    return { id }
  },
  computed: {
    match() { return this.$store.getters["lobbies/lobby"] },
    joinRequests() { return this.$store.getters['lobbies/lobbyJoinRequests'] }
  },
  async mounted() {
    await this.$store.dispatch("lobbies/fetchLobby", this.id)
    if(this.match) {
      this.sockets = {
        lobby: this.$store.getters.newIo(this, 'lobbies?lobbyID=' + this.id)
      }
      if (this.match)
        this.sockets.chat = this.$store.getters.newIo(this, 'textchats?chatID=' + this.match.lobby.chatID)
    }
  },
  methods: {
    sendMessage(text) {
      this.$store.dispatch('textchats/newMessage', { chatID: this.match.lobby.chatID, text, sender: this.$auth.user.nickname })
      //console.log(this.$store.getters["textchats/chat"](this.match.lobby.chatID))
    },
    back() {
      window.history.go(-1)
    },
    isCurrentUserLobbyOwner(match) {
      return match.lobby.owner._id === this.$auth.user._id
    },
    acceptJoinRequest(req) {
      console.log(req)
    },
    rejectJoinRequest(req) {
      console.log(req)
    }
  }
}
</script>

<style scoped>

</style>

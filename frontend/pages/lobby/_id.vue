<template>
  <div v-if="match !== null">
    <div v-if="isCurrentUserLobbyOwner">
      <h1>Join requests</h1>
      <div v-for="req in joinRequests" :key="req._id">
        <p>{{req.nickname}}</p>
        <van-button icon="success" @click="acceptJoinRequest(req)"/>
        <van-button icon="cross" @click="rejectJoinRequest(req)"/>
      </div>
    </div>

      <!-- <TextChat :id="match.lobby.chatID" @sendMessage="sendMessage"/> -->
    <h1>Match</h1>
    <h3>Players</h3>
    <div v-for="p in match.players" :key="p._id">
      <div v-if="!isUserLobbyOwner(p)">
        <p>{{p.nickname}}</p>
        <van-button @click="kick(p)">Kick</van-button>
      </div>
    </div>
    <h3>Description</h3>
    <pre>
      {{match.winningMode}}
      {{match.gamemode}}
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
    match() { return this.$store.getters['lobbies/lobby'] },
    joinRequests() { return this.$store.getters['lobbies/lobbyJoinRequests'] }
  },
  async mounted() {
    await this.$store.dispatch("lobbies/fetchLobby", this.id)
    if(this.match) {
      this.sockets = {
        lobby: this.$store.getters.newIo(this, 'lobbies?lobbyID=' + this.id)
      }
    }
  },
  methods: {
    back() {
      window.history.go(-1)
    },
    isCurrentUserLobbyOwner() {
      return this.match.lobby.owner._id === this.$auth.user._id
    },
    isUserLobbyOwner(u) {
      return this.match.lobby.owner._id === u._id
    },
    async acceptJoinRequest(req) {
      try {
        await this.$axios.$patch(`matches/lobby/joinRequest/${req._id}`)
        await this.$store.dispatch("lobbies/fetchLobby", this.match._id)
      }catch {
        alert('Cannot accept join request')
      }
    },
    async rejectJoinRequest(req) {
      try {
        await this.$axios.$delete(`matches/lobby/joinRequest/${req._id}`)
        await this.$store.dispatch("lobbies/fetchLobby", this.match._id)
      }catch {
        alert('Cannot reject join request')
      }
    },
    async kick(player) {
      try {
        await this.$axios.$delete(`matches/lobby/player/${player._id}`)
        await this.$store.dispatch("lobbies/fetchLobby", this.match._id)
      }catch {
        alert('Cannot kick player')
      }
    },
  }
}
</script>

<style scoped>

</style>

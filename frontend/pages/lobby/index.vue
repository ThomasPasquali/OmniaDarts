<template>
  <div v-if="lobbies">
    <button @click="newLobby">New</button>
    <div
      v-for="m in lobbies"
      :key="m._id">
      <van-button @click="joinLobby(m)">{{ m.lobby.isPublic ? 'Join' : 'Request' }}</van-button>
    </div>
  </div>
  <div v-else>Loading...</div>
</template>

<script>
import {GamemodeName, X01Settings, CheckInOut, FirstBest, SetsLegs} from "~/enums/matches";

export default {
  name: "LobbiesPage",
  methods: {
    async newLobby() {
      await this.$axios.$post('matches/lobby/new', {
        gamemode: {
          name: GamemodeName.X01,
          settings: new X01Settings(
            501,
            CheckInOut.Straight,
            CheckInOut.Double,
          ),
        },
        winningMode: {
          goal: 3,
          firstBest: FirstBest.First,
          setsLegs: SetsLegs.Legs,
        },
        lobby: {
          isPublic: false,
        },
      })
      await this.$store.dispatch("lobbies/fetchLobbies")
    },
    async joinLobby(match) {
      //FIXME if(!this.isCurrentUserLobbyOwner(match) || this.doesCurrentUserBelongToLobby(match))
      await this.$axios.$post('matches/lobby/joinRequest/'+match._id)
      window.location.href = `/lobby/${match._id}`
    },
    isCurrentUserLobbyOwner(match) {
      return match.lobby.owner._id !== this.$auth.user._id
    },
    doesCurrentUserBelongToLobby(match) {
      return match.players.find(u => u._id === this.$auth.user._id) != null
    },
  },
  mounted() {
    this.$store.dispatch("lobbies/fetchLobbies")
  },
  computed: {
    lobbies() { return this.$store.getters["lobbies/lobbies"] }
  }
}
</script>

<style scoped>

</style>

<template>
  <div v-if="matches">
    <button @click="newLobby">New</button>
    <div
      v-for="m in matches"
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
      this.matches = await this.$axios.$get('matches/lobbies')
    },
    async joinLobby(match) {
      await this.$axios.$post('matches/lobby/joinRequest/'+match._id)
      window.location.href = `/lobby/${match._id}`
    }
  },
  data() {
    return {
      matches: null
    }
  },
  async asyncData(ctx) {
    return { matches: await ctx.$axios.$get('matches') }
  },
}
</script>

<style scoped>

</style>

<template>
  <div v-if="!!match && !!match.players &&match.players.length" class="box">
    <div class="row" v-for="p in match.players">
      <div class="name">{{ p.nickname }}</div>
      <div class="win">
        {{ match.done ? (match.results.find(r => r.userID === p._id).score === winnerScore ? 'V' : 'X') : '-' }}
      </div>
      <div class="score">{{ match.results.find(r => r.userID === p._id).score }}</div>
    </div>
  </div>

  <div v-else class="box">
    <p>???</p>
  </div>
</template>

<script>
import {max} from "lodash/math";

export default {
  name: "TournamentPlayers",
  props: ['tournamentMatch'],
  async mounted() {
    await this.$store.dispatch("tournaments/fetchTournamentMatches", this.tournamentMatch.match);
  },
  computed: {
    match() {
      return this.$store.getters["tournaments/tournamentMatches"][this.tournamentMatch.match];
    },
    winnerScore() {
      return max(this.match.results.map(r => r.score));
    },
  },
}
</script>

<style scoped>

.box {
  display: flex;
  flex-direction: column;
  width: 200px;
  background: navy;
  gap: 4px;
  padding: 8px;
  color: white;
}

.row {
  display: flex;
  flex-direction: row;
  align-items: center;
  border-radius: 8px;
  color: black;
}

.row > * {
  padding: .4rem;
}

.name {
  background: orange;
  width: 100%;
}

.win {
  width: 1.6rem;
  background: orange;
}

.score {
  width: 2rem;
  text-align: right;
  background: green;
}

</style>

<template>

  <div v-if="!!match" class="box">
    <!--    <div class="row" v-for="p in match.players">-->
    <!--      <div class="name">{{ Object(participants.find(p_ => p_.id === p.id)).name /* fixme ??? */ }}</div>-->
    <!--      <div class="win">{{ (match.winner === p.id ? 'V' : 'X') }}</div>-->
    <!--      <div class="points">{{ p.points }}</div>-->
    <!--    </div>-->
    {{ tournamentMatch._id }}
    {{ tournamentMatch.match }}
    {{ match._id }}
    {{ match.players/*.map(p => p.nickname)*/ }}
  </div>

  <div v-else class="box">
    <p>???</p>
  </div>

</template>

<script>
export default {
  name: "TournamentPlayers",
  props: ['tournamentMatch'],
  async mounted() {
    // try {  // FIXME
      await this.$store.dispatch("match/fetchMatch", this.tournamentMatch.match);
    // } catch {}
  },
  computed: {
    match() {
      return this.$store.getters["match/match"];
    },
  },
}
</script>

<style scoped>

.box {
  display: flex;
  flex-direction: column;
  width: 200px;
  background: white;
  gap: 4px;
  padding: 8px;
}

.row {
  display: flex;
  flex-direction: row;
  align-items: center;
  border-radius: 8px;

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

.points {
  width: 2rem;
  text-align: right;
  background: green;
}

</style>

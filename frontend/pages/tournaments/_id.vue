<template>
  <div class="container" v-if="!!tournament">
    <h1>{{ tournament.name }}</h1>
    <div class="wrapper">
      <TournamentNode
        :match="finalMatch"
        :matches="tournament.matches"
        :finalRound="finalRound"
        :round="finalRound"
        :group="1"
      />
    </div>
    <br>
    <Banner
      v-for="p in tournament.players"
      :key="p._id"
      :user="p"
      :title="p.nickname"
      :subtitle="p.firstname + ' ' + p.lastname"
    />
    <pre>{{ tournament.winningMode }}</pre>
    <pre>{{ tournament.gamemode }}</pre>
  </div>
  <div v-else>Loading...</div>
</template>

<script>
import TournamentNode from "~/components/Tournaments/TournamentNode";
import {max} from "lodash/math";

export default {
  name: "tournamentMatches",
  components: {TournamentNode},
  data() {
    return {
      tournamentID: this.$route.params.id,
    }
  },
  async mounted() {
    await this.$store.dispatch("tournaments/fetchTournamentID", this.tournamentID);
    // await this.$store.dispatch("tournaments/fetchTournamentMatches", this.tournamentID);
  },
  computed: {
    tournament() {
      return this.$store.getters["tournaments/tournamentID"];
    },
    // matches() {
    //   return this.$store.getters["tournaments/tournamentMatches"];
    // },
    finalRound() {
      return max(this.tournament.matches.map(m => m.round));
    },
    finalMatch() {
      return this.tournament.matches.find(m => m.round === this.finalRound);
    },
    // tournamentTree() {
    //
    // },
  },

}
</script>

<style scoped>

.wrapper {
  /*display: flex;*/
  /*max-height: 600px;*/
  overflow-y: scroll;
  overflow-x: hidden;
  /*justify-content: center;*/
  background: antiquewhite;
}
</style>

<template>
  <van-tabs v-model:active="active">

    <van-tab title="New tournament">
      <h1>New tournament</h1>

      <CreateMatch :isTournament="true" />
    </van-tab>

    <van-tab title="Tournaments">
      <h1>Tournaments</h1>
      <!--      <pre>{{ tournaments }}</pre>-->
      <Banner
        v-for="t in tournaments"
        :key="t._id"
        :title="t.name"
        :subtitle="t.players.length + ' players'"
        :to="'/tournaments/' + t._id"
      />
    </van-tab>

  </van-tabs>
</template>

<script>
import TournamentPreview from "~/components/Tournaments/TournamentPreview";
import CreateMatch from "~/components/Lobbies/CreateMatches";

export default {
  name: "tournaments",
  components: {TournamentPreview, CreateMatch},
  data() {
    return {
      active: 0,
    };
  },
  computed: {
    tournaments() {
      return this.$store.getters["tournaments/tournaments"];
    },
  },
  mounted() {
    this.$store.dispatch("tournaments/fetchTournaments");
  },
};
</script>

<style scoped></style>

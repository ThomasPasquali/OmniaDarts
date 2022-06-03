<template>
  <div class="container">
    <h1>Tournaments</h1>
    <TournamentPreview v-for="(t, i) in tournaments" :key="i" :tournament="t" />

    <h1>New tournament</h1>
    <van-form @submit="submitNewTournament">
      <van-cell-group inset>
        <van-field v-model="tournament.name" label="Name" placeholder="Name" />
      </van-cell-group>
      <div style="margin: 16px">
        <van-button round block type="primary" native-type="submit">
          Submit
        </van-button>
      </div>
    </van-form>

    <h3>Club friends</h3>
    <p v-for="f in $store.getters['friends/clubFriends']" :key="f['_id']">
      {{ f.nickname }}
    </p>
    <h3>Friends</h3>
    <p v-for="f in $store.getters['friends/friends']" :key="f['_id']">
      {{ f.nickname }}
    </p>
    <h1>Debug</h1>
    <pre>{{ $store.getters.club }}</pre>
  </div>
</template>

<script>
import TournamentPreview from "~/components/Tournaments/TournamentPreview";

export default {
  name: "tournaments",
  components: {TournamentPreview},
  data() {
    return {
      tournament: {
        name: "",
      },
    };
  },
  computed: {
    tournaments() {
      return this.$store.getters["tournaments/tournaments"];
    },
  },
  methods: {
    submitNewTournament() {
      //TODO
    },
  },
  mounted() {
    this.$store.dispatch("tournaments/fetchTournaments");
  },
};
</script>

<style scoped></style>

<template>
  <div class="container">
    <h1>Tournaments</h1>
    <!--    <TournamentPreview v-for="(t, i) in tournaments" :key="i" :tournament="t" />-->
    <pre>{{ tournaments }}</pre>
    <h1>New tournament</h1>

    <CreateMatch :isTournament="true" />
    <!--    <van-form @submit="submitNewTournament">-->
    <!--      <van-cell-group inset>-->
    <!--        <van-field v-model="tournament.name" label="Name" placeholder="Tournament name" />-->
    <!--      </van-cell-group>-->
    <!--      <div>-->
    <!--        <h3>Match settings</h3>-->
    <!--        <CreateMatch :isTournament="true" />-->
    <!--      </div>-->
    <!--      <div>-->
    <!--        <h3>Players</h3>-->
    <!--        <div>-->
    <!--          <Banner-->
    <!--            v-for="f in $auth.user.friendRequests.filter(fr => !fr.pending)"-->
    <!--            :key="f.user._id + update"-->
    <!--            :user="f.user"-->
    <!--            :title="f.user.nickname"-->
    <!--            :subtitle="f.user.firstname + ' ' + f.user.lastname"-->
    <!--            :buttons="[{-->
    <!--              icon: selectedUsers.has(f.user._id) ? 'check_box' : 'check_box_outline_blank',-->
    <!--              emit: 'selectUser'-->
    <!--            }]"-->
    <!--            @selectUser="selectUser(f.user._id)"-->
    <!--          />-->
    <!--        </div>-->
    <!--      </div>-->

    <!--      <van-button round block type="primary" native-type="submit">Create tournament</van-button>-->
    <!--    </van-form>-->


    <!--    <h3>Club friends</h3>-->
    <!--    <p v-for="f in $store.getters['friends/clubFriends']" :key="f._id">-->
    <!--      {{ f.nickname }}-->
    <!--    </p>-->
    <!--    <h3>Friends</h3>-->
    <!--    <p v-for="f in $store.getters['friends/friends']" :key="f._id">-->
    <!--      {{ f.nickname }}-->
    <!--    </p>-->
    <!--    <h1>Debug</h1>-->
    <!--    <pre>{{ $store.getters.club }}</pre>-->
  </div>
</template>

<script>
import TournamentPreview from "~/components/Tournaments/TournamentPreview";
import CreateMatch from "~/components/Lobbies/CreateMatches";

export default {
  name: "tournaments",
  components: {TournamentPreview, CreateMatch},
  // data() {
  // },
  computed: {
    tournaments() {
      return this.$store.getters["tournaments/tournaments"];
    },
  },
  methods: {
    submitNewTournament() {
      this.$axios.$post('tournaments', this.tournament)
    },
  },
  mounted() {
    this.$store.dispatch("tournaments/fetchTournaments");
  },
};
</script>

<style scoped></style>

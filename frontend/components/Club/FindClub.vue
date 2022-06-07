<template>
  <div class="content">
    <div v-if="clubs === null">
      Loading...
    </div>
    <div v-else>
      <Banner
        v-for="c in clubs"
        :key="c._id"
        :title="c.name"
        :subtitle="c.players.length + ' players'"
        :buttons="
          !c.players.includes($auth.user._id)
          ? [{icon: 'login', emit: 'joinRequest'}]
          : (!$auth.user.club ? [ {icon: 'schedule'}]
                              : [ {icon: 'logout', emit: 'removeUser'}])"
        @joinRequest="joinRequest(c._id)"
        @removeUser="removeUser($auth.user._id)"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: "FindClubsPage",
  methods: {
    async joinRequest(clubID) { // TODO add message
      await this.$axios.$post('clubs/joinRequest?message=_&idClub=' + clubID);
    },
    async removeUser(userID) {
      await this.$axios.$delete('clubs/players/' + userID);
    },
  },
  mounted() {
    this.$store.dispatch("clubs/fetchClubs");
    // this.$store.dispatch("clubs/fetchMyClubs");
  },
  computed: {
    clubs() {
      return this.$store.getters['clubs/clubs'];
    },
    // myClub() {
    //   return this.$store.getters['clubs/myClub'];
    // },
    // isAdmin() {  // FIXME ?
    //   return this.myClub.players.find(p => p._id === this.$auth.user._id).isAdmin;
    // }
  },
}
</script>

<style scoped>

pre {
  overflow: scroll;
}
</style>

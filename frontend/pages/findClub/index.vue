<template>
  <div v-if="clubs === null">
    Loading...
  </div>
  <div v-else>
    <pre v-for="c in clubs">{{ c }}</pre>
    <van-button icon="add" to="findClub/newClub">{{ $t('new_club') }}</van-button>
  </div>
</template>

<script>
export default {
  name: "FindClubsPage",
  computed: {
    clubs() { return this.$store.getters["clubs/clubs"] }
  },
  mounted() {  // [vue] mounted: ad ogni visualizzazione, created: al ricaricamento
    this.$store.dispatch('clubs/fetchClubs')
  }
}
</script>

<style scoped>

</style>

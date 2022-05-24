<template>
  <div>
    <button @click="newLobby">New</button>
  </div>
</template>

<script>
export default {
  name: "LobbiesPage",
  methods: {
    newLobby() {
      this.$axios.$post('matches/lobby/new')
    }
  }
}
</script>

<style scoped>

</style>

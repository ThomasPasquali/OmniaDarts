<template>
  <div>
    <button @click="newLobby">New</button>
      <nuxt-link
        v-for="l in lobbies"
        :key="l._id"
        :to="`lobby/${l._id}`">
          {{l._id}}
      </nuxt-link>
  </div>
</template>

<script>
export default {
  name: "LobbiesPage",
  methods: {
    newLobby() {
      this.$axios.$post('matches/lobby/new')
    }
  },
  data() {
    return {
      lobbies: []
    }
  },
  async asyncData(ctx) {
    return { lobbies: await ctx.$axios.$get('matches') }
  },
}
</script>

<style scoped>

</style>

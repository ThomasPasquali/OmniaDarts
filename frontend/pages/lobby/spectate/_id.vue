<template>
  <div>
    <pre>{{match}}</pre>
  </div>
</template>

<script>
export default {
  name: "SpectateLobbyPage",
  data() {
    return {
      autoFetchInterval: null,
      id: null,
    }
  },
  computed: {
    match() { return this.$store.getters['lobbies/lobby'] }
  },
  async asyncData({params}) {
    const id = params.id
    return {id}
  },
  async mounted() {
    await this.fetchLobby()
    if (this.match) {
      this.sockets = {
        match: this.$store.getters.newIo(this, 'matches?matchID=' + this.id)
      }
      this.sockets.match.on('new_throw', newThrow => {
        console.log(newThrow)
      })
      console.log(this.sockets.match)
    }else alert('Could not fetch match')
  },
  methods: {
    async fetchLobby() {
      await this.$store.dispatch('lobbies/fetchLobby', this.id)
      //if (this.match) clearInterval(this.autoFetchInterval)
    },
  },
}
</script>

<style scoped>

</style>

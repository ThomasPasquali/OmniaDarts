<template>
  <div>
    <!-- <pre>{{match}}</pre> -->
    <div v-for="p in players" :key="p.nickname">
      <Banner
        :user="p"
        :title="p.nickname + ': ' + '42' + ' points'"
        :subtitle="'1, 2, 3'"
        :buttons="[]"
      />

<!--      <h1>{{ getNickname(p._id) }} throws</h1>-->
      <p v-if="getPlayerThrows(p._id)"
         v-for="t in getPlayerThrows(p._id)"
         :key="p.nickname">
        <span v-for="(d, i) in t.darts"
              :key="p.nickname+i">
          {{ d.doubleTriple + d.sector }}
        </span>
      </p>
    </div>

    <h1>Last</h1>
    <pre>{{ lastThrow }}</pre>
  </div>
</template>

<script>
import _ from 'lodash'

export default {
  name: "SpectateLobbyPage",
  data() {
    return {
      autoFetchInterval: null,
      id: this.$route.params.id,
    }
  },
  computed: {
    match() {
      return this.$store.getters['match/match']
    },
    players() {
      return this.$store.getters["match/players"]
    },
    lastThrow() {
      return this.$store.getters['match/lastThrow']
    }
  },
  async mounted() {
    console.log(this.id)
    await this.fetchMatch()
    console.log(this.match)
    if (this.match) {
      this.sockets = {
        match: this.$store.getters.newIo(this, 'matches?matchID=' + this.id)
      }
    } else {
      alert('Could not fetch match')
    }
  },
  methods: {
    async fetchMatch() {
      await this.$store.dispatch('match/fetch', this.id)
    },
    getNickname(id) {
      const res = _.find(this.players, {_id: id})
      return (res && res.nickname) || 'NOT_FOUND'
    },
    getPlayerThrows(userID) {
      return this.$store.getters["match/playerThrows"](userID)
    }
  },
}
</script>

<style scoped>

</style>

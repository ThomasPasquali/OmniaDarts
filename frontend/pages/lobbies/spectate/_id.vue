<template>
  <div>
    <h1>Spectate</h1>
    <!-- <pre>{{match}}</pre> -->
    <div v-for="p in players" :key="p.nickname">
      <Banner
        :user="p"
        :title="p.nickname+': '+getPlayerCurrentScore(p._id)"
        :subtitle="getPlayerLastThrow(p._id)"
        :buttons="[]"
      />

    </div>

    <h1>{{ $t('current_throw') }}</h1>
    <div v-if="lastThrow">
      <h2 class="throw">{{ lastThrow.nickname }}</h2>
      <p v-for="i in [0,1,2]" :key="'t'+i" class="throw">
        {{ lastThrow.darts[i] ? lastThrow.darts[i].doubleTriple + lastThrow.darts[i].sector : '...' }}
        {{ i === 2 ? '' : ' - '}}
      </p>
    </div>
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
      const t = this.$store.getters['match/lastThrow']
      return t && { nickname: this.getNickname(t.userID), darts: t.newThrow.darts }
    }
  },
  async mounted() {
    await this.fetchMatch()
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
    getPlayerCurrentScore(userID) {
      return this.$store.getters["match/playerCurrentScore"](userID)
    },
    getPlayerLastThrow(userID) {
      let t = this.$store.getters["match/playerLastThrow"](userID)
      return (t && t.darts) ? t.darts.map(d => d.doubleTriple+''+d.sector).join(' - ') : '/'
    }
  },
}
</script>

<style scoped>
p.throw, h2.throw {
  display: inline;
}
</style>

const legSet = state => state.leg+':'+state.set

export const state = () => ({
  match: null,
  tournamentMatch: null,
  lastThrow: null,
  set: 0,
  leg: 0
})

export const actions = {
  async fetchMatch({commit}, id) {
    commit('setMatch', await this.$axios.$get('matches/' + id))
  },
  async fetchTournamentMatch({commit}, id) {
    commit('setTournamentMatch', await this.$axios.$get('tournament-matches/' + id))
  },
}

export const mutations = {
  setMatch(state, match) {
    state.match = match
  },
  setTournamentMatch(state, match) {
    state.tournamentMatch = match
  },
  setLastThrow(state, t) {
    state.lastThrow = t
    //TODO add to match
  }
}

export const getters = {
  match(state) {
    return state.match
  },
  tournamentMatch(state) {
    return state.tournamentMatch
  },
  players(state) {
    return state.match && state.match.players
  },
  lastThrow(state) { return state.lastThrow },
  playerThrows: state => userID => {
  	console.log(state.match.playersThrows[userID])//FIXME tutta la struttura datiiiiiiii
      //, state.match.playersThrows[userID].playersThrows[legSet(state)])
    return state.match
      && state.match.playersThrows[userID]
      && state.match.playersThrows[userID].playersThrows[legSet(state)]
  },

}

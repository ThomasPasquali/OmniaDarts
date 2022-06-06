const legSet = state => state.leg+':'+state.set

export const state = () => ({
  match: null,
  lastThrow: null,
  set: 0,
  leg: 0
})

export const actions = {
  async fetch({commit}, id) {
    commit('setMatch', await this.$axios.$get('matches/' + id))
  },
}

export const mutations = {
  setMatch(state, match) {
    state.match = match
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

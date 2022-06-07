export const state = () => ({
  tournaments: [],
  tournamentMatches: [],
})

export const actions = {
  async fetchTournaments({commit}) {
    commit('setTournaments', await this.$axios.$get('tournaments'))
  },
  async fetchTournamentMatches({commit}, tournamentID) {
    commit('setTournamentMatches', await this.$axios.$get('tournament-matches/' + tournamentID))
  }
}

export const mutations = {
  setTournaments(state, tournaments) {
    state.tournaments = tournaments
  },
  setTournamentMatches(state, tournamentMatches) {
    state.tournamentMatches = tournamentMatches
  },
}

export const getters = {
  tournaments(state) {
    return state.tournaments
  },
  tournamentMatches(state) {
    return state.tournamentMatches
  },
}

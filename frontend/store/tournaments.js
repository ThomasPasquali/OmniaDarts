export const state = () => ({
  tournaments: [],
  tournamentID: null,
  tournamentMatches: [],
})

export const actions = {
  async fetchTournaments({commit}) {
    commit('setTournaments', await this.$axios.$get('tournaments'))
  },
  async fetchTournamentID({commit}, tournamentID) {
    commit('setTournamentID', await this.$axios.$get('tournaments/'+ tournamentID))
  },
  async fetchTournamentMatches({commit}, tournamentID) {
    commit('setTournamentMatches', await this.$axios.$get('tournament-matches/' + tournamentID))
  }
}

export const mutations = {
  setTournaments(state, tournaments) {
    state.tournaments = tournaments
  },
  setTournamentID(state, tournamentID) {
    state.tournamentID = tournamentID
  },
  setTournamentMatches(state, tournamentMatches) {
    state.tournamentMatches = tournamentMatches
  },
}

export const getters = {
  tournaments(state) {
    return state.tournaments
  },
  tournamentID(state) {
    return state.tournamentID
  },
  tournamentMatches(state) {
    return state.tournamentMatches
  },
}

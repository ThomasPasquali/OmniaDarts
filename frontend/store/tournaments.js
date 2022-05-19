export const state = () => ({
  tournaments: [],
})

export const actions = {
  async fetchTournaments({ commit }){
    commit('setTournaments', await this.$axios.$get('tournaments'))
  }
}

export const mutations = {
  setTournaments(state, tournaments) {
    state.tournaments = tournaments
  },
}

export const getters = {
  tournaments(state) { return state.tournaments },
}

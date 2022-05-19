export const state = () => ({
  clubs: null,  // null: valore inesistente, non fetched
  current: null,
})

export const actions = {
  async fetchClubs({ state, commit }) {
    commit('setClubs', await this.$axios.$get('clubs'))//FIXME
  },
  async createNew({ state, commit }, club) {
    console.log(await this.$axios.$post('clubs', club))
  }
}

export const mutations = {
  setClubs(state, clubs) {
    state.clubs = clubs
  },
}

export const getters = {
  clubs(state) { return state.clubs }
}

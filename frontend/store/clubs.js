export const state = () => ({
  clubs: null,
  myClub: null,
  current: null,
})

export const actions = {
  async fetchClubs({ state, commit }) {
    commit('setClubs', await this.$axios.$get('clubs'))
  },
  async fetchMyClub({ state, commit }) {
    commit('setMyClub', await this.$axios.$get('clubs/myClub'))
  },
  async createNew({ state, commit }, club) {
    console.log(await this.$axios.$post('clubs', club))
  }
}

export const mutations = {
  setClubs(state, clubs) {
    state.clubs = clubs
  },
  setMyClub(state, club) {
    state.myClub = club
  },
}

export const getters = {
  clubs(state) { return state.clubs },
  myClub(state) { return state.myClub },
}

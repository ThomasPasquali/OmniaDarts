export const state = () => ({
  user: null,
})

export const actions = {
  async fetchUser({commit}, userID) {
    if (!userID) {
      commit('setUser', this.$auth.user);
    } else {
      commit('setUser', await this.$axios.$get('users/' + userID));
    }
  },
}

export const mutations = {
  setUser(state, user) {
    state.user = user
  },
}

export const getters = {
  user(state) {
    return state.user
  },
}

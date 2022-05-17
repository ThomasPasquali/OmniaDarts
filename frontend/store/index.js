export const state = () => ({
  user: 'NO_USER',
})

export const actions = {
  setUser({ state, commit }, user){
    commit('setUser', user)
  }
}

export const mutations = {
  setUser(state, user) {
    state.user = user
  },
}

export const getters = {
  user(state) { return state.user }
}

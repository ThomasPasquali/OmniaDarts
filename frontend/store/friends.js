export const state = () => ({
  friends: [],
  clubFriends: [],
})

export const actions = {
  async fetchFriends({ commit }){
    commit('setFriends', await this.$axios.$get('friends'))
  }
}

export const mutations = {
  setFriends(state, friends) { state.friends = friends },
  setClubFriends(state, friends) { state.clubFriends = friends },
}

export const getters = {
  friends(state) { return state.friends },
  clubFriends(state) { return state.clubFriends },
}

export const state = () => ({
  friendRequests: [],
  users: [],
  clubFriends: [],
})

export const actions = {
  async fetchFriendRequests({ commit }){
    commit('setFriendRequests', await this.$axios.$get('friends'))
  },
  async fetchUsers({ commit }){
    commit('setUsers', await this.$axios.$get('users'))
  },
}

export const mutations = {
  setFriendRequests(state, friendRequests) { state.friendRequests = friendRequests },
  setUsers(state, users) { state.users = users },
  setClubFriends(state, friends) { state.clubFriends = friends },
}

export const getters = {
  friendRequests(state) { return state.friendRequests },
  users(state) { return state.users },
  clubFriends(state) { return state.clubFriends },
}

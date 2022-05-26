export const state = () => ({
  friendRequests: [],
  users: [],
  authUser: null,
  clubFriends: [],
})

export const actions = {
  async fetchFriendRequests({ commit }){
    commit('setFriendRequests', await this.$axios.$get('friends'))
  },
  async fetchUsers({ commit }){
    commit('setUsers', await this.$axios.$get('users'))
  },
  async fetchAuthUser({commit}) {
    commit('setAuthUser', this.$auth.user);
  }
}

export const mutations = {
  setFriendRequests(state, friendRequests) { state.friendRequests = friendRequests },
  setUsers(state, users) { state.users = users },
  setAuthUser(state, authUser) { state.authUser = authUser },
  setClubFriends(state, friends) { state.clubFriends = friends },
}

export const getters = {
  friendRequests(state) { return state.friendRequests },
  users(state) { return state.users },
  authUser(state) { return state.authUser },
  clubFriends(state) { return state.clubFriends },
}

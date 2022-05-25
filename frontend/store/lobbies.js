export const state = () => ({
  lobby: null,

  lobbies: [],
})

export const actions = {
  async fetchLobbies({ commit }) {
    commit('setLobbies', await this.$axios.$get('matches/lobbies'))
  },
  async fetchLobby({ commit }, id) {
    try {
      commit('setLobby', await this.$axios.$get('matches/'+id))
    }catch{
      commit('setLobby', null)
    }
  },
}

export const mutations = {
  newJoinRequest(state, request) {
    if(!state.lobby.lobby.joinRequests.find(r => r._id === request._id))
      state.lobby.lobby.joinRequests.push(request)
  },
  setLobbies(state, lobbies) {
    state.lobbies = lobbies
  },
  setLobby(state, lobby) {
    state.lobby = lobby
  },
}

export const getters = {
  lobby(state) { return state.lobby },
  lobbyJoinRequests(state) { return state.lobby.lobby.joinRequests },

  lobbies(state) { return state.lobbies },
}

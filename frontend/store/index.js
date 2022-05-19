export const state = () => ({
  club: null,
})

export const actions = {
  async fetchClub({ commit }) {
    try {
      let club = await this.$axios.$get('clubs/myClub')
      commit('friends/setClubFriends', club.players)
      delete club.players
      commit('setClub', club)
    }catch (e) {
      //console.error(e) //User does not belong to a club
    }
  }
}

export const mutations = {
  setClub(state, club) { state.club = club },
}

export const getters = {
  newIo: state => (app, channel) => {
    //if(!state.sockets[channel])state.sockets[channel] =
    return app.$nuxtSocket({
      channel,
      forceNew: false,
      persist: true,
      auth: { token: app.$auth.strategy.token.get() }
    })
    //return state.sockets[channel]
  },
  club(state) { return state.club }
}

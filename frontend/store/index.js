export const state = () => ({
  sockets: {},
})

export const actions = {
  action({ state, commit }, a){
    //commit('set', a)
  }
}

export const mutations = {
  set(state, a) {
  },
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
}

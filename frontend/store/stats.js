export const state = () => ({
  stats: []
  // usersCmp: [
  //   {
  //     name: 'Flamingo',
  //     stats: {
  //       'Win stats': {
  //         'Games played': 5,
  //         'Games won': 2,
  //         'Win rate': 5
  //       },
  //       'Set/Leg stats': {
  //         'Legs played': 7,
  //         'Legs won': 2,
  //         'Legs win rate': 28.57,
  //       }
  //     }
  //   },
  //   {
  //     name: 'Ciro',
  //     stats: {
  //       'Win stats': {
  //         'Games played': 31,
  //         'Games won': 9,
  //         'Win rate': 8,
  //       },
  //       'Set/Leg stats': {
  //         'Legs played': 5,
  //         'Legs won': 4,
  //         'Legs win rate': 37.20,
  //       }
  //     }
  //   },
  //   {
  //     name: 'Circzo',
  //     stats: {
  //       'Win stats': {
  //         'Games played': 31,
  //         'Games won': 9,
  //         'Win rate': 8,
  //       },
  //       'Set/Leg stats': {
  //         'Legs played': 5,
  //         'Legs won': 4,
  //         'Legs win rate': 37.20,
  //       }
  //     }
  //   }
  // ]
})

export const actions = {
  async fetchStats({commit}) {
    commit('setStats', await this.$axios.$get('statistics'));
  }
}

export const mutations = {
  setStats(state, stats) {
    state.stats = stats;
  }
}

export const getters = {
  stats(state) {
    return state.stats;
  }
}

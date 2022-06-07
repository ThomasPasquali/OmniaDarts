import {SetsLegs} from "~/enums/matches";

const legSet = state => state.leg+':'+state.set
const playerThrows = (state, userID) => {
  return state.match
    && state.match.playersThrows[userID]
    && state.match.playersThrows[userID].playerThrows[legSet(state)]
}

export const state = () => ({
  match: null,
  tournamentMatch: null,
  lastThrow: null,
  set: 0,
  leg: 0
})

export const actions = {
  async fetchMatch({commit}, id) {
    commit('setMatch', await this.$axios.$get('matches/' + id))
  },
  async fetchTournamentMatch({commit}, id) {
    commit('setTournamentMatch', await this.$axios.$get('tournament-matches/' + id))
  },
}

export const mutations = {
  setMatch(state, match) {
    state.match = match
  },
  setTournamentMatch(state, match) {
    state.tournamentMatch = match
  },
  setLastThrow(state, t) {
    state.lastThrow = t
    state.match.playersThrows[t.userID].playerThrows[legSet(state)].push(t.newThrow)
  },
  legWon(state, { nickname }) {
    if(state.match.winningMode.setsLegs === SetsLegs.Sets) {
      state.leg = (++state.leg)%3
      if(state.leg === 0){
        ++state.set
        alert(nickname+" won this set")//FIXME better UI
      }else
        alert(nickname+" won this leg")//FIXME better UI
    }else {
      ++state.leg
      alert(nickname+" won this leg")//FIXME better UI
    }
  },
  matchWon(state, { nickname }) {
    alert(nickname+" won the match")//FIXME better UI
    window.location.href = '/lobbies'
  },
}

export const getters = {
  match(state) {
    return state.match
  },
  tournamentMatch(state) {
    return state.tournamentMatch
  },
  players(state) {
    return state.match && state.match.players
  },
  lastThrow(state) { return state.lastThrow },

  playerCurrentScore: state => userID => {
    if(!state.match) return null

    let startScore = null
    switch (state.match.gamemode.name) {
      case 'X01':
        startScore = state.match.gamemode.settings.startScore
    }
    if(!startScore) return null

    const ts = playerThrows(state, userID)
    if(ts)
      for (const t of playerThrows(state, userID)) {
        startScore -= t.score
      }
    return startScore
  },

  playerLastThrow: state => userID => {
    const ts = playerThrows(state, userID)
    return ts && ts[ts.length-1]
  }

}

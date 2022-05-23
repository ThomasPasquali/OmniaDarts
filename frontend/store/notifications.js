import _ from 'lodash'

export const state = () => ({
  notifications: [],
  notificationUpdate: null,
})

export const actions = {
  sendUpdate({ state, commit }, { i, action }) {
    commit('sendUpdate', {notification: state.notifications[i], action})
  },
}

export const mutations = {
  addNew(state, notification) {
    state.notifications.push(notification)
  },
  dismiss(state, i) {
    state.notifications.splice(i, 1)
  },
  sendUpdate(state, update) {
    state.notificationUpdate = update
  },
  update(state, notification) {
    console.log(notification)
    let pred = { _id: notification._id }
    let i = _.findIndex(state.notifications, pred)
    if(i >= 0) state.notifications[i].state = notification.state
    state.updates = _.remove(state.updates, pred)
  }
}

export const getters = {
  notifications(state) { return state.notifications },
  update(state) { return state.notificationUpdate }
}

import _ from 'lodash'

export const state = () => ({
  notifications: [],
  notificationUpdate: null,
})

export const actions = {
  checkNotification({ state, commit }, { i, action }){
    commit('updateNotification', {notification: state.notifications[i], action})
  }
}

export const mutations = {
  addNew(state, notification) {
    state.notifications.push(notification)
  },
  updateNotification(state, update) {
    state.notificationUpdate = update
  },
  checked(state, notification) {
    console.log(notification)
    let pred = { id: notification.id }
    let i = _.findIndex(state.notifications, pred)
    if(i >= 0) state.notifications[i].state = notification.state
    state.updates = _.remove(state.updates, pred)
  }
}

export const getters = {
  notifications(state) { return state.notifications },
  update(state) { return state.notificationUpdate }
}

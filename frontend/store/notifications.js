import _ from 'lodash'
// TODO import { NotificationAction, NotificationState } from '/backend/src/enums/notifications';

export const state = () => ({
  notifications: [
    {
      title: "Title1",
      message: "Message1",
      state: 0,
      action: null,
      payload: null,
    },
    {
      title: "Title2",
      message: "Message2",
      state: 0,
      action: null,
      payload: null,
    },
    {
      title: "Title3",
      message: "Message3",
      state: 0,
      action: null,
      payload: null,
    },
  ],
  notificationUpdate: null,
})

export const actions = {
  checkNotification({state, commit}, {i, action}) {
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
    let pred = {id: notification.id}
    let i = _.findIndex(state.notifications, pred)
    if (i >= 0) state.notifications[i].state = notification.state
    state.updates = _.remove(state.updates, pred)
  }
}

export const getters = {
  notifications(state) {
    return state.notifications
  },
  update(state) {
    return state.notificationUpdate
  }
}

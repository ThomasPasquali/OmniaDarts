import _ from 'lodash'

export const state = () => ({
  chats: {},
  lastMessageSent: null,
})

export const actions = {
  newTextMessage({state, commit}, {id, text}) {
    if (text) {
      console.log('New message action', {id, text})
      let message = {
        id: Math.floor(Math.random() * 10),
        text,
        datetime: new Date(),
        sender: Math.random() > .5 ? '' : 'CAIO',//FIXME
        sent: false
      }
      commit('emitLastMessage', message)
      commit('newMessage', {chatID: id, message, isEvent: false})
    }
  }
}

export const mutations = {
  newChat(state, id) {
    if (!state.chats[id]) {
      console.log("Created chat " + id)
      state.chats[id] = {messages: [], /*TODO more props*/}
    }
  },
  newMessage(state, {chatID, message, isEvent = true}) {
    if (message.datetime instanceof String) message.datetime = new Date(message.datetime) //FIXME
    if (isEvent) {
      let i = _.findIndex(state.chats[chatID].messages, {id: message.id})
      if (i >= 0) state.chats[chatID] && (state.chats[chatID].messages[i].sent = true)
    } else
      state.chats[chatID] && state.chats[chatID].messages.push(message)
  },
  emitLastMessage(state, message) {
    state.lastMessageSent = message
  }
}

export const getters = {
  chat: state => id => {
    return state.chats[id]
  },
  lastMessageSent(state) {
    return state.lastMessageSent
  },
}

import _ from 'lodash'

export const state = () => ({
  chats: {},
  lastMessage: null,
})

export const actions = {
  newMessage({state, commit}, { chatID, text }) {
    if(text) {
      let message = {
        id: Math.floor(Math.random() * 10),
        chatID,
        text,
        datetime: new Date(),
        sender: this.$auth.user.nickname,
        sent: false
      }
      commit('emitLastMessage', message)
      //commit('newMessage', {chatID, message, isEvent: false})
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
  newMessage(state, message) {
    console.log("New message ", message)
    let date = new Date(message.datetime)
    message.datetime = date.toLocaleDateString() + ' - ' + date.toLocaleTimeString()
    //if (isEvent) {
      //let i = _.findIndex(state.chats[message.chatID].messages, {id: message.id})
      //if (i >= 0) state.chats[message.chatID] && (state.chats[message.chatID].messages[i].sent = true)
    //} else
      state.chats[message.chatID] && state.chats[message.chatID].messages.push(message)
  },
  emitLastMessage(state, message) {
    state.lastMessage = message
  }
}

export const getters = {
  chat: state => id => {
    return state.chats[id]
  },
  lastMessage(state) {
    return state.lastMessage
  },
}

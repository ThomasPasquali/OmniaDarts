import _ from 'lodash'

export const state = () => ({
  chats: {},
  lastMessageSent: null,
})

export const actions = {
  newTextMessage({state, commit}, {chatID, text, sender}) {
    let message = {
      text,
      datetime: new Date(),
      sender,
      sent: false
    }
    commit('emitLastMessage', message)
    commit('newTextMessage', { chatID, message, isEvent: false })
  }
}

export const mutations = {
  newChat(state, id) {
    if (!state.chats[id]) {
      console.log("Created chat " + id)
      state.chats[id] = {
        idCount: 0,
        messages: [],
        /*TODO more props*/
      }
    }
  },
  newTextMessage(state, {chatID, message, isEvent = true}) {
    if (message.datetime instanceof String) message.datetime = new Date(message.datetime) //FIXME
    const chat = state.chats[chatID]
    if(chat) {
      if (isEvent) {
        let i = _.findIndex(chat.messages, {id: message.id})
        if (i >= 0) {
          chat.messages[i].sender = message.sender
          chat.messages[i].sent = message.sent
          chat.idCount = Math.max(chat.idCount, message.id)
        }
      } else {
        chat.messages.push(message)
        message.id = chat.idCount
        chat.idCount = chat.idCount + 1
      }
    }
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

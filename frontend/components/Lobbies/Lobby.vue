<template>

  <div v-if="match !== null">
    <div v-if="isCurrentUserLobbyOwner()">
      <h1>Join requests</h1>
      <div v-for="req in joinRequests" :key="req._id">
        <p>{{ req.nickname }}</p>
        <van-button icon="success" @click="acceptJoinRequest(req)" />
        <van-button icon="cross" @click="rejectJoinRequest(req)" />
      </div>
    </div>

    <!-- <TextChat :id="match.lobby.chatID" @sendMessage="sendMessage"/> -->
    <h1>Match</h1>
    <h3>Players</h3>
    <div v-for="p in match.players" :key="p._id">
      <div v-if="p._id !== $auth.user._id">
        <p>{{ p.nickname }} {{ isUserLobbyOwner(p) ? '(owner)' : '' }}</p>
        <van-button v-if="isCurrentUserLobbyOwner()" @click="kick(p)">Kick</van-button>
      </div>
    </div>
    <h3>Description</h3>
    <pre>
      {{ match.winningMode }}
      {{ match.gamemode }}
    </pre>
    <div>
      <van-button v-if="isCurrentUserLobbyOwner()" @click="deleteLobby()">{{ $t('delete_lobby') }}</van-button>
      <van-button v-if="useAndroid" @click="play">{{ $t('lobby_play') }}</van-button>  <!-- TODO -->
    </div>
  </div>

  <CreateMatch v-else />

</template>

<script>
import TextChat from '~/components/Chat/TextChat';
import CreateMatch from "~/components/Lobbies/CreateMatch";

export default {
  name: 'Lobby',
  props: ['lobbyID'],
  components: {TextChat, CreateMatch},
  data() {
    return {
      autoFetchInterval: null,
      lobbyID_: this.lobbyID,
    }
  },
  computed: {
    match() {
      return this.$store.getters['lobbies/lobby']
    },
    joinRequests() {
      return this.$store.getters['lobbies/lobbyJoinRequests']
    },
    useAndroid() {
      return !!window.android;
    },
  },
  async mounted() {
    await this.fetchLobby()
    if (this.match) {
      this.sockets = {
        lobby: this.$store.getters.newIo(this, 'lobbies?lobbyID=' + this.lobbyID_)
      }
      this.sockets.lobby.on('lobby_kick', userID => {
        if (userID === this.$auth.user._id) {
          confirm('You have been kicked!')
          window.location.href = '/lobby'
        } else
          this.fetchLobby()
      })
      this.sockets.lobby.on('lobby_join_request_accepted', userID => {
        this.fetchLobby()
      })
      this.sockets.lobby.on('lobby_join_request_rejected', userID => {
        if (userID === this.$auth.user._id) {
          confirm('You have been rejected!')
          window.location.href = '/lobby'
        } else
          this.fetchLobby()
      })
    } else {
      // TODO could optimize (che sbatti...)
      this.autoFetchInterval = setInterval(this.fetchLobby, 3000)
    }
  },
  methods: {
    async fetchLobby() {
      if (this.lobbyID_) {
        await this.$store.dispatch('lobbies/fetchLobby', this.lobbyID_)
        if (this.match) clearInterval(this.autoFetchInterval)
      }
    },
    back() {
      window.history.go(-1)
    },
    isCurrentUserLobbyOwner() {
      return this.match.lobby.owner._id === this.$auth.user._id
    },
    isUserLobbyOwner(u) {
      return this.match.lobby.owner._id === u._id
    },
    async acceptJoinRequest(req) {
      try {
        await this.$axios.$patch(`matches/lobby/joinRequest/${req._id}`)
        await this.fetchLobby()
      } catch {
        alert('Cannot accept join request')
      }
    },
    async rejectJoinRequest(req) {
      try {
        await this.$axios.$delete(`matches/lobby/joinRequest/${req._id}`)
        await this.fetchLobby()
      } catch {
        alert('Cannot reject join request')
      }
    },
    async kick(player) {
      try {
        await this.$axios.$delete(`matches/lobby/player/${player._id}`)
        await this.fetchLobby()
      } catch {
        alert('Cannot kick player')
      }
    },
    async deleteLobby() {
      try {
        await this.$axios.$delete(`matches/${this.lobbyID_}`)
        await this.fetchLobby()
      } catch {
        alert('Cannot delete lobby')
      }
    },
    play() {
      if (window.android) window.android.play(JSON.stringify(this.match))
    }
  }
}
</script>

<style scoped>

</style>

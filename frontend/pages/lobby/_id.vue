<template>
  <Lobby :lobbyID="this.lobbyID"/>
</template>

<script>
// import TextChat from "~/components/Chat/TextChat";
import Lobby from "~/components/Lobby";

export default {
  name: "SpecificLobbyPage",
  components: {Lobby},
  data() {
    return {
      autoFetchInterval: null,
      lobbyID: this.$route.params.id,
    }
  },
  // computed: {
  //   match() {
  //     return this.$store.getters['lobbies/lobby']
  //   },
  //   joinRequests() {
  //     return this.$store.getters['lobbies/lobbyJoinRequests']
  //   }
  // },
  // async mounted() {
  //   await this.fetchLobby()
  //   if (this.match) {
  //     this.sockets = {
  //       lobby: this.$store.getters.newIo(this, 'lobbies?lobbyID=' + this.lobbyID)
  //     }
  //     this.sockets.lobby.on('lobby_kick', userID => {
  //       if (userID === this.$auth.user._id) {
  //         confirm('You have been kicked!')
  //         window.location.href = '/lobby'
  //       } else
  //         this.fetchLobby()
  //     })
  //     this.sockets.lobby.on('lobby_join_request_accepted', userID => {
  //       this.fetchLobby()
  //     })
  //     this.sockets.lobby.on('lobby_join_request_rejected', userID => {
  //       if (userID === this.$auth.user._id) {
  //         confirm('You have been rejected!')
  //         window.location.href = '/lobby'
  //       } else
  //         this.fetchLobby()
  //     })
  //   } else {
  //     //TODO could optimize (che sbatti...)
  //     this.autoFetchInterval = setInterval(this.fetchLobby, 3000)
  //   }
  // },
  // methods: {
  //   async fetchLobby() {
  //     await this.$store.dispatch("lobbies/fetchLobby", this.id)
  //     if (this.match) clearInterval(this.autoFetchInterval)
  //   },
  //   back() {
  //     window.history.go(-1)
  //   },
  //   isCurrentUserLobbyOwner() {
  //     return this.match.lobby.owner._id === this.$auth.user._id
  //   },
  //   isUserLobbyOwner(u) {
  //     return this.match.lobby.owner._id === u._id
  //   },
  //   async acceptJoinRequest(req) {
  //     try {
  //       await this.$axios.$patch(`matches/lobby/joinRequest/${req._id}`)
  //       await this.fetchLobby()
  //     } catch {
  //       alert('Cannot accept join request')
  //     }
  //   },
  //   async rejectJoinRequest(req) {
  //     try {
  //       await this.$axios.$delete(`matches/lobby/joinRequest/${req._id}`)
  //       await this.fetchLobby()
  //     } catch {
  //       alert('Cannot reject join request')
  //     }
  //   },
  //   async kick(player) {
  //     try {
  //       await this.$axios.$delete(`matches/lobby/player/${player._id}`)
  //       await this.fetchLobby()
  //     } catch {
  //       alert('Cannot kick player')
  //     }
  //   },
  // }
}
</script>

<style scoped>

</style>

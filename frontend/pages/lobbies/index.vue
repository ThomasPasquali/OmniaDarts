<template>
  <van-tabs v-model:active="active">

    <van-tab :title="$t('all_lobbies')">
      <h1>{{ $t('all_lobbies') }}</h1>
      <!--      <pre v-for="m in lobbies">{{m}}</pre>-->
      <div v-if="lobbies">
        <div v-if="lobbies.length">
          <Banner
            v-for="m in lobbies"
            :key="m._id"
            :title="m.lobby.owner.nickname"
            :subtitle="m.gamemode.settings.startScore /* TODO */"
            :user="m.lobby.owner"
            :buttons="[{
                  icon: 'visibility',
                  text: 'Spectate',
                  emit: 'spectateLobby',
              },
              (m.lobby.joinRequests.filter(u => u._id === $auth.user._id).length
              ? { icon: 'schedule',
                  text: '',
                  emit: '',
                  disabled: true }
              : (!!currentUserLobby && m._id === currentUserLobby._id
              ? { icon: '',
                  text: 'My lobby',
                  emit: '',
                  disabled: true }
              : { icon: 'login',
                  text: m.lobby.isPublic ? 'Join' : 'Request',
                  emit: 'joinLobby',
                  disabled: !!currentUserLobby }))
            ]"
            @joinLobby="joinLobby(m)"
            @spectateLobby="spectateLobby(m._id)"
          />
        </div>
        <div v-else>There are no lobbies yet</div>
      </div>
      <div v-else>Loading...</div>
    </van-tab>

    <!--     TODO ? -->
    <van-tab :title="$t('live_matches')">
      <h1>{{ $t('live_matches') }}</h1>
    </van-tab>

    <van-tab :title="$t('my_lobby')">
      <h1>{{ $t('my_lobby') }}</h1>
      <div v-if="!!currentUserLobby">
        <Lobby :lobbyID="currentUserLobby._id" />
      </div>
      <div v-else>
        <CreateLobby />
      </div>
    </van-tab>

  </van-tabs>

</template>

<script>
import Banner from '~/components/Banner';
import Lobby from '~/components/Lobbies/Lobby';
import CreateLobby from "~/components/Lobbies/CreateLobby";

export default {
  name: "LobbiesPage",
  components: {Banner, Lobby, CreateLobby},
  data() {
    return {
      active: 0,
    };
  },
  methods: {
    async joinLobby(match) {
      if (!this.isCurrentUserLobbyOwner(match) || !this.doesCurrentUserBelongToLobby(match)) {
        try {
          await this.$axios.$post('matches/lobby/joinRequest/' + match._id)
        } catch {
        }
      }
      // this.$router.go();
    },
    async spectateLobby(matchID) {
      window.location.href = `/lobbies/spectate/${matchID}`;
      // if (!this.isCurrentUserLobbyOwner(match) || !this.doesCurrentUserBelongToLobby(match)) {
      //   try {
      //     await this.$axios.$post('matches/lobby/joinRequest/' + match._id)
      //   } catch {
      //   }
      // }
      // this.$router.go();
    },
    isCurrentUserLobbyOwner(match) {
      return match ? match.lobby.owner._id === this.$auth.user._id : false;
    },
    doesCurrentUserBelongToLobby(match) {
      return match.players.includes(this.$auth.user._id)
    },
  },
  mounted() {
    this.$store.dispatch("lobbies/fetchLobbies")
    // this.$nextTick(() => {
    //   document.querySelector(".van-picker__columns").style.maxHeight = "4rem";
    // })
  },
  computed: {
    lobbies() {
      return this.$store.getters["lobbies/lobbies"]
    },
    currentUserLobby() {  // FIXME endpoint [dv]
      for (let i in this.lobbies) {
        let m = this.lobbies[i];
        if (this.doesCurrentUserBelongToLobby(m) || this.isCurrentUserLobbyOwner(m)) {
          return m;
        }
      }
      return null;
    },
  },
}
</script>


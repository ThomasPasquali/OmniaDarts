<template>
  <van-tabs v-model:active="active">

    <van-tab :title="$t('my_lobby')">
      <h1>{{ $t('my_lobby') }}</h1>
      <div v-if="currentUserLobby()">
        <Lobby :lobbyID="currentUserLobby()._id" />
      </div>
      <div v-else>
        <van-button @click="newLobby">New</van-button>
      </div>
      <pre>{{ currentUserLobby() }}</pre>
    </van-tab>

    <van-tab :title="$t('all_lobbies')">
      <h1>{{ $t('all_lobbies') }}</h1>
      <div v-if="lobbies">
        <div>
          <Banner
            v-for="m in lobbies"
            v-if="m._id != isCurrentUserLobbyOwner(m)._id"
            :key="m._id"
            :title="(m.lobby.isPublic ? 'Join' : 'Request') + ' - ' + m.lobby.owner.nickname"
            :user="m.lobby.owner"
            @click="joinLobby(m)"
          >
            {{

            }}
          </Banner>
        </div>
      </div>
      <div v-else>Loading...</div>
    </van-tab>

    <!--    <van-tab title="Search">-->
    <!--      <van-search v-model="search" :placeholder="$t('search_user')" />-->
    <!--      <Banner-->
    <!--        v-for="u in users.filter(us => {return us.nickname.includes(search) && us._id !== authUser._id})"-->
    <!--        :key="u._id"-->
    <!--        :user="u"-->
    <!--        :buttons="-->
    <!--            [{-->
    <!--              icon: 'friends-o',-->
    <!--              emit: 'sendRequest',-->
    <!--            }]-->
    <!--          "-->
    <!--        @acceptFriend="acceptFriend(u._id)"-->
    <!--        @deleteFriend="deleteFriend(u._id)"-->
    <!--        @sendRequest="sendRequest(u._id)"-->
    <!--      />-->
    <!--    </van-tab>-->

  </van-tabs>

</template>

<script>
import {GamemodeName, X01Settings, CheckInOut, FirstBest, SetsLegs} from "~/enums/matches";
import Banner from '~/components/Banner';
import Lobby from '~/components/Lobby';

export default {
  name: "LobbiesPage",
  components: {Banner, Lobby},
  data() {
    return {
      active: 0,
      search: '',
    };
  },
  methods: {
    async newLobby() {
      try {
        await this.$axios.$post('matches/lobby/new', {
          gamemode: {
            name: GamemodeName.X01,
            settings: new X01Settings(
              501,
              CheckInOut.Straight,
              CheckInOut.Double,
            ),
          },
          winningMode: {
            goal: 3,
            firstBest: FirstBest.First,
            setsLegs: SetsLegs.Legs,
          },
          lobby: {
            isPublic: false,
          },
        })
        await this.$store.dispatch("lobbies/fetchLobbies")
      } catch {
        alert('Cannot create lobby')
      }
    },
    async joinLobby(match) {  // fixme redirect ? [dv]
      if (!this.isCurrentUserLobbyOwner(match) || !this.doesCurrentUserBelongToLobby(match))
        try {
          await this.$axios.$post('matches/lobby/joinRequest/' + match._id)
        } catch {
        }
      window.location.href = `/lobby/${match._id}`
    },
    isCurrentUserLobbyOwner(match) {
      return match && match.lobby.owner._id === this.$auth.user._id;
    },
    doesCurrentUserBelongToLobby(match) {
      return match.players.includes(this.$auth.user._id)
    },
    currentUserLobby() {  // FIXME endpoint [dv]
      for (let i in this.lobbies) {
        let m = this.lobbies[i];
        // alert(this.doesCurrentUserBelongToLobby(m))
        if (this.doesCurrentUserBelongToLobby(m) || this.isCurrentUserLobbyOwner(m)) {
          return m;
        }
      }
      return false;
    }
  },
  mounted() {
    this.$store.dispatch("lobbies/fetchLobbies")
  },
  computed: {
    lobbies() {
      return this.$store.getters["lobbies/lobbies"]
    },
  }
}
</script>

<style scoped>

</style>

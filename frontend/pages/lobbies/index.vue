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
        <p>{{ $t('user_has_no_lobby') }}</p>

        <van-form @submit="newLobby">
          <div class="radio-row" v-for="(f, i) in fields">
            <p v-if="f.title !== 'Sets/Legs'">{{ f.title }}</p>
            <van-field :name="f.title">
              <template #input>
                <van-radio-group class="radio-group" v-model="checked[i]">
                  <van-grid :column-num="f.values.length">
                    <van-grid-item v-for="v in f.values">
                      {{ v === 'custom' ? '' : v }}
                      <van-stepper v-if="v === 'custom'" v-model="customStartPoint" />
                      <van-radio :name="v" />
                    </van-grid-item>
                  </van-grid>
                </van-radio-group>
              </template>
            </van-field>
          </div>

          <van-field name="goal" label="Goal">
            <template #input>
              <van-stepper v-model="goal" />
            </template>
          </van-field>

          <van-field name="private" label="Private">
            <template #input>
              <van-switch v-model="isPrivate" size="20" />
            </template>
          </van-field>

          <van-button round block>Create</van-button>
        </van-form>
      </div>
    </van-tab>

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
    let fields_ = [{
      title: 'Start point',
      values: [301, 501, 'custom'],
      defaultIndex: 0,
    }, {
      title: 'Check in',
      values: ['Straight', 'Double', 'Triple', 'Master'],
      defaultIndex: 0,
    }, {
      title: 'Check out',
      values: ['Straight', 'Double', 'Triple', 'Master'],
      defaultIndex: 0,
    }, {
      title: 'Winning mode',
      values: ['First of', 'Best of'],
      defaultIndex: 0,
    }, {
      title: 'Sets/Legs',
      values: ['Sets', 'Legs'],
      defaultIndex: 0,
    }];
    let defaultValues = [];
    for (let f in fields_) {
      defaultValues.push(fields_[f].values[fields_[f].defaultIndex]);
    }
    return {
      active: 0,
      fields: fields_,
      customStartPoint: 11,
      goal: 3,
      checked: defaultValues,
      isPrivate: true,
    };
  },
  methods: {
    async newLobby(values) {
      try {
        await this.$axios.$post('matches/lobby/new', {
          gamemode: {
            name: GamemodeName.X01,
            settings: new X01Settings(
              values['Start point'] === 'custom' ? this.customStartPoint : values['Start point'],
              values['Check in'].toLowerCase(),
              values['Check out'].toLowerCase(),
            ),
          },
          winningMode: {
            goal: this.goal,
            firstBest: values['Winning mode'],
            setsLegs: values['Sets/Legs'],
          },
          lobby: {
            isPublic: !this.isPrivate,
          },
        })
        await this.$store.dispatch("lobbies/fetchLobbies")
      } catch {
        alert('Cannot create lobby')
      }
    },
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

<style scoped>
.radio-group {
  width: 100%;
}

.radio-row > p {
  margin-top: .4rem;
  margin-bottom: .1rem;
}

</style>

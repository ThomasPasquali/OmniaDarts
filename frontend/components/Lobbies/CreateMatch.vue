<template>
  <div>

    <p v-if="!isTournament">{{ $t('user_has_no_lobby') }}</p>

    <van-form @submit="submitCreate">

      <van-cell-group v-if="!!isTournament" inset>
        <van-field v-model="tournament.name" label="Name" placeholder="Tournament name" />
      </van-cell-group>

      <div>
        <h3>Match settings</h3>
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

        <van-field v-if="!isTournament" name="private" label="Private">
          <template #input>
            <van-switch v-model="isPrivate" size="20" />
          </template>
        </van-field>
      </div>

      <div v-if="!!isTournament">
        <h3>Players</h3>
        <div>
          <Banner
            v-for="f in $auth.user.friendRequests.filter(fr => !fr.pending)"
            :key="f.user._id + update"
            :user="f.user"
            :title="f.user.nickname"
            :subtitle="f.user.firstname + ' ' + f.user.lastname"
            :buttons="[{
              icon: selectedUsers.has(f.user._id) ? 'check_box' : 'check_box_outline_blank',
              emit: 'selectUser'
            }]"
            @selectUser="selectUser(f.user._id)"
          />
        </div>
      </div>

      <van-button round block>Create</van-button>
    </van-form>
  </div>
</template>

<script>
import {GamemodeName, X01Settings, CheckInOut, FirstBest, SetsLegs} from "~/enums/matches";

export default {
  name: "CreateMatch",
  props: ['isTournament'],
  data() {
    let fields_ = [{
      title: 'Start point',
      values: [301, 501, 'custom'],
    }, {
      title: 'Check in',
      values: ['Straight', 'Double', 'Triple', 'Master'],
    }, {
      title: 'Check out',
      values: ['Straight', 'Double', 'Triple', 'Master'],
    }, {
      title: 'Winning mode',
      values: ['First of', 'Best of'],
    }, {
      title: 'Sets/Legs',
      values: ['Sets', 'Legs'],
    }];
    let defaultValues = [];
    for (let f in fields_) {
      defaultValues.push(fields_[f].values[0]);
    }
    return {
      fields: fields_,
      customStartPoint: 11,
      goal: 3,
      checked: defaultValues,
      isPrivate: true,

      tournament: {
        name: '',
        randomOrder: true,
        type: "League",
        gamemode: "X01",
        winningMode: {
          goal: 0,
          firstBest: "First of",
          setsLegs: "Sets"
        },
        idPlayers: [],
        idClub: null
      },

      selectedUsers: new Set(),
      update: 0,
    };
  },
  methods: {
    selectUser(userID) {
      if (this.selectedUsers.has(userID)) {
        this.selectedUsers.delete(userID);
      } else {
        this.selectedUsers.add(userID);
      }
      this.update++;
    },
    async submitCreate(values) {
      if (!this.isTournament) {
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
      } else {
        let tournament = {
          name: this.tournament.name,
          randomOrder: true,
          idPlayers: Array.from(this.selectedUsers),
          idClub: null,
          type: 'League',
          gamemode: 'X01',
          winningMode: {
            goal: this.goal,
            firstBest: values['Winning mode'],
            setsLegs: values['Sets/Legs'],
          },
        };
        alert(JSON.stringify(tournament, null, 4));
        try {
          await this.$axios.$post('tournaments', tournament)
          // await this.$store.dispatch("lobbies/fetchLobbies")
        } catch {
          // alert('Cannot create tournament')  // FIXME ?
        }
      }
    },
  }
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

.stepper {
  display: flex;
  flex-direction: row;
}
</style>

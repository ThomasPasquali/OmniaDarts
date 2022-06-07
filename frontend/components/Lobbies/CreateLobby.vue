<template>
  <div>
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
</template>

<script>
import {GamemodeName, X01Settings, CheckInOut, FirstBest, SetsLegs} from "~/enums/matches";

export default {
  name: "LobbiesPage",
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

.stepper {
  display: flex;
  flex-direction: row;
}
</style>

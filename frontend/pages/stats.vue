<template>
  <div class="container">

    <table class="thead">
      <tr>
        <td></td>
        <td v-for="user in users" :key="user.name">{{ user.name }}</td>
      </tr>
    </table>

    <van-collapse v-model="activeNames">
      <van-collapse-item
        v-for="group in Object.entries(users[0].stats)"
        :key="group[0]"
        :title="group[0]">
        <table>
          <tr v-for="stat in Object.keys(group[1])" :key="stat">
            <td style="color: #0f69ff">{{ stat }}</td>
            <td style="color: #04AA6D" v-for="user in users" :key="user.name">{{ user.stats[group[0]][stat] }}</td>
          </tr>
        </table>
      </van-collapse-item>
    </van-collapse>

  </div>
</template>

<script>
export default {
  name: 'stats',
  methods: {},
  data() {
    return {
      activeNames: [],
      users: [
        {
          name: 'Flamingo',
          stats: {
            'Win stats': {
              'Games played': 5,
              'Games won': 2,
              'Win rate': 5
            },
            'Set/Leg stats': {
              'Legs played': 7,
              'Legs won': 2,
              'Legs win rate': 28.57,
            }
          }
        },
        {
          name: 'Ciro',
          stats: {
            'Win stats': {
              'Games played': 31,
              'Games won': 9,
              'Win rate': 8,
            },
            'Set/Leg stats': {
              'Legs played': 5,
              'Legs won': 4,
              'Legs win rate': 37.20,
            }
          }
        },
        {
          name: 'Circzo',
          stats: {
            'Win stats': {
              'Games played': 31,
              'Games won': 9,
              'Win rate': 8,
            },
            'Set/Leg stats': {
              'Legs played': 5,
              'Legs won': 4,
              'Legs win rate': 37.20,
            }
          }
        }
      ]
    }
  }
};

</script>


<style scoped>

table {
  width: 100%;
  table-layout: fixed;
}

.thead {
  padding: 16px;
  /*.van-collapse-item; fixme less */
}
.thead td {
  font-size: .8rem;  /* fixme non si rimpicciolisce di più */
}

td:first-child {
  width: 8rem;
}

</style>

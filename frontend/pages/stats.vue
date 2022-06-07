<template>
  <div class="container">

    <pre>{{ stats }}</pre>
<!--    <table class="thead">-->
<!--      <tr>-->
<!--        <td></td>-->
<!--        <td v-for="user in users" :key="user.name">{{ user.name }}</td>-->
<!--      </tr>-->
<!--    </table>-->

<!--    <van-collapse v-model="activeNames">-->
<!--      <van-collapse-item-->
<!--        v-for="group in Object.entries(users[0].stats)"-->
<!--        :key="group[0]"-->
<!--        :title="group[0]">-->
<!--        <table>-->
<!--          <tr v-for="stat in Object.keys(group[1])" :key="stat">-->
<!--            <td style="color: #0f69ff">{{ stat }}</td>-->
<!--            <td style="color: #04AA6D" v-for="user in users" :key="user.name">{{ user.stats[group[0]][stat] }}</td>-->
<!--          </tr>-->
<!--        </table>-->
<!--      </van-collapse-item>-->
<!--    </van-collapse>-->

  </div>
</template>


<script>
export default {
  name: 'stats',
  data() {
    return {
      activeNames: []
    }
  },
  async mounted() {
    await this.$store.dispatch("stats/fetchStats");
  },
  computed: {
    stats() {
      return this.$store.getters['stats/stats'];
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
  text-align: left;
}

td {
  text-align: right;
}

</style>

<template>
  <div class="container">


    <!-- <nuxt-link
      v-for="locale in availableLocales"
      :key="locale.code"
      :to="switchLocalePath(locale.code)">{{ locale.name }}</nuxt-link> -->

    <van-button v-if="$auth.user.club" type="primary" size="large" to="club">Club</van-button>
    <van-button type="primary" size="large" to="findClub">Find club</van-button>
    <van-button type="primary" size="large" to="tournaments">Tornei</van-button>
    <van-button type="primary" size="large" to="lobby">Lobbies</van-button>
    <van-button type="primary" size="large" to="dev">Dev</van-button>



  </div>
</template>

<script>
export default {
  name: 'HomePage',
  layout: 'home',
  computed: {
    availableLocales () {
      return this.$i18n.locales
    },
  },
  //Could be created
  mounted() {
    this.$store.dispatch('fetchClub')
    this.$store.dispatch('friends/fetchFriends')
  }
}
</script>

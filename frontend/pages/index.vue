<template>
  <div class="container">


    <!-- <nuxt-link
      v-for="locale in availableLocales"
      :key="locale.code"
      :to="switchLocalePath(locale.code)">{{ locale.name }}</nuxt-link> -->

    <van-button type="primary" size="large" to="club">{{$auth.user.club?'Club':'Find club'}}</van-button>
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
  data() {
    return { user: null }
  },
  watch: {
    user(user) {
      if(window && window.android && window.android.login) {
      	  window.localStorage.setItem('user', user)
      	  window.android.login(window.localStorage.getItem('auth._token.local'), JSON.stringify(user))
        }//else alert('NOPE')
     }
  },
  mounted() {
    this.user = this.$auth.user
  },
  created() {
    this.$store.dispatch('fetchClub')
    this.$store.dispatch('friends/fetchFriends')

  },
}
</script>

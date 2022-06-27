<template>
  <div class="container">


    <!-- <nuxt-link
      v-for="locale in availableLocales"
      :key="locale.code"
      :to="switchLocalePath(locale.code)">{{ locale.name }}</nuxt-link> -->

    <!-- TODO -->
    <van-button type="primary" size="large" to="club">Club</van-button>
    <van-button type="primary" size="large" to="friends">Friends</van-button>
    <van-button type="primary" size="large" to="tournaments">Tournaments</van-button>
    <van-button type="primary" size="large" to="lobbies">Lobbies</van-button>
<!--    <van-button type="primary" size="large" to="dev">Dev</van-button>-->
<pre>{{$auth.user}}</pre>
  </div>

</template>

<script>
export default {
  name: 'HomePage',
  layout: 'home',
  computed: {
    availableLocales() {
      return this.$i18n.locales
    },
  },
  mounted() {
    console.log("user logged",this.$auth)
      if (window && window.android && window.android.login) {
        window.android.login(window.localStorage.getItem('auth._token.local'), JSON.stringify(this.$auth.user))
      }
  },
  watch: {
    user(user) {
      console.log('Waassapp')
      setTimeout(() => {
        if (window && window.android && window.android.login) {
          window.localStorage.setItem('user', user)
          window.android.login(window.localStorage.getItem('auth._token.local'), JSON.stringify(user))
        } else alert('NOPE')
      }, 3000)
    }
  },
}
</script>

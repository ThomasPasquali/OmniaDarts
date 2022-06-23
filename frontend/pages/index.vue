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
      if (window && window.android && window.android.login) {
        let user = {
          name: 'palo',
          _id: 'pollo'
        }
        console.log("user logged")
        window.localStorage.setItem('user', user)
        window.android.login('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImYiLCJzdWIiOiI2Mjk5MWYwNzBjMmJhZGE4YzU2MDNmNzIiLCJpYXQiOjE2NTU2NjU3OTIsImV4cCI6MTY1Njg5OTM5Mn0.iL-KG3zQLkRV37d99gUuUZcSh9HyVElEHi2P8fvFNsw',
          '{"_id": "62991f070c2bada8c5603f72","nickname": "f","firstname": "","imageUrl": "https://cdn.jsdelivr.net/npm/@vant/assets/icon-demo.png","club": null,"isAdmin": false}')
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

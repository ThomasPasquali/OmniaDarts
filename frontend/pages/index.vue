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
      if (window && window.android && window.android.login) {
        let user = {
          name: 'palo',
          _id: 'pollo'
        }
        console.log("user logged")
        window.localStorage.setItem('user', user)
        window.android.login('Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImEiLCJzdWIiOiI2Mjk5Y2ZjMGVhY2E4YmQ4OGMyNmQ5MmIiLCJpYXQiOjE2NTU2NzA4MDcsImV4cCI6MTY1NjkwNDQwN30.WD0Iw2Y_6SYYJpRbXqTByzIe7Obt3pedNINGuVZE4NM',
          '{"_id": "6299cfc0eaca8bd88c26d92b","nickname": "a","firstname": "","imageUrl": "https://www.google.com/search?q=funny+images&sxsrf=ALiCzsat-mwHjZUgMXXMezONtIumdFbYRQ:1655670937300&tbm=isch&source=iu&ictx=1&vet=1&fir=reeA1DN2wr7d-M%252Cu8TG4n0BCLIJlM%252C_%253Bl4DZwqRrmJ1ztM%252CmYp30vKTPrwjdM%252C_%253BFQOuadU2lKP7_M%252CN_OhQZbnpZGkxM%252C_%253BG8u2guoeIMRmkM%252CsYpYylrj26dpBM%252C_%253BkFeW-KTI5llFPM%252CPwwD24Ot10RpPM%252C_%253BqDBuxN6FoWK4EM%252CFvYi-YR58g5DeM%252C_%253BVkN_RAWeOJcVDM%252Cf2twI4GHHmeRqM%252C_%253B68sYEbDPiE_KWM%252Cu8TG4n0BCLIJlM%252C_%253BSYYdjnkVZhFKDM%252C4bDBGjluLdk1HM%252C_%253BTZ3zPAK-_8ZC2M%252CIYe722_ft9NDUM%252C_%253B5xJW29CzVH80BM%252CJwP_JmSIjvczWM%252C_%253BHVJSnv7Q71hfRM%252Cv4ik2aliP1qMaM%252C_%253BkPwcemRgF5H-dM%252CvzCPwpAcn4k-ZM%252C_%253BzIluHF4Bf46CGM%252CN_OhQZbnpZGkxM%252C_%253B08KZe6TeTSmiTM%252CIYe722_ft9NDUM%252C_&usg=AI4_-kTTdsO5G6TbuBjUtpML24505pM0Uw&sa=X&ved=2ahUKEwjpmtTwrrr4AhXZ8LsIHVIvBHUQ9QF6BAgZEAE#imgrc=FQOuadU2lKP7_M","club": null,"isAdmin": false,}')
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

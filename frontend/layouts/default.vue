<template>
  <div class="h-100">

    <van-nav-bar
      :title="title"
      fixed
      placeholder
      safe-area-inset-top
      left-arrow
      @click-left="back">
      <template #right>
        <AppbarMenu />
        <!--        <van-icon name="https://cdn.jsdelivr.net/npm/@vant/assets/icon-demo.png" />-->
        <!--        {{ ($auth.user && $auth.user.nickname) || 'NO_USER' }}-->
      </template>
    </van-nav-bar>
    <Nuxt class="h-100" />

  </div>
</template>

<script>
import AppbarMenu from "~/components/AppbarMenu";

export default {
  name: 'DefaultLayout',
  components: {AppbarMenu},
  methods: {
    back() {
      window.history.back()
    },
  },
  computed: {
    title() {
      //dev/notifications --> Dev Notifications
      //findClub --> Find club
      let path = this.$route.path
      return `${path.split('/').at(-1)
        .replace(/([A-Z])/g, function (str) {
          return ' ' + str.toLowerCase();
        })
        .replace(/^./, function (str) {
          return str.toUpperCase();
        })}`
    }
  }
}
</script>

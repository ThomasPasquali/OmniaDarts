<template>
  <div class="h-100">
    <div v-if="!$auth.loggedIn">
      <van-nav-bar title="Omnia Darts Login" />
    </div>
    <div v-else-if="$route.path === '/'">
      <van-nav-bar
        title="Omnia Darts"
        right-text="Logout"
        @click-right="logout">

        <template #left>
          <van-icon name="https://cdn.jsdelivr.net/npm/@vant/assets/icon-demo.png" />{{$auth.user.nickname}}
        </template>

      </van-nav-bar>
    </div>
    <div v-else>
      <!-- FIXME <van-nav-bar
        :title="$route.path"
        left-arrow
        @click-left="back">
        <template #right>
          <van-icon name="https://cdn.jsdelivr.net/npm/@vant/assets/icon-demo.png" />{{$auth.user.nickname}}
        </template>
      </van-nav-bar>-->

    </div>
    <Nuxt class="h-100" />
  </div>
</template>

<script>
export default {
  name: 'DefaultLayout',
  methods: {
    logout() {
      this.$auth.logout()
    },
    back() { window.history.back() }
  }
}
</script>

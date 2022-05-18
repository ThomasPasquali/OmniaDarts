<template>
  <div class="h-100">
    <van-nav-bar
      title="Omnia Darts"
      right-text="Logout"
      @click-right="logout">

      <template #left>
        <van-icon name="https://cdn.jsdelivr.net/npm/@vant/assets/icon-demo.png" />{{$auth.user.nickname}}
      </template>
    </van-nav-bar>
    <Nuxt class="h-100" />
  </div>
</template>

<script>
export default {
  name: "HomeLayout",
  methods: {
    logout() {
      this.$auth.logout()
    },
  },
}
</script>

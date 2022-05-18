<template>
  <div class="h-100">
    <van-nav-bar
      :title="title"
      left-arrow
      @click-left="back">
      <template #right>
        <van-icon name="https://cdn.jsdelivr.net/npm/@vant/assets/icon-demo.png" />
        {{ ($auth.user && $auth.user.nickname) || 'NO_USER' }}
      </template>
    </van-nav-bar>
    <Nuxt class="h-100" />
  </div>
</template>

<script>
export default {
  name: 'DefaultLayout',
  methods: {
    back() { window.history.back() }
  },
  computed: {
    title() {
      let path = this.$route.path
      return `${path.charAt(1).toUpperCase()}${path.substring(2)}`
    }
  }
}
</script>

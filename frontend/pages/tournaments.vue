<template>
  <div class="container">
    <van-nav-bar
      title="Omnia Darts"
      left-arrow
      @click-left="back">
      <template #right>
        <van-icon name="https://cdn.jsdelivr.net/npm/@vant/assets/icon-demo.png" />Username
      </template>
    </van-nav-bar>

    <h1>Tournaments</h1>
    <h2>{{ $t('hello') }}</h2>
  </div>
</template>

<script>
export default {
  name: "tournaments",
  methods: {
    back() { window.history.back() }
  }
}
</script>

<style scoped>

</style>

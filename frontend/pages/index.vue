<template>
  <div class="container">
    <van-nav-bar title="Omnia Darts">
      <template #right>
        <van-icon name="https://cdn.jsdelivr.net/npm/@vant/assets/icon-demo.png" />Username
      </template>
    </van-nav-bar>

    <nuxt-link
      v-for="locale in availableLocales"
      :key="locale.code"
      :to="switchLocalePath(locale.code)">{{ locale.name }}</nuxt-link>

    <h2>{{ $t('hello') }}</h2>

    <van-row justify="space-between">
      <van-col><van-button type="primary" size="large" to="tournaments">Tornei</van-button></van-col>
    </van-row>
  </div>
</template>

<script>
export default {
  name: 'HomePage',
  computed: {
    availableLocales () {
      return this.$i18n.locales
    }
  }
}
</script>

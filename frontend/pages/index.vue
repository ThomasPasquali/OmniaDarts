<template>
  <div class="container">


    <!-- <nuxt-link
      v-for="locale in availableLocales"
      :key="locale.code"
      :to="switchLocalePath(locale.code)">{{ locale.name }}</nuxt-link> -->


    <van-row justify="space-between">
      <van-col><van-button type="primary" size="large" to="tournaments">Tornei</van-button></van-col>
    </van-row>

    <pre>
      User: {{$auth.user}}
      Token: {{$auth.strategy.token.get()}}
    </pre>
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

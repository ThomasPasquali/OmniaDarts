<template>
  <div class="h-100">

    <van-nav-bar
      v-if="isAndroid()"
      :title="title"
      fixed
      placeholder
      safe-area-inset-top>
    </van-nav-bar>
    <van-nav-bar
      v-else
      :title="title"
      fixed
      placeholder
      safe-area-inset-top
      left-arrow
      @click-left="back">
      <template #right >
        <AppbarMenu />
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
    isAndroid() {
      return this.window && this.window.android
    },
  },
  data() {
    return { window: null }
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
  },
  mounted() {
    this.window = window
  }
}
</script>

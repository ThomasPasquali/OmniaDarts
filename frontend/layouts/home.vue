<template>
  <div class="h-100">
    <van-nav-bar
      title="Omnia Darts"
      fixed
      placeholder
      safe-area-inset-top>
      <template #right>
        <AppbarMenu />
      </template>
    </van-nav-bar>
    <Nuxt class="h-100" />
  </div>
</template>

<script>
import AppbarMenu from "~/components/AppbarMenu";
export default {
  name: "HomeLayout",
  components: {AppbarMenu},
}
</script>

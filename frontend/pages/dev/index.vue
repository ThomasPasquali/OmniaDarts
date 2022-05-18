<template>
  <div>
    <van-button to="dev/notifications">Notifications</van-button>
    <pre>
      User: {{$auth.user}}
      Token: {{$auth.strategy.token.get()}}
    </pre>
  </div>
</template>

<script>
export default {
  name: "DevPage"
}
</script>

<style scoped>

</style>

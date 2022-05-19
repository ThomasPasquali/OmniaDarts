<template>
  <div>
    <van-button to="dev/notifications">Notifications</van-button>
    <van-button to="dev/textchat">Text chat</van-button>
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

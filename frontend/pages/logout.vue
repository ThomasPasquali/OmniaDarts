<template>
  <h2>Logging out...</h2>
</template>

<script>
export default {
  name: "logout",
  mounted() {
    this.$auth.logout();
  }
}
</script>

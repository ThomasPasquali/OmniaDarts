<template>
  <section class="section">
      <van-button class="Glogin" @click="loginWithGoogle()" icon-left="google">
        Sign in with Google
      </van-button>
  </section>
</template>

<script>
export default {
  methods: {
    loginWithGoogle() {
      this.$auth.loginWith('google', { params: { prompt: "select_account" } });
    },
  },
};
</script>

<style scoped>
.Glogin {
  display: grid;
  padding: 4px 8px;
  border-radius: 3px;
  background-color: #3c82f7;
  color: #fff;
  box-shadow: 0 3px 0 #0f69ff;
  margin: 0 auto;
  text-decoration: none;
}
</style>

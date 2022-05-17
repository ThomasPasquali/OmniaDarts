<template>
  <section class="section">
      <b-button class="Glogin" @click="loginWithGoogle()" icon-left="google">
        Sign in with Google
      </b-button>
  </section>
</template>

<script>
export default {
  methods: {
    loginWithGoogle() {
      //window.location = 'http://localhost:4000/auth/google'
      //console.log('googleing')
      this.$auth.loginWith('google', { params: { prompt: "select_account" } });

      //console.log(access)
    },
  },
};
</script>

<style scoped>
.Glogin {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 3px;
  background-color: #3c82f7;
  color: #fff;
  box-shadow: 0 3px 0 #0f69ff;
  display: table;
  margin: 0 auto;
}
</style>

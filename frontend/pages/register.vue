<template>
  <div>
    <Register />
  </div>
</template>

<script>
import Register from "../components/RegisterForm.vue";
import GLogin from "../components/GoogleLoginButton.vue";
export default {
  name: "LoginIndex",
  components: { Register, GLogin },
  layout: 'register',
  auth: false,
  computed: {
    user() {
      console.log(this.$store.getters.user)
      return this.$store.getters.user
    }
  }
};
</script>

<template>
  <div>
    <Login />

    <van-divider
      :style="{ color: '#1989fa', borderColor: '#1989fa', padding: '0 16px' }"
    >
      or
    </van-divider>

    <GLogin />

  </div>
</template>

<script>
import Login from "../components/LoginForm.vue";
import GLogin from "../components/GoogleLoginButton.vue";
export default {
  name: "LoginIndex",
  components: { Login, GLogin },
  layout: 'login',
  computed: {
    user() {
      console.log(this.$store.getters.user)
      return this.$store.getters.user
    }
  }
};
</script>

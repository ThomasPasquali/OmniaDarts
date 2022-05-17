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
import Login from "../../components/login.vue";
import GLogin from "../../components/googleLogin.vue";
export default {
  name: "LoginPage",
  components: { Login, GLogin },
};
</script>

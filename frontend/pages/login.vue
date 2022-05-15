<!-- import style -->
import { createApp } from 'vue'; import { Form, Field, CellGroup } from 'vant';

<template>
  <form @submit.prevent="submit">
    <input
      name="username"
      type="text"
      placeholder="username"
      v-model="usr"
      required
    />
    <input
      name="password"
      type="password"
      placeholder="password"
      v-model="pwd"
      required
    />
    <input type="submit" />
    <div v-show="failedLogin">Credenziali errate</div>
  </form>
</template>

<script>
export default {
  name: "LoginPage",
  methods: {
    submit() {
      this.$axios
        .$post("/auth", { nickname: this.usr, pwd: this.pwd })
        .then((body) => {
          // console.log(body);
          let { access_token } = body;
          // console.log(access_token);
          this.failedLogin = false;
          localStorage.setItem("auth", access_token);
          this.$axios.setToken(access_token, "Bearer");
          this.$router.push("/");
        })
        .catch((_) => (this.failedLogin = true));
    },
  },
  data() {
    return { usr: "", pwd: "", failedLogin: false };
  },
};
</script>

<template>
  <div>
    <van-form @submit="submit">
      <van-cell-group inset>
        <van-field
          v-model="usr"
          name="Username"
          label="Username"
          placeholder="Username"
          :rules="[{ required: true, message: 'Username is required' }]"
        />
        <van-field
          v-model="pwd"
          type="password"
          name="Password"
          label="Password"
          placeholder="Password"
          :rules="[{ required: true, message: 'Password is required' }]"
        />
      </van-cell-group>
      <div style="margin: 16px">
        <van-button round block type="primary" native-type="submit">
          Submit
        </van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
export default {
  name: "LoginComponent",
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

<template>
  <div>
    <van-form @submit="login">
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
    <h4 v-show="failedLogin">{{ $t('wrong_credentials')}}</h4>
  </div>
</template>

<script>
export default {
  name: "LoginComponent",
  methods: {
    async login() {
      try {
        console.log("hi pie");
        await this.$auth.loginWith('local', { data: { nickname: this.usr, pwd: this.pwd } })
        console.log("hi pie");
      } catch (err) {
        console.log(err);
        this.failedLogin = true
      }
    },
  },
  data() {
    return { usr: "", pwd: "", failedLogin: false };
  },
};
</script>

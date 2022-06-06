<template>
  <div>
    <van-form @submit="register">
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
        <!--TODO
        <van-field
          v-model="pwd"
          type="password"
          label="Confirm password"
          placeholder="Confirm password"
          :rules="[{ required: true, message: 'Password is required' }]"
        /> -->
      </van-cell-group>
      <div style="margin: 16px">
        <van-button round block type="primary" native-type="submit">
          Register new account
        </van-button>
      </div>
    </van-form>
    <h4 v-show="failedLogin">{{ $t('something_went_wrong')}}</h4>
  </div>
</template>

<script>
export default {
  name: "RegisterComponent",
  methods: {
    async register() {
      try {
        await this.$axios.$post('auth/register', { nickname: this.usr, pwd: this.pwd })
        await this.$auth.loginWith('local', { data: { nickname: this.usr, pwd: this.pwd } })
        window.location.href = '/'
      }catch {
        this.failedLogin = true
      }
    },
  },
  data() {
    return { usr: "", pwd: "", failedLogin: false };
  },
};
</script>

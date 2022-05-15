<template>
  <div class="container">

    <van-nav-bar
      title="Omnia Darts"
      left-arrow
      @click-left="back">
      <template #right>
        <van-icon name="https://cdn.jsdelivr.net/npm/@vant/assets/icon-demo.png" />
        <span>Username</span>
      </template>
    </van-nav-bar>

    <h1>Edit profile</h1>

    <form @submit.prevent="submit">
      <input id="photo" type="file" />
      <br> <br>
      <ProfileField
        v-for="field in fields"
        :key="field.label"
        :label="field.label"
        :type="field.type"
        :required="field.required"
      />
      <input type="submit" value="Save" />
    </form>

  </div>
</template>

<script>
import ProfileField from '~/components/ProfileField';

export default {
  name: "profile",
  components: {ProfileField},
  methods: {
    back() {
      window.history.back()
    },
    submit() {
      // this.$axios
      //   .$post("/auth", {nickname: this.usr, pwd: this.pwd})
      //   .then((body) => {
      //     // console.log(body);
      //     let {access_token} = body;
      //     // console.log(access_token);
      //     this.failedLogin = false;
      //     localStorage.setItem("auth", access_token);
      //     this.$axios.setToken(access_token, "Bearer");
      //     this.$router.push("/");
      //   })
      //   .catch((_) => (this.failedLogin = true));
    }
  },
  data() {
    return {
      fields: [
        {label: "Nickname", type: "text", required: true},
        {label: "First name", type: "text", required: false},
        {label: "Last name", type: "text", required: false},
        {label: "Country", type: "country"},
        {label: "Darts", type: "text", required: false},
        {label: "Team", type: "text", required: false}
      ]
    };
  }
}
</script>

<style>
input[type=text], select {
  width: 100%;
  padding: 12px 20px;
  margin: 8px 0;
  display: block;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

input[type=submit] {
  width: 100%;
  background-color: #04AA6D;
  color: white;
  padding: 14px 20px;
  margin: 8px 0;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

input[type=submit]:hover {
  background-color: #45a049;
}

.container {
  border-radius: 5px;
  padding: 20px;
}
</style>

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

    <h1>{{ edit ? 'Edit profile' : 'Profile' }}</h1>

    <form v-if="edit" @submit.prevent="submit">
      <input id="photo" type="file" />  <!-- TODO -->
      <br> <br>
      <ProfileField
        v-for="field in fields"
        :key="field.label"
        :label="field.label"
        :type="field.type"
        :required="field.required"
        :editable="field.editable"
      />
      <input type="submit" :value="edit ? 'Save' : 'Edit'" />
    </form>

    <div v-else>
      <img src="https://cdn.jsdelivr.net/npm/@vant/assets/icon-demo.png">
      <div v-for="field in fields">
        <p class="label">{{ field.label }}</p>
        <p class="value">{{ field.value }}</p>  <!-- fixme -->
      </div>
    </div>

    <button @click="edit = !edit">{{ edit ? 'Cancel' : 'Edit' }}</button>
  </div>
</template>

<script>
import ProfileField from '~/components/ProfileField';

export default {
  name: "profile",
  components: {ProfileField},
  computed: {},
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
      edit: false,
      fields: [
        {label: "Nickname", type: "text", required: true, editable: true, value: "xxx"},
        {label: "First name", type: "text", required: false, editable: true, value: "xxx"},
        {label: "Last name", type: "text", required: false, editable: true, value: "xxx"},
        {label: "Country", type: "country", required: false, editable: true, value: "xxx"},
        {label: "Darts", type: "text", required: false, editable: true, value: "xxx"},
        {label: "Team", type: "text", required: false, editable: false, value: "xxx"},
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

input[type=submit], button {
  width: 100%;
  background-color: #04AA6D;
  color: white;
  padding: 14px 20px;
  margin: 8px 0;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

input[type=submit]:hover, button {
  background-color: #45a049;
}

.container {
  border-radius: 5px;
  padding: 20px;
}
</style>

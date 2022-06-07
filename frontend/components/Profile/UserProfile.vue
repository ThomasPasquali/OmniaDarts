<template>
  <div class="container">
    <h1>{{ edit ? 'Edit profile' : (!userID ? 'Profile' : 'User') }}</h1>

    <form v-if="edit" @submit.prevent="submit">
      <input id="photo" type="file" />  <!-- TODO -->
      <br> <br>
      <ProfileField
        v-for="(field, key) in fields"
        :key="key"
        :attr="key"
        :field="field"
        :error="key === 'nickname' && isNickDuplicated"
      />
      <input type="submit" value="Save" />
    </form>

    <div v-else>
      <div v-if="!!user">
        <img :src="user.imageUrl">
        <div v-for="(field, key) in fields" v-if="field.type !== 'image' && !!user[key]" :key="key">
          <p class="label">{{ field.label }}</p>
          <h4 class="value">{{ user[key] }}</h4>
        </div>
      </div>
      <div v-else>Loading...</div>
    </div>

    <button v-if="!userID" @click="cancelOrEdit">{{ edit ? 'Cancel' : 'Edit' }}</button>
  </div>
</template>

<script>
import ProfileField from '~/components/Profile/ProfileField';

export default {
  name: 'UserProfile',
  components: {ProfileField},
  props: ['userID'],
  data() {
    return {
      edit: false,
      isNickDuplicated: false,
      fields: {  // keys must be named as user attributes
        imageUrl: {
          label: "Image",
          type: "image",
          required: false
        },
        nickname: {
          label: "Nickname",
          type: "text",
          required: true
        },
        firstname: {
          label: "First name",
          type: "text",
          required: false
        },
        lastname: {
          label: "Last name",
          type: "text",
          required: false
        },
        country: {
          label: "Country",
          type: "country",
          required: false
        },
        darts: {
          label: "Darts",
          type: "text",
          required: false
        },
      },
    };
  },
  async mounted() {
    await this.$store.dispatch('user/fetchUser', this.userID);
    this.updateData(this.fields);
  },
  computed: {
    user() {
      return this.$store.getters['user/user'];
    },
  },
  methods: {
    updateData(fields) {
      for (let key in fields) {
        fields[key].value = this.user[key];
      }
      this.isNickDuplicated = false;
    },
    cancelOrEdit() {
      if (this.edit) {
        this.updateData(this.fields);
      }
      this.edit = !this.edit;
    },
    submit() {
      let updatedData = {};
      for (let key in this.fields) {
        updatedData[key] = this.fields[key].value;
      }
      this.$axios
        .$put("/users/" + this.user._id, {nickname: updatedData.nickname})
        .then(_ => {
          this.$axios.$put("/users/" + this.user._id, updatedData);
          this.edit = false;
          this.updateData(this.fields);
          this.$router.go();  // FIXME
          return true;
        })
        .catch(_ => {
          this.isNickDuplicated = true;
          return false;
        });
    }
  },
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

h4 {
  margin-top: -0.6rem;
}
</style>

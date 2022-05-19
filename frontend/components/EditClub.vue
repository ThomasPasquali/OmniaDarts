<template>
  <form>
    <!-- TODO -->
    <label for="input_photo">Club photo</label>
    <input id="input_photo" type="file" />
    <label for="input_name">Club name</label>
    <input id="input_name" type="text" v-model="club.name" />
    <label for="input_descr">Description</label>
    <textarea id="input_descr" v-model="club.description" rows="5" />
    <input type="submit" value="Save" @click.prevent="submit"/>
  </form>
</template>

<script>
export default {
  name: "EditClub",
  props: {
    club: {
      //type: { name: String, description: String }, FIXME
      required: true,
    }
  },
  emits: ['submitClub'],  // il componente potrebbe emettere eventi con questo nome
  methods: {
    submit() {
      this.$emit('submitClub')
    }
  }
}
</script>

<style scoped>
input[type=text], textarea {
  width: 100%;
  padding: 12px;
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

label, h3 {
  margin-top: 24px;
  font-size: 24px;
  font-weight: bold;
  display: block;
}

#input_descr {
  width: 100%;
}
</style>

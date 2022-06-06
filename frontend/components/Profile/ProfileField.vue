<template>
  <div>
    <label for="input">{{ field.label }}</label>
    <Countries
      v-if="field.type === 'country'"
      :field="field"
      id="input"
    />
    <input
      v-if="field.type === 'text'"
      id="input"
      :type="field.type"
      :required="field.required"
      v-model="field.value"
    />
    <div class="error" v-if="error">Nickname already in use</div>
  </div>
</template>

<script>
import Countries from "~/components/Countries";

export default {
  name: "ProfileField",
  components: {Countries},
  props: ['field', 'attr', 'error']
}
</script>

<style scoped>
.error {
  color: red;
  padding-bottom: 1rem;
}
</style>

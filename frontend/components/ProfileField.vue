<template>
  <div v-if="editable">
    <label for="input">{{ label }}</label>
    <Countries
      v-if="type === 'country'"
      id="input"
    />
    <input
      v-else
      id="input"
      :type="type"
      :required="required"
    />
  </div>
</template>

<script>
import Countries from "~/components/Countries";

export default {
  name: "ProfileField",
  components: {Countries},
  props: ['label', 'type', 'required', 'editable']
}
</script>

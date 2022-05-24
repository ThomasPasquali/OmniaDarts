<template>
  <div>
    {{id}}
  </div>
</template>

<script>
export default {
  name: "SpecificLobbyPage",
  async asyncData({ params }) {
    return { id: params.id }
  },
}
</script>

<style scoped>

</style>

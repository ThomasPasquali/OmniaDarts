<template>
  <div class="tournament-preview">
    <pre>{{ tournament }}</pre>
  </div>
</template>

<script>
export default {
  name: "TournamentPreview",
  props: { tournament: { required: true } },
}
</script>

<style scoped>

</style>

<template>
  <Lobby :lobbyID="this.lobbyID"/>
</template>

<script>
import Lobby from "~/components/Lobbies/Lobby";

export default {
  name: "SpecificLobbyPage",
  components: {Lobby},
  data() {
    return {
      autoFetchInterval: null,
      lobbyID: this.$route.params.id,
    }
  },
}
</script>

<style scoped>

</style>

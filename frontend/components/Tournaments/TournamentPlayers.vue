<template>

  <div v-if="match.players.length" class="box">
    <div class="row" v-for="p in match.players">
      <div class="name">{{ Object(participants.find(p_ => p_.id === p.id)).name /* fixme ??? */ }}</div>
      <div class="win">{{ (match.winner === p.id ? 'V' : 'X') }}</div>
      <div class="points">{{ p.points }}</div>
    </div>
  </div>

  <div v-else class="box">
    <p>???</p>
  </div>

</template>

<script>
export default {
  name: "TournamentNode",
  props: ['match', 'participants'],
}
</script>

<style scoped>

.box {
  display: flex;
  flex-direction: column;
  width: 200px;
  background: navy;
  gap: 4px;
  padding: 8px;
}

.row {
  display: flex;
  flex-direction: row;
  align-items: center;
  border-radius: 8px;

}

.row > * {
  padding: .4rem;
}

.name {
  background: orange;
  width: 100%;
}

.win {
  width: 1.6rem;
  background: orange;
}

.points {
  width: 2rem;
  text-align: right;
  background: green;
}

</style>

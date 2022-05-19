<template>
  <EditClub :club="club" @submitClub="onsubmitClub"/>
</template>

<script>
import EditClub from "~/components/EditClub";

export default {
  name: "NewClubPage",
  components: {EditClub},
  data() {
    return { club: {name: '', description: ''}}
  },
  methods: {
    onsubmitClub() {
      console.log(this.club.name)
      this.$store.dispatch('clubs/createNew', this.club)
    }
  }
}
</script>

<style scoped>

</style>

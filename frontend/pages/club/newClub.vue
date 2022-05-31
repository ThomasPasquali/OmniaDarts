<template>
  <EditClub :club="club" @submitClub="submit"/>
</template>

<script>
import EditClub from "~/components/Club/EditClub";

export default {
  name: "NewClubPage",
  components: {EditClub},
  data() {
    return { club: {name: '', description: ''}}
  },
  methods: {
    submit() {
      console.log(this.club.name);
      this.$store.dispatch('clubs/createNew', this.club);
      this.$router.push('/club');
    }
  }
}
</script>

<style scoped>

</style>

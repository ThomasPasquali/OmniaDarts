<template>
  <UserProfile :userID="$route.params.id" />
</template>

<script>
import UserProfile from "~/components/Profile/UserProfile";

export default {
  name: "user",
  components: {UserProfile}
}
</script>

<template>
  <pre>
      {{ a() }}
  </pre>
</template>

<script>
export default {
  name: "GoogleLogin",
  middleware: "auth",
  computed: {
      a(){
          console.log($auth)
          return $auth;
      }
  }
};
</script>
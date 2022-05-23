<template>
  <div>
    <van-button @click="newWindow">New window</van-button>
    <h1>Notifications</h1>
    <van-cell-group inset>
      <van-cell
        v-for="(n, i) in notifications"
        :key="i"
        :title="`${n.message} (${n._id}) ${n.state}`">
        <button @click="notificationUpdate(i, 'ACCEPT')">OK</button>
        <button @click="notificationUpdate(i, 'REJECT')">NO</button>
        <button @click="notificationDismiss(i)">DISMISS</button>
      </van-cell>
    </van-cell-group>

    <h1>Last update</h1>
    <pre>{{update}}</pre>
  </div>
</template>

<script>
export default {
  name: "NotificationsDev",
  methods: {
    notificationDismiss(i) {
      this.$store.commit('notifications/dismiss', i)
    },
    notificationUpdate(i, action) {
      this.$store.dispatch('notifications/sendUpdate', { i, action })
    },
    newWindow() {
      window.open(window.location)
    }
  },
  computed: {
    notifications() {
      return this.$store.getters["notifications/notifications"]
    },
    update() {
      return this.$store.getters["notifications/update"]
    }
  },
  mounted() {
    this.sockets = {
      notifications: this.$store.getters.newIo(this, 'notifications') //Setup io for notifications
    }
    this.sockets.notifications.emit('new') //Test
  }
}
</script>

<style scoped>

</style>

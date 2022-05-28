<template>
  <div class="container">
    <van-button @click="newWindow">New window</van-button>
    <h1>Notifications</h1>

    <h2>{{ $t('user_new_notifications') }}</h2>
    <div v-if="notifications.filter(n => {return ['NEW', 'PENDING'].includes(n.state)}).length">
      <Notification
        v-for="(n, i) in notifications.filter(n => {return ['NEW', 'PENDING'].includes(n.state)})"
        :key="i"
        :notification="n"
        :class_="['NEW', 'PENDING'].includes(n.state) ? 'new' : 'old'"
        @accept="notificationUpdate(i, 'ACCEPT')"
        @reject="notificationUpdate(i, 'REJECT')"
        @dismiss="notificationDismiss(i)"
      />
    </div>
    <div v-else>
      <p>{{ $t('user_has_no_notification') }}</p>
    </div>

    <div v-if="notifications.filter(n => {return !['NEW', 'PENDING'].includes(n.state)}).length">
      <h2>{{ $t('user_read_notifications') }}</h2>
      <Notification
        v-for="(n, i) in notifications.filter(n => {return !['NEW', 'PENDING'].includes(n.state)})"
        :key="i"
        :notification="n"
        :class_="['NEW', 'PENDING'].includes(n.state) ? 'new' : 'old'"
        @accept="notificationUpdate(i, 'ACCEPT')"
        @reject="notificationUpdate(i, 'REJECT')"
        @dismiss="notificationDismiss(i)"
      />
    </div>

    <code>Last update:</code>
    <pre>{{ update }}</pre>
  </div>
</template>

<script>
import Notification from "~/components/Notification";
export default {
  name: "NotificationsDev",
  components: {Notification},
  methods: {
    notificationDismiss(i) {
      this.$store.commit('notifications/dismiss', i)
    },
    notificationUpdate(i, action) {
      this.$store.dispatch('notifications/sendUpdate', { i, action, sender: this.$auth.user})
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
.container {
  padding: .8rem;
}
</style>

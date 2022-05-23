<template>
  <div class="container">
    <van-button @click="newWindow">New window</van-button>
    <h1>Notifications</h1>

    <div v-if="notifications.length">
      <Notification
        v-for="(n, i) in notifications"
        :key="i"
        :notif="n"
      />
    </div>
    <div v-else>
      <h2>{{ $t('user_has_no_notification') }}</h2>
    </div>

    <!-- FIXME -->
    <van-cell-group inset>
      <van-cell
        v-for="(n, i) in notifications"
        :key="i"
        @click="notificationChecked(i)"
        :title="`${n.message} (${n.id}) cliccami...`"
        :value="n.state || 'new'">
        <pre>{{ n.payload }}</pre>
      </van-cell>
    </van-cell-group>

    <h1>Last update</h1>
    <pre>{{ update }}</pre>
  </div>
</template>

<script>
import Notification from "~/components/Notification";
export default {
  name: "NotificationsDev",
  components: {Notification},
  methods: {
    notificationChecked(i) {
      this.$store.dispatch('notifications/checkNotification', {i, action: 'check'})
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
    //this.$store.commit('notifications/addNew', 'Frontend test '+Math.floor(Math.random()*100))
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

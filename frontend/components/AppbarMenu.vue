<template>
  <div class="appbar_menu">
    <van-badge class="badge" :content="notifications.filter(n => {return ['NEW', 'PENDING'].includes(n.state)}).length" />
    <img :src="this.$auth.user.imageUrl" height="24px">  <!-- fixme -->
    <van-dropdown-menu class="aaa">
      <van-dropdown-item ref="item">
        <van-cell
          v-for="(o, i) in options"
          v-if="o.show"
          :key="i"
          center
          :title="o.title"
          :to="o.to"
          @click="o.onClick"
        />
      </van-dropdown-item>
    </van-dropdown-menu>
  </div>
</template>

<script>
export default {
  name: "AppbarMenu",
  data() {
    return {
      options: [
        {
          title: 'Profile',
          to: '/profile',
          show: true,
          onClick: this.onConfirm
        },
        {
          title: 'Friends',
          to: '/friends',
          show: true,
          onClick: this.onConfirm
        },
        {
          title: 'Club',
          to: '/club',
          show: true,
          onClick: this.onConfirm
        },
        // {
        //   title: 'Find club',
        //   to: 'findClub',
        //   show: true,
        //   onClick: this.onConfirm
        // },
        {
          title: 'Tournaments',
          to: '/tournaments',
          show: true,
          onClick: this.onConfirm
        },
        {
          title: 'Stats',
          to: '/stats',
          show: true,
          onClick: this.onConfirm
        },
        {
          title: 'Dev',  // FIXME
          to: '/dev',
          show: true,
          onClick: this.onConfirm
        },
        {
          title: 'Notifications',
          to: '/notifications',
          show: true,
          onClick: this.onConfirm
        },
        {
          title: 'Lobbies',
          to: '/lobbies',
          show: true,
          onClick: this.onConfirm
        },
        {
          title: 'Logout',
          to: '',
          show: true,
          onClick: this.logout
        },
      ],
    };
  },
  methods: {
    logout() {
      this.$auth.logout();
    },
    onConfirm() {
      this.$refs.item.toggle();
    },
  },
  computed: {
    notifications() {
      return this.$store.getters["notifications/notifications"]
    },
  },
  mounted: function () {
    this.$nextTick(() => {
      document.querySelector(".van-dropdown-menu__bar").style.opacity = "0";
    })
  },

}
</script>

<style scoped>
.appbar_menu {
  display: flex;
  flex-direction: row;
}
img {
  position: fixed;
  right: 12px; /* fixme */
  top: 12px; /* fixme */
}

.badge {
  min-width: 20px;
  max-height: 20px;
  margin-top: auto;
  margin-bottom: auto;
  margin-right: 8px;
}
</style>

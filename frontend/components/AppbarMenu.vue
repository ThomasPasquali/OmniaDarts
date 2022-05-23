<template>
  <div class="appbar_menu">
    <img src="https://cdn.jsdelivr.net/npm/@vant/assets/icon-demo.png" height="24px">  <!-- fixme -->
    <van-dropdown-menu>
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
      options: [  // fixme full path
        {
          title: 'Club',
          to: 'club',
          show: this.$auth.user.club,
          onClick: this.onConfirm
        },
        {
          title: 'Find club',
          to: 'findClub',
          show: true,
          onClick: this.onConfirm
        },
        {
          title: 'Tournaments',
          to: 'tournaments',
          show: true,
          onClick: this.onConfirm
        },
        {
          title: 'Dev',
          to: 'dev',
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
    }
  },
  mounted: function () {
    this.$nextTick(() => {
      document.querySelector(".van-dropdown-menu__bar").style.opacity = "0";
    })
  }

}
</script>

<style scoped>
.appbar_menu {
}

img {
  position: fixed;
  right: 12px; /* fixme */
  top: 12px; /* fixme */
}
</style>

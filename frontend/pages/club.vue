<template>
  <div v-if="!!myClub" class="container">

    <img id="club_photo" src="https://pickywallpapers.com/img/2018/10/dart-board-game-desktop-wallpaper-1306-1311-hd-wallpapers.jpg">

    <div v-if="!edit" class="content">

      <h1>{{ myClub.name }}</h1>

      <div id="buttons">
        <van-button
          v-for="(btn, i) in buttons.filter((b) => {return b.admin === false || isAdmin})"
          :key="i"
          :icon="btn.icon"
          @click="btn.onClick()"
        >{{ btn.label }}
        </van-button>
      </div>

      <h3>Description</h3>
      <p>{{ myClub.description }}</p>

      <div>
        <h3>Members</h3>
        <Banner
          v-for="member in myClub.players.filter((m) => {return !m.request})"
          :key="member.id"
          :title="member.nickname"
          :subtitle="member.firstname + ' ' + member.lastname"
          :buttons="[
            {icon: 'grade', outlined: !isAdmin},
            {icon: 'person_remove'},
          ]"
          :user="member"
        />
        <div v-if="isAdmin">
          <h3>Requests</h3>
          <Banner
            v-for="member in myClub.players.filter((m) => {return m.request})"
            :admin="isAdmin"
            :key="member.id"
            :user="member"
          />
          <!-- <van-button id="add_btn" icon="add">Invite player</van-button> -->
        </div>
      </div>

      <pre>myClub {{ myClub }}</pre>

    </div>

    <div v-else class="content">
      <EditClub :club="myClub" @submitClub="submit" />
    </div>

  </div>

  <div v-else class="content">
    <h1>{{ $t('user_has_no_club') }}</h1>
    <pre>{{ myClub }}</pre>
  </div>
</template>

<script>
import Banner from '~/components/Banner';
import EditClub from '~/components/EditClub';

export default {
  name: 'club',
  components: {Banner, EditClub},
  data() {
    return {
      // club: {
      //       name: 'Abbiamo vinto!',
      //       description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris convallis nisi sed mi cursus maximus eget ac enim.'
      //     },
      edit: false,
      buttons: [
        {label: 'Edit club', icon: 'edit', admin: true, onClick: () => this.edit = true},
        {label: 'Leave club', icon: 'cross', admin: false, onClick: () => 0},
        {label: 'Delete club', icon: 'delete', admin: true, onClick: () => 0},
      ],
      // members: [
      //   {
      //     id: '1',
      //     name: 'John Snow',
      //     photo: 'https://cdn.jsdelivr.net/npm/@vant/assets/icon-demo.png',
      //     stats: '1000',
      //     request: false,
      //   },
      //   {
      //     id: '2',
      //     name: 'Ned Stark',
      //     photo: 'https://cdn.jsdelivr.net/npm/@vant/assets/icon-demo.png',
      //     stats: '2100',
      //     request: true,
      //   },
      //   {
      //     id: '3',
      //     name: 'Ned Stark',
      //     photo: 'https://cdn.jsdelivr.net/npm/@vant/assets/icon-demo.png',
      //     stats: '2100',
      //     request: true,
      //   },
      //   {
      //     id: '4',
      //     name: 'John Snow',
      //     photo: 'https://cdn.jsdelivr.net/npm/@vant/assets/icon-demo.png',
      //     stats: '1000',
      //     request: false,
      //   },
      // ]
    }
  },
  methods: {
    submit() {
      this.edit = false;
      // this.$axios
      //   .$post("/auth", {nickname: this.usr, pwd: this.pwd})
      //   .then((body) => {
      //     // console.log(body);
      //     let {access_token} = body;
      //     // console.log(access_token);
      //     this.failedLogin = false;
      //     localStorage.setItem("auth", access_token);
      //     this.$axios.setToken(access_token, "Bearer");
      //     this.$router.push("/");
      //   })
      //   .catch((_) => (this.failedLogin = true));
    },
    // async sendRequest(userID) {
    //   await this.$axios.$post('friends/' + userID);
    // },
  },
  mounted() {
    this.$store.dispatch("clubs/fetchClub");
    this.$store.dispatch("clubs/fetchMyClubs");
  },
  computed: {
    clubs() {
      return this.$store.getters['clubs/club'];
    },
    myClub() {
      return this.$store.getters['clubs/myClub'];
    },
    isAdmin() {  // FIXME ?
      return this.myClub.players.find(p => p._id === this.$auth.user._id).isAdmin;
    }
  },
}

</script>


<style scoped>

.content {
  padding: 16px;
}

#club_photo {
  max-height: 200px;
  width: 100%;
  object-fit: cover;
}

#buttons {
  display: flex;
  flex-direction: row;
  gap: 16px;
}

#add_btn {
  width: 100%;
}

pre {
  overflow: scroll;
}
</style>

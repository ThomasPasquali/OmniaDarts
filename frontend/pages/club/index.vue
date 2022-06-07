<template>
  <div v-if="!!myClub" class="container">

<!--    <pre>{{myClub}}</pre>-->

    <img id="club_photo" src="https://pickywallpapers.com/img/2018/10/dart-board-game-desktop-wallpaper-1306-1311-hd-wallpapers.jpg">

    <div v-if="!edit" class="content">

      <h1>{{ myClub.name }}</h1>

      <div id="buttons">
        <van-button
          v-for="(btn, i) in buttons.filter((b) => {return b.admin === false || $auth.user.isAdmin})"
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
          v-for="member in myClub.players.filter(m => !!m.club)"
          :key="member._id"
          :user="member"
          :title="member.nickname"
          :subtitle="member.firstname + ' ' + member.lastname"
          :buttons="[
            {icon: 'grade', emit: 'setAdminprivileges', outlined: !member.isAdmin, disabled: !$auth.user.isAdmin || member._id === $auth.user._id},
            $auth.user.isAdmin ? {icon: 'person_remove', emit: 'removeUser', disabled: member._id === $auth.user._id} : '',
          ]"
          @setAdminprivileges="setAdminprivileges(member)"
          @removeUser="removeUser(member._id)"
        />
        <div v-if="$auth.user.isAdmin">
          <h3>Requests</h3>
          <Banner
            v-for="member in myClub.players.filter(m => !m.club)"
            :key="member._id"
            :user="member"
            :title="member.nickname"
            :subtitle="member.firstname + ' ' + member.lastname"
            :buttons="[
              {icon: 'done', emit: 'acceptRequest'},
              {icon: 'close', emit: 'rejectRequest'},
            ]"
            @acceptRequest="acceptRequest(member._id)"
            @rejectRequest="rejectRequest(member._id)"
          />
          <p v-if="!myClub.players.filter(m => !m.club).length">There are no pending requests</p>
        </div>
      </div>

    </div>

    <div v-else class="content">
      <EditClub :club="myClub" @submitClub="submit" />
    </div>

  </div>

  <div v-else>
    <h1>{{ $t('user_has_no_club') }}</h1>
    <FindClub />
    <van-button icon="add" to="club/newClub">{{ $t('new_club') }}</van-button>
  </div>

</template>

<script>
import Banner from '~/components/Banner';
import EditClub from '~/components/Club/EditClub';
import FindClub from '~/components/Club/FindClub';

export default {
  name: 'club',
  components: {Banner, EditClub, FindClub},
  data() {
    return {
      // club: {
      //       name: 'Abbiamo vinto!',
      //       description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris convallis nisi sed mi cursus maximus eget ac enim.'
      //     },
      edit: false,
      buttons: [
        {label: 'Find club', icon: 'search', admin: false, onClick: () => this.$router.push('/club/findClub')},
        {label: 'Edit club', icon: 'edit', admin: true, onClick: () => this.edit = true},
        {label: 'Leave club', icon: 'cross', admin: false, onClick: () => this.deleteClub()},
        {label: 'Delete club', icon: 'delete', admin: true, onClick: () => this.deleteClub()},
      ],
    }
  },
  methods: {
    async setAdminprivileges(user) {
      if (user.isAdmin) {
        await this.$axios.$delete('clubs/adminPrivileges/' + user._id);
      } else {
        await this.$axios.$post('clubs/adminPrivileges/' + user._id);
      }
    },
    async removeUser(userID) {
      await this.$axios.$delete('clubs/players/' + userID);
    },
    async acceptRequest(userID) {
      await this.$axios.$patch('clubs/joinRequest/' + userID);
    },
    async rejectRequest(userID) {
      await this.$axios.$delete('clubs/joinRequest/' + userID);
    },
    async joinRequest(clubID) { // TODO add message
      await this.$axios.$post('clubs/joinRequest?message=_&idClub=' + clubID);
    },
    async deleteClub() {
      await this.$axios.$delete('clubs/emergencyExit');
    },
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
  },
  mounted() {
    this.$store.dispatch("clubs/fetchClubs");
    this.$store.dispatch("clubs/fetchMyClub");
  },
  computed: {
    clubs() {
      return this.$store.getters['clubs/clubs'];
    },
    myClub() {
      return this.$store.getters['clubs/myClub'];
    },
    // isAdmin() {
    //   return this.myClub.players.find(p => p._id === this.$auth.user._id).isAdmin;
    // },
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

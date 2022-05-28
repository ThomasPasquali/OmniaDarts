<template>
  <div class="container">
    <van-tabs v-model:active="active">

      <van-tab :title="$t('friends')">
        <h1>{{ $t('friends') }}</h1>
        <div v-if="friendRequests.filter(fr => {return !fr.pending}).length">
          <Banner
            v-for="f in friendRequests.filter(fr => {return !fr.pending})"
            :key="f._id"
            :user="f.user"
            :title="f.user.nickname"
            :subtitle="f.user.firstname + ' ' + f.user.lastname"
            :buttons="[
              {
                icon: 'person_remove',
                emit: 'deleteFriend',
              },
            ]"
            @deleteFriend="deleteFriend(f.user._id)"
          />
        </div>
        <p v-else>{{ $t('user_has_no_friends') }}</p>
      </van-tab>

      <van-tab :title="$t('requests')">
        <h1>{{ $t('requests_received') }}</h1>
        <div v-if="friendRequests.filter(fr => {return fr.pending && !fr.isSender}).length">
          <Banner
            v-for="f in friendRequests.filter(fr => {return fr.pending && !fr.isSender})"
            :key="f._id"
            :user="f.user"
            :title="f.user.nickname"
            :subtitle="f.user.firstname + ' ' + f.user.lastname"
            :buttons="[
              {
                icon: 'done',
                emit: 'acceptFriend',
              },
              {
                icon: 'close',
                emit: 'deleteFriend',
              },
            ]"
            @acceptFriend="acceptFriend(f.user._id)"
            @deleteFriend="deleteFriend(f.user._id)"
          />
        </div>
        <p v-else>{{ $t('user_has_no_friend_requests') }}</p>
        <h1>{{ $t('requests_sent') }}</h1>
        <div v-if="friendRequests.filter(fr => {return fr.pending && fr.isSender}).length">
          <Banner
            v-for="f in friendRequests.filter(fr => {return fr.pending && fr.isSender})"
            :key="f._id"
            :user="f.user"
            :title="f.user.nickname"
            :subtitle="f.user.firstname + ' ' + f.user.lastname"
          />
        </div>
        <p v-else>{{ $t('user_has_no_friend_requests') }}</p>
      </van-tab>

      <van-tab :title="$t('search')">
        <van-search v-model="search" :placeholder="$t('search_user')" />
        <Banner
          v-for="u in users.filter(us => {return us.nickname.includes(search) && us._id !== authUser._id})"
          :key="u._id"
          :user="u"
          :title="u.nickname"
          :subtitle="u.firstname + ' ' + u.lastname"
          :buttons="
            friendRequests.filter(fr => {return fr.user._id === u._id && !fr.pending}).length ?
            [{
              icon: 'person_remove',
              emit: 'deleteFriend',
            }]
            : friendRequests.filter(fr => {return fr.user._id === u._id && fr.pending && fr.isSender}).length ?
            [{
              icon: 'schedule',
              emit: '',
            }]
            : friendRequests.filter(fr => {return fr.user._id === u._id && fr.pending && !fr.isSender}).length ?
            [{
              icon: 'done',
              emit: 'acceptFriend',
            }, {
              icon: 'close',
              emit: 'deleteFriend',
            }]
            :
            [{
              icon: 'person_add',
              emit: 'sendRequest',
            }]
          "
          @acceptFriend="acceptFriend(u._id)"
          @deleteFriend="deleteFriend(u._id)"
          @sendRequest="sendRequest(u._id)"
        />
      </van-tab>

    </van-tabs>

  </div>
</template>

<script>
import Banner from '~/components/Banner';

export default {
  name: 'club',
  components: {Banner},
  data() {
    return {
      active: 0,
      search: '',
    };
  },
  methods: {
    async sendRequest(userID) {
      await this.$axios.$post('friends/' + userID);
    },
    async deleteFriend(userID) {
      await this.$axios.$delete('friends/' + userID);
    },
    async acceptFriend(userID) {
      await this.$axios.$patch('friends/' + userID);
    },
  },
  mounted() {
    this.$store.dispatch("friends/fetchFriendRequests");
    this.$store.dispatch("friends/fetchUsers");
    this.$store.dispatch("friends/fetchAuthUser");
  },
  computed: {
    friendRequests() {
      return this.$store.getters['friends/friendRequests'];
    },
    users() {
      return this.$store.getters['friends/users'];
    },
    authUser() {
      return this.$store.getters['friends/authUser'];
    }
  },
};

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
</style>

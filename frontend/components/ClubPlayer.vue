<template>
  <div id="club_player">

    <div><img id="pic" :src="user.photo" /></div>
    <div id="info">
      <p id="name">{{ user.name }}</p>
      <p id="stats">{{ user.stats }}</p>
    </div>

    <div v-if="!user.request" id="buttons">
      <van-button icon="star"></van-button>
      <van-button icon="delete" v-if="admin"></van-button>
    </div>
    <div v-else id="buttons">
      <van-button icon="success"></van-button>
      <van-button icon="cross"></van-button>
    </div>

  </div>
</template>

<script>

export default {
  name: "ClubPlayer",
  props: ['user', 'admin'],
}
</script>

<style scoped>

#club_player {
  display: flex;
  flex-direction: row;
  align-items: center;
  max-height: 72px;
  padding: 8px 16px 8px 8px;
  margin-bottom: 16px;
  border-radius: 8px;
  background: lightsteelblue;
  gap: 16px;
}

#club_player > div {
  max-width: inherit;
  max-height: inherit;
}

#pic {
  object-fit: scale-down;
  max-width: inherit;
  max-height: inherit;
}

#info {
  width: 100%;
}

#info > p {
  margin: 0;
}

#name {
  font-size: 20px;
  margin-bottom: 12px !important;
}

#stats {
  font-size: 16px;
}

#buttons {
  display: flex;
  flex-direction: row;
  gap: 8px;
}

</style>

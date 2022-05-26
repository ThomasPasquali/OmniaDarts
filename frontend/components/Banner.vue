<template>
  <div class="banner">

    <div>
      <img class="pic" :src="user.imageUrl != null ? user.imageUrl : 'https://cdn.jsdelivr.net/npm/@vant/assets/icon-demo.png'" />
    </div>
    <div class="info">
      <p class="title">{{ user.nickname }}</p>
      <p class="subtitle">{{ user.firstname + ' ' + user.lastname }}</p>
    </div>

    <div v-if="!user.request" class="buttons">
      <van-button
        v-for="b in buttons"
        :icon="b.icon"
        @click="$emit(b.emit)"
      >{{ b.text }}
      </van-button>
      <!--      <van-button icon="star"></van-button>-->
      <!--      <van-button icon="delete" v-if="admin"></van-button>-->
    </div>
    <div v-else class="buttons">
      <!--      <van-button icon="success"></van-button>-->
      <!--      <van-button icon="cross"></van-button>-->
    </div>


  </div>
</template>

<script>

export default {
  name: "Banner",
  props: ['user', 'buttons', 'admin'],
}
</script>

<style scoped>

.banner {
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

.banner > div {
  max-width: inherit;
  max-height: inherit;
}

.pic {
  object-fit: scale-down;
  max-width: inherit;
  max-height: inherit;
}

.info {
  width: 100%;
}

.info > p {
  margin: 0;
}

.title {
  font-size: 20px;
  margin-bottom: 12px !important;
}

.subtitle {
  font-size: 16px;
}

.buttons {
  display: flex;
  flex-direction: row;
  gap: 8px;
}

</style>

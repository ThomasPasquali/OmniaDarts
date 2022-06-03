<template>
  <div class="banner">
    <div>
      <img class="pic" :src="(!!user && user.imageUrl != null) ? user.imageUrl : 'https://cdn.jsdelivr.net/npm/@vant/assets/icon-demo.png'" />
    </div>
    <div class="info">
      <p class="title">{{ title }}</p>
      <p class="subtitle">{{ subtitle }}</p>
    </div>

    <div class="buttons">
    <!--        :icon="b.icon"-->
    <div v-if="!user.request" class="buttons">
      <van-button
        v-for="b in buttons.filter(b_ => !!b_)"
        @click="$emit(b.emit)"
        :disabled="b.disabled"
      >
        <span class="material-icons">{{ b.icon }}</span>
        <span :class="'material-symbols-sharp' + (b.outlined ? ' outlined' : '')">{{ b.icon }}</span>
        {{ b.text }}
      </van-button>
      <!--      <van-button icon="star"></van-button>-->
      <!--      <van-button icon="delete" v-if="admin"></van-button>-->
    </div>
    <!--    <div v-else class="buttons">-->
    <!--      <van-button icon="success"></van-button>-->
    <!--      <van-button icon="cross"></van-button>-->
    <!--    </div>-->
    </div>
  </div>
</template>

<script>

export default {
  name: "Banner",
  props: ['title', 'subtitle', 'user', 'buttons', 'admin', 'disabled'],
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

.material-symbols-sharp {
  font-variation-settings: 'FILL' 1;
}

.material-symbols-sharp.outlined {
  font-variation-settings: 'FILL' 0 !important;
}
</style>

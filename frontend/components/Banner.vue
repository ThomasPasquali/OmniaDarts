<template>
  <div class="banner">
    <router-link class="link" :to="!user ? (!to ? '' : to) : ('/user/' + user._id)" tag="div">
      <img v-if="!!user" class="pic" :src="!!user.imageUrl ? user.imageUrl : 'https://cdn.jsdelivr.net/npm/@vant/assets/icon-demo.png'" />
      <div class="info">
        <p class="title">{{ title }}</p>
        <p class="subtitle">{{ subtitle }}</p>
      </div>
    </router-link>

    <div v-if="!!buttons" class="buttons">
      <van-button
        v-for="b in buttons.filter(b_ => !!b_)"
        :key="b.text"
        @click="$emit(b.emit)"
        :disabled="b.disabled"
      >
        <span :class="'material-symbols-sharp' + (b.outlined ? ' outlined' : '')">{{ b.icon }}</span>
        {{ b.text }}
      </van-button>
    </div>
  </div>
</template>

<script>
export default {
  name: "Banner",
  props: ['title', 'subtitle', 'user', 'buttons', 'to'],
}
</script>

<style scoped>

.banner {
  max-height: 72px;
  padding: 8px 16px 8px 8px;
  margin-bottom: 16px;
  border-radius: 8px;
  background: lightsteelblue;
}

.banner, .link {
  display: flex;
  flex-direction: row;
  align-items: center;
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

.link {
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

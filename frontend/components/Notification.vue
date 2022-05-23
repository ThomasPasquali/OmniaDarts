<template>
  <div class="club_player">

    <div class="info">
      <p class="title">{{ notif.title }}</p>
      <p class="message">{{ notif.message }}</p>
    </div>
    <div class="buttons">
      <van-button icon="success"></van-button>
    </div>

  </div>
</template>

<script>
export default {
  name: "Notification",
  props: ['notif'],
}
</script>

<style scoped>

.club_player {
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

.club_player > div {
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

.message {
  font-size: 16px;
}

.buttons {
  display: flex;
  flex-direction: row;
  gap: 8px;
}

</style>

<template>
  <div :class="'banner ' + class_">

    <div class="info">
      <p class="title">{{ $t(notification.title) }} {{ notification._id }}</p>
      <p class="message">
        <a href="../profile">{{ notification.payload.nickname }}</a>
        {{ $t(notification.message) }}
      </p>
    </div>
    <div v-if="notification.state !== 'ACCEPTED' && notification.state !== 'REJECTED'" class="buttons">
      <van-button icon="success" @click="$emit('accept')"></van-button>
      <van-button icon="cross" @click="$emit('reject')"></van-button>
      <van-button icon="delete" @click="$emit('dismiss')"></van-button>
      <van-button icon="question" @click="debug = !debug"></van-button> <!-- FIXME remove -->
    </div>
    <div v-if="debug">
      <pre>notification {{ notification }}</pre>
      <pre>notification.payload {{ notification.payload }}</pre>
    </div>

  </div>
</template>

<script>
export default {
  name: "Notification",
  props: ['notification', 'class_'],
  emits: ['accept', 'reject', 'dismiss'],
  data() {
    return {
      debug: false
    }
  }
}
</script>

<style scoped>

.banner {
  /*display: flex;*/
  /*flex-direction: row;*/
  /*align-items: center;*/
  /*max-height: 72px;*/
  padding: 8px 16px 8px 8px;
  margin-bottom: 16px;
  border-radius: 8px;
  gap: 16px;
}

.new {
  background: lightsteelblue;
}

.old {
  background: lightgray;
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
  margin-bottom: .2rem;
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
  margin-top: .4rem;
}

pre {
  overflow: scroll;
}

a {
  font-weight: bold;
}
</style>

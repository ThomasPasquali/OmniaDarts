<template>
  <div :class="'msg_block ' + (msg.sender === '' ? 'sent' : 'received')">
    <div :class="'bubble ' + (msg.sender === '' ? 'sent' : 'received')">
      <p v-if="msg.sender !== ''">{{ msg.sender }}</p>
      <p>{{ msg.text }}</p>
      <div class="info">
        <span>
          {{ msg.dateTime }}
        </span>
        <van-icon v-if="msg.sender === ''" class="status_icon" :name="msg.sent ? 'success' : 'clock-o'" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "TextMessage",
  props: {
    msg: {
      // type: {text: String, date: Date, sender: String},  // sender == '' → message sent by me  // FIXME
      required: true
    }
  }
}
</script>

<style scoped>
.msg_block {
  padding: .4rem .8rem;
}

.msg_block.sent {
  padding-left: 15%;
}

.msg_block.received {
  padding-right: 15%;
}

.bubble {
  border-radius: 1.6rem;
  padding: .01rem 1rem .8rem .8rem;
}

.bubble.sent {
  border-bottom-right-radius: 0 !important;
  background-color: green;
}

.bubble.received {
  border-bottom-left-radius: 0 !important;;
  background: gray;
}

.info {
  display: flex;
  width: 100%;
}

.status_icon {
  margin-left: auto;
  margin-right: 0;
}

</style>

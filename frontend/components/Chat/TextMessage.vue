<template>
  <div :class="'msg_block ' + (msg.sender === '' ? 'sent' : 'received')">
    <div :class="'bubble ' + (msg.sender === '' ? 'sent' : 'received')">
      <p v-if="msg.sender !== ''">{{ msg.sender }}</p>
      <p>{{ msg.text }}</p>
      <p>{{ msg.datetime/*.toLocaleDateString && ('en-US')FIXME*/ }}</p>  <!-- todo locale -->
      <van-icon :name="msg.sent ? 'success' : 'clock-o'"/>
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
  padding: 1rem;
}

.msg_block.sent {
  padding-left: 15%;
}

.msg_block.received {
  padding-right: 15%;
}

.bubble {
  border-radius: 2rem;
  padding: 1rem;
}

.bubble.sent {
  border-bottom-right-radius: 0 !important;
  background-color: green;
}

.bubble.received {
  border-bottom-left-radius: 0 !important;;
  background: gray;
}

</style>

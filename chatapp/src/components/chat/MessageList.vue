<script setup>
import MessageItem from './MessageItem.vue'

const props = defineProps({
  messages: {
    type: Array,
    required: true,
    validator: (value) => {
      return Array.isArray(value) && value.every(msg => 
        msg && typeof msg === 'object' && 
        'messageType' in msg && 
        'sendBy' in msg && 
        'sendAt' in msg && 
        'content' in msg
      )
    }
  },
  currentUserId: {
    type: String,
    required: true,
    validator: (value) => value && value.trim().length > 0
  },
  isNewestOrder: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['user-click'])

const handleUserClick = (userName, userId) => {
  emit('user-click', userName, userId)
}
</script>

<template>
  <div class="message-list" v-if="messages.length !== 0">
    <ul>
      <li class="item mt-4" v-for="(message, i) in messages" :key="i">
        <MessageItem 
          :message="message"
          :current-user-id="currentUserId"
          @user-click="handleUserClick"
        />
      </li>
    </ul>
  </div>
</template>

<style scoped>
.message-list {
  margin-top: 20px;
}

.item {
  display: block;
  list-style: none;
}

ul {
  padding: 0;
  margin: 0;
}
</style>
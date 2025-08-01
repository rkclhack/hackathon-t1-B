<script setup>

const props = defineProps({
  message: {
    type: Object,
    required: true,
    validator: (value) => {
      return value && 
        typeof value.messageType === 'number' &&
        typeof value.sendBy === 'string' &&
        value.sendAt instanceof Date &&
        typeof value.content === 'string'
    }
  },
  currentUserId: {
    type: String,
    required: true,
    validator: (value) => value && value.trim().length > 0
  }
})

const emit = defineEmits(['user-click'])

const handleUserClick = () => {
  if (props.message.messageType === 2 || props.message.messageType === 3) {
    emit('user-click', props.message.sendBy, props.message.userId)
  }
}
</script>

<template>
  <v-alert
    v-if="message.messageType === 0"
    color="info"
    variant="tonal"
    density="compact"
    class="mb-2"
  >
    <div class="text-center">
      <div>{{ message.content }}</div>
      <div class="text-caption">{{ message.sendAt.toLocaleString() }}</div>
    </div>
  </v-alert>
  
  <v-alert
    v-else-if="message.messageType === 1"
    color="pink"
    variant="tonal"
    density="compact"
    class="mb-2"
  >
    <div class="text-center">
      <div>{{ message.content }}</div>
      <div class="text-caption">{{ message.sendAt.toLocaleString() }}</div>
    </div>
  </v-alert>
  
  <v-row
    v-else-if="message.messageType === 2 || message.messageType === 3"
    :class="{'justify-end': message.userId === currentUserId }"
    class="mb-3"
  >
    <v-col cols="auto" v-if="message.userId !== currentUserId">
      <v-avatar color="primary" size="40">
        <v-icon>mdi-account</v-icon>
      </v-avatar>
    </v-col>
    
    <v-col cols="auto" :class="{'text-right': message.userId === currentUserId }" style="max-width: 70%;">
      <v-chip
        v-if="message.userId !== currentUserId"
        size="small"
        @click="handleUserClick"
        class="mb-1 clickable-chip"
      >
        {{ message.sendBy }}
      </v-chip>
      
      <v-card
        :color="message.messageType === 3 ? 'blue-lighten-5' : (message.userId === currentUserId ? 'primary' : 'grey-lighten-4')"
        :variant="message.messageType === 3 ? 'outlined' : 'flat'"
        class="pa-3"
      >
        <v-card-text :class="{'white--text': message.userId === currentUserId && message.messageType !== 3}">
          <div class="message-content">{{ message.content }}</div>
          <div class="text-caption mt-1" :class="{'text-grey-lighten-2': message.userId === currentUserId && message.messageType !== 3}">
            {{ message.sendAt.toLocaleString() }}
          </div>
        </v-card-text>
      </v-card>
    </v-col>
    
    <v-col cols="auto" v-if="message.userId === currentUserId">
      <v-avatar color="success" size="40">
        <v-icon>mdi-account</v-icon>
      </v-avatar>
    </v-col>
  </v-row>
</template>

<style scoped>
.clickable-chip {
  cursor: pointer;
}

.clickable-chip:hover {
  opacity: 0.8;
}

.message-content {
  white-space: pre-wrap;
  word-break: break-word;
}

.white--text {
  color: white !important;
}

.text-grey-lighten-2 {
  color: #bdbdbd !important;
}
</style>
<script setup>

const props = defineProps({
  userName: {
    type: String,
    required: true,
    validator: (value) => value && value.trim().length > 0
  }
})
</script>

<template>
  <v-app-bar 
    color="white"
    elevation="2"
  >
    <v-app-bar-title>
      <span class="chat-title">関東軽音インカレサークルチャットルーム</span>
    </v-app-bar-title>
    
    <v-spacer></v-spacer>
    
    <v-chip
      color="primary"
      variant="outlined"
      prepend-icon="mdi-account"
    >
      {{ userName }}
    </v-chip>
  </v-app-bar>
</template>

<style scoped>
.chat-title {
  color: rgb(59, 59, 244);
  font-weight: 500;
  font-size: 1.25rem;
}

@media (max-width: 600px) {
  .chat-title {
    font-size: 1rem;
  }
}
</style>
<script setup>
import { ref } from 'vue'
import BaseButton from '../common/BaseButton.vue'

const emit = defineEmits(['publish', 'memo'])

const chatContent = ref("")
const errorMessage = ref("")

const validate = () => {
  if (chatContent.value.trim() === "") {
    errorMessage.value = "文字列を入力してください"
    return false
  }
  errorMessage.value = ""
  return true
}

const onPublish = () => {
  if (!validate()) return
  
  emit('publish', chatContent.value)
  chatContent.value = ""
}

const onMemo = () => {
  if (!validate()) return
  
  emit('memo', chatContent.value)
  chatContent.value = ""
}
</script>

<template>
  <v-card class="message-input-card" elevation="2">
    <v-card-text>
      <v-textarea
        v-model="chatContent"
        label="投稿文を入力してください"
        rows="3"
        variant="outlined"
        :error-messages="errorMessage"
        counter
        maxlength="1000"
        @input="errorMessage = ''"
      ></v-textarea>
      
      <div class="button-group">
        <BaseButton 
          @click="onPublish" 
          variant="primary"
          full-width
        >
          <v-icon start>mdi-send</v-icon>
          投稿
        </BaseButton>
        <BaseButton 
          @click="onMemo" 
          variant="ghost"
          full-width
        >
          <v-icon start>mdi-note-text</v-icon>
          メモ
        </BaseButton>
      </div>
    </v-card-text>
  </v-card>
</template>

<style scoped>
.message-input-card {
  margin-top: 20px;
}

.button-group {
  display: flex;
  gap: 10px;
  margin-top: 16px;
}
</style>
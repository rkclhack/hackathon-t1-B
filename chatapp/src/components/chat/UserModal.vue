<script setup>
import BaseModal from '../common/BaseModal.vue'
import BaseButton from '../common/BaseButton.vue'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  userName: {
    type: String,
    default: '',
    validator: (value) => typeof value === 'string'
  },
  userDetails: {
    type: Object,
    default: () => ({}),
    validator: (value) => {
      return value && typeof value === 'object'
    }
  }
})

const emit = defineEmits(['close'])

const closeModal = () => {
  emit('close')
}
</script>

<template>
  <BaseModal 
    :is-open="isOpen" 
    title="ユーザー情報" 
    size="small" 
    @close="closeModal"
  >
    <div class="user-info">
      <p class="user-info__item">
        <span class="user-info__label">ユーザー名:</span>
        <span class="user-info__value">{{ userName }}</span>
      </p>
      <p v-if="userDetails.instrument && userDetails.instrument !== 'N/A'" class="user-info__item">
        <span class="user-info__label">楽器:</span>
        <span class="user-info__value">{{ userDetails.instrument }}</span>
      </p>
      <p v-if="userDetails.music && userDetails.music !== 'N/A'" class="user-info__item">
        <span class="user-info__label">好きな音楽:</span>
        <span class="user-info__value">{{ userDetails.music }}</span>
      </p>
      <p v-if="userDetails.grade && userDetails.grade !== 'N/A'" class="user-info__item">
        <span class="user-info__label">学年:</span>
        <span class="user-info__value">{{ userDetails.grade }}年</span>
      </p>
      <p v-if="userDetails.university && userDetails.university !== 'N/A'" class="user-info__item">
        <span class="user-info__label">大学:</span>
        <span class="user-info__value">{{ userDetails.university }}</span>
      </p>
      <p v-if="userDetails.lastLogin && userDetails.lastLogin !== 'N/A'" class="user-info__item">
        <span class="user-info__label">最終ログイン日:</span>
        <span class="user-info__value">{{ userDetails.lastLogin }}</span>
      </p>
    </div>
    <template #footer>
      <BaseButton @click="closeModal" variant="primary">閉じる</BaseButton>
    </template>
  </BaseModal>
</template>

<style scoped>
.user-info {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.user-info__item {
  display: flex;
  align-items: baseline;
  margin: 0;
  font-size: 16px;
}

.user-info__label {
  font-weight: 600;
  color: #555;
  margin-right: 12px;
  min-width: 120px;
}

.user-info__value {
  color: #333;
  flex: 1;
}
</style>
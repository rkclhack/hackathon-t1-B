<script setup>
import { ref } from 'vue'

const props = defineProps({
  users: {
    type: Array,
    default: () => [],
    validator: (value) => {
      return Array.isArray(value) && value.every(user => 
        user && typeof user === 'object' && 
        typeof user.userName === 'string' && 
        (typeof user.id === 'string' || typeof user.id === 'number')
      )
    }
  },
  isOpen: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['user-click', 'toggle'])

const panel = ref(props.isOpen ? [0] : [])

const handleUserClick = (userName, userId) => {
  emit('user-click', userName, userId)
}

const handlePanelChange = () => {
  emit('toggle')
}
</script>

<template>
  <v-expansion-panels
    v-model="panel"
    @update:model-value="handlePanelChange"
    class="mb-4"
  >
    <v-expansion-panel>
      <v-expansion-panel-title>
        <v-icon class="mr-2">mdi-account-group</v-icon>
        ユーザー一覧 ({{ users.length }}人)
      </v-expansion-panel-title>
      <v-expansion-panel-text>
        <div class="user-chips-container">
          <v-chip
            v-for="(user, index) in users"
            :key="index"
            color="primary"
            variant="elevated"
            class="ma-1"
            @click="handleUserClick(user.userName, user.id)"
          >
            <v-icon start>mdi-account</v-icon>
            {{ user.userName }}
          </v-chip>
        </div>
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<style scoped>
.user-chips-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 16px 8px;
}
</style>
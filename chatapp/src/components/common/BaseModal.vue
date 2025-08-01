<script setup>
import { computed } from 'vue'

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  },
  title: {
    type: String,
    default: ''
  },
  size: {
    type: String,
    default: 'medium',
    validator: (value) => ['small', 'medium', 'large'].includes(value)
  },
  closeOnOverlay: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['close'])

// Vuetifyのサイズマッピング
const widthMapping = computed(() => {
  const widthMap = {
    small: 400,
    medium: 600,
    large: 800
  }
  return widthMap[props.size] || 600
})

const handleClose = () => {
  emit('close')
}
</script>

<template>
  <v-dialog
    :model-value="isOpen"
    :width="widthMapping"
    :persistent="!closeOnOverlay"
    @update:model-value="$event ? null : handleClose()"
  >
    <v-card>
      <v-card-title v-if="title || $slots.header" class="d-flex align-center">
        <slot name="header">
          <span>{{ title }}</span>
        </slot>
        <v-spacer></v-spacer>
        <v-btn
          icon="mdi-close"
          variant="text"
          @click="handleClose"
        ></v-btn>
      </v-card-title>
      
      <v-card-text>
        <slot></slot>
      </v-card-text>
      
      <v-card-actions v-if="$slots.footer">
        <slot name="footer"></slot>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
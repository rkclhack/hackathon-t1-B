<script setup>
import { computed } from 'vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'danger', 'ghost'].includes(value)
  },
  size: {
    type: String,
    default: 'medium',
    validator: (value) => ['small', 'medium', 'large'].includes(value)
  },
  fullWidth: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['click'])

// Vuetifyのcolorマッピング
const colorMapping = computed(() => {
  const colorMap = {
    primary: 'primary',
    secondary: 'grey',
    danger: 'error',
    ghost: 'primary'
  }
  return colorMap[props.variant] || 'primary'
})

// Vuetifyのvariantマッピング
const vuetifyVariant = computed(() => {
  return props.variant === 'ghost' ? 'outlined' : 'flat'
})

// Vuetifyのsizeマッピング
const sizeMapping = computed(() => {
  const sizeMap = {
    small: 'small',
    medium: 'default',
    large: 'large'
  }
  return sizeMap[props.size] || 'default'
})

const handleClick = (event) => {
  emit('click', event)
}
</script>

<template>
  <v-btn
    :color="colorMapping"
    :variant="vuetifyVariant"
    :size="sizeMapping"
    :block="fullWidth"
    :disabled="disabled"
    @click="handleClick"
  >
    <slot></slot>
  </v-btn>
</template>
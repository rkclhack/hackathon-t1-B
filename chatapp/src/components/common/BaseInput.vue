<script setup>
const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  type: {
    type: String,
    default: 'text'
  },
  placeholder: {
    type: String,
    default: ''
  },
  label: {
    type: String,
    default: ''
  },
  error: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  },
  required: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'blur', 'focus'])
</script>

<template>
  <v-text-field
    :model-value="modelValue"
    :type="type"
    :label="label"
    :placeholder="placeholder"
    :disabled="disabled"
    :error-messages="error"
    :required="required"
    variant="outlined"
    density="comfortable"
    @update:model-value="emit('update:modelValue', $event)"
    @blur="emit('blur', $event)"
    @focus="emit('focus', $event)"
  />
</template>
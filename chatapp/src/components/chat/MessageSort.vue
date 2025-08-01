<script setup>

const props = defineProps({
  isNewestOrder: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['sort-newest', 'sort-oldest'])

const sortByNewest = () => {
  emit('sort-newest')
}

const sortByOldest = () => {
  emit('sort-oldest')
}
</script>

<template>
  <div class="message-sort">
    <v-btn
      @click="sortByNewest"
      :color="isNewestOrder ? 'primary' : 'grey'"
      :variant="isNewestOrder ? 'flat' : 'flat'"
      class="custom-sort-btn"
      small
    >
      新しい順
    </v-btn>
    <v-btn
      @click="sortByOldest"
      :color="!isNewestOrder ? 'primary' : 'grey'"
      :variant="!isNewestOrder ? 'flat' : 'flat'"
      class="custom-sort-btn"
      small
    >
      古い順
    </v-btn>
  </div>
</template>

<style scoped>
.message-sort {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

.custom-sort-btn {
  min-width: 100px;
}
</style>
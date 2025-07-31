<script setup>
import { provide, ref } from "vue"

// #region reactive state
const userName = ref("")
const userId = ref("")
// #endregion

// #region global variable
provide("userName", userName)
provide("userId", userId)
// #endregion
</script>

<template>
  <router-view />
</template>

<style scoped>
</style>

<script setup>
import { provide } from "vue"
import { useUser } from "./composables/useUser"

// #region reactive state
const { userName, userId, setUser, clearUser, isLoggedIn } = useUser()
// #endregion

// #region global variable
provide("userName", userName)
provide("userId", userId)
provide("setUser", setUser)
provide("clearUser", clearUser)
provide("isLoggedIn", isLoggedIn)
// #endregion
</script>

<template>
  <v-app>
    <router-view />
  </v-app>
</template>

<style scoped>
</style>

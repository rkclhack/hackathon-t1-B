<script setup>
import { ref, reactive } from "vue"

const title = "RAKUS"
const message = ref("Hello message")
const list = reactive([])

const addItem = () => {
  list.push(message.value)
  message.value = ""
}
</script>

<template>
  <h1>{{ title }}</h1>
  <input type="text" v-model="message">
  <p>Hello World!</p>
  <p>{{ message }}</p>
  <button type="button" @click="addItem">追加</button>
  <ul>
    <li v-for="(item, index) in list" :key="index">{{ item }}</li>
  </ul>
</template>
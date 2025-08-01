import { createApp } from "vue"
import "./style.css"
import App from "./App.vue"
import router from "./router"
import vuetify from "./plugins/vuetify"

import socketManager from './socketManager.js'
const socket = socketManager.getInstance()

// DB初期化を確実に行うため、接続後に実行
socket.on('connect', () => {
  console.log('Socket connected, initializing DB...')
  socket.emit("initDB", {})
})

// エラーハンドリング
socket.on('error', (error) => {
  console.error('Socket error:', error)
})

socket.on('initDBResponse', (response) => {
  console.log('DB initialization response:', response)
})

createApp(App).use(vuetify).use(router).mount("#app")

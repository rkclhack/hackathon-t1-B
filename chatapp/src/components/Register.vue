<script setup>
import { inject, ref, onMounted } from "vue"
import { useRouter } from "vue-router"
import socketManager from '../socketManager.js'

//const userName = inject("userName")

onMounted(() => {
  socket.on("registrationResponse", (data) => {
    if (data.result) {
      alert("登録が完了しました")
      router.push({ name: "login" })
    } else {
      alert("登録に失敗しました: " + data.message)
    }
  })
})

const router = useRouter()
const socket = socketManager.getInstance()

const inputUserName = ref("")
const inputEmail = ref("")
const inputPassword = ref("")
const inputInstrument = ref("")

const onRegister = () => {
  if (inputUserName.value.trim() === "" || inputEmail.value.trim() === "" || inputPassword.value.trim() === "") {
    alert("ユーザー名、メールアドレス、パスワードを入力してください")
    return
  }
  // 登録イベント送信
  socket.emit("registerUser", {
    userName: inputUserName.value,
    email: inputEmail.value,
    password: inputPassword.value
  })
}
</script>

<template>
  <div class="mx-auto my-5 px-4">
    <h1 class="text-h3 font-weight-medium">Vue.js Chat サンプル</h1>
    <div class="mt-10">
      <p>メールアドレス</p>
      <input type="text" class="user-name-text" v-model="inputEmail" />
      <p>パスワード</p>
      <input type="text" class="user-name-text" v-model="inputPassword" />
      <p>名前</p>
      <input type="text" class="user-name-text" v-model="inputUserName" />
      <!-- <p>楽器</p>
      <input type="text" class="user-name-text" v-model="inputInstrument" /> -->
    </div>
    <button type="button" @click="onRegister" class="button-normal">登録</button>
  </div>
</template>

<style scoped>
.user-name-text {
  width: 200px;
  border: 1px solid #888;
  margin-bottom: 16px;
}
</style>

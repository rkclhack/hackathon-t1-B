<script setup>
import { inject, ref } from "vue"
import { useRouter } from "vue-router"
import socketManager from '../socketManager.js'

// #region global state
const userName = inject("userName")
const userId = inject("userId")
// #endregion

// #region local variable
const router = useRouter()
const socket = socketManager.getInstance()
// #endregion

// #region reactive variable
const inputUserName = ref("")
const inputPassword = ref("") // パスワード用
// #endregion

// #region browser event handler
// 入室処理
const onEnter = () => {
  if (inputUserName.value.trim() === "" || inputPassword.value.trim() === "") {
    alert("ユーザー名とパスワードを入力してください")
    return
  }
  // 入室イベント送信
  socket.emit("login", { userName: inputUserName.value })
  // router.push({ name: "chat" })
}


// ログイン後の処理
onMounted(() => {
  // サーバーからのログイン成功イベントを受信
  socket.on("loginResponse", (data) => {
    if (data.result) {
      userName.value = data.userName
      userId.value = data.userId // ユーザーIDを設定
      router.push({ name: "chat" }) // チャット画面へ遷移
    } else {
      alert("ログインに失敗しました: " + data.message)
    }
  })
})

const onRegister = () => {
  // 登録画面へ移動
  router.push({ name: "register" })
}

</script>

<template>
  <div class="mx-auto my-5 px-4">
    <h1 class="page-title">Vue.js Chat サンプル</h1>

    <div class="form-group">
      <p>ユーザー名</p>
      <input type="text" class="user-name-text" v-model="inputUserName" />
    </div>

    <div class="form-group">
      <p>パスワード</p>
      <input type="password" class="user-name-text" v-model="inputPassword" />
    </div>

    <button type="button" @click="onEnter" class="button-normal">入室する</button>
    <button type="button" @click="onRegister" class="button-normal register-btn">ユーザー登録</button>
  </div>
</template>

<style scoped>
.mx-auto {
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
}

.my-5 {
  margin-top: 2rem;
  margin-bottom: 2rem;
}

.px-4 {
  padding-left: 1rem;
  padding-right: 1rem;
}

.page-title {
  font-size: 24px;
  text-align: center;
  color: #333;
  font-weight: bold;
}

.form-group {
  margin-bottom: 20px;
}

p {
  margin-bottom: 8px;
  font-weight: bold;
  color: #444;
}

.user-name-text {
  width: 100%;
  padding: 10px;
  border: 1px solid #888;
  border-radius: 4px;
  font-size: 16px;
  box-sizing: border-box;
}

.button-normal {
  display: block;
  width: 100%;
  padding: 10px 0;
  margin-top: 10px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.button-normal:hover {
  background-color: #369a6e;
}

.register-btn {
  background-color: #007bff;
}

.register-btn:hover {
  background-color: #0056b3;
}
</style>

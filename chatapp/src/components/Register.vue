<script setup>
import { inject, ref } from "vue"
import { useRouter } from "vue-router"
import socketManager from '../socketManager.js'

//const userName = inject("userName")

const router = useRouter()
const socket = socketManager.getInstance()

const onRegister = () => {
  // ログイン画面へ遷移
  router.push({ name: "login" })
}
</script>

<template>
  <div class="mx-auto my-5 px-4">
    <h1 class="text-h3 font-weight-medium">Vue.js Chat サンプル</h1>
    <div class="mt-10">
      <p>メールアドレス</p>
      <input type="text" class="user-name-text" />
      <p>パスワード</p>
      <input type="text" class="user-name-text" />
      <p>名前</p>
      <input type="text" class="user-name-text" />
      <p>楽器</p>
      <input type="text" class="user-name-text" />
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

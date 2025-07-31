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

.mx-auto {
  max-width: 768px;
  margin: 2rem auto;
  padding: 2rem;
  background: #ffffff;
  
  
}

.text-h3 {
  font-size: 24px;
  text-align: center;
  color: #3b3bf4;
  margin-bottom: 1.5rem;
}

.user-name-text {
  width: 100%;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 16px;
  box-sizing: border-box;
  margin-bottom: 1rem;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.user-name-text:focus {
  border-color: #42b983;
  box-shadow: 0 0 5px rgba(66,185,131,0.4);
  outline: none;
}

p {
  margin: 0 0 6px;
  font-weight: 600;
  color: #444;
}

.button-normal {
  display: block;
  width: 100%;
  padding: 12px 0;
  background-color: #42b983;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.button-normal:hover {
  background-color: #369a6e;
}

</style>

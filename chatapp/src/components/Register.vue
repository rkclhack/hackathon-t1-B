<script setup>
import { inject, ref, onMounted, onUnmounted } from "vue"
import { useRouter } from "vue-router"
import socketManager from '../socketManager.js'

//const userName = inject("userName")

const handleRegistrationResponse = (data) => {
    if (data.result) {
      alert("登録が完了しました")
      // 前のページに戻る
      router.back()
    } else {
      alert("登録に失敗しました: " + data.message)
    }
  };

onMounted(() => {
  socket.on("registrationResponse", handleRegistrationResponse)
})

onUnmounted(() => {
  // コンポーネントが破棄される時にイベントリスナーを削除
  socket.off("registrationResponse", handleRegistrationResponse)
})

const router = useRouter()
const socket = socketManager.getInstance()

const inputUserName = ref("")
const inputEmail = ref("")
const inputPassword = ref("")
const inputUniversity = ref("")
const inputGrade = ref("")
const inputInstruments = ref([])
const inputFavoriteMusic = ref([])


const instruments = ref([
  { label: "ボーカル", value: "vocal" },
  { label: "エレキギター", value: "electric_guitar" },
  { label: "アコギ", value: "acoustic_guitar" },
  { label: "ベース", value: "bass" },
  { label: "ドラム", value: "drum" },
  { label: "キーボード", value: "keyboard" },
  { label: "その他", value: "others" }
])
const genres = ref([
  { label: "ポップ", value: "pop" },
  { label: "ロック", value: "rock" },
  { label: "メタル", value: "metal" },
  { label: "パンク", value: "punk" },
  { label: "オルタナティブ・ロック", value: "alternative_rock" },
  { label: "インディー・ロック", value: "indie_rock" },
  { label: "ポップパンク", value: "pop_punk" },
  { label: "J-POP", value: "j-pop" },
  { label: "アニソン", value: "anime_song" },
  { label: "ボカロ", value: "vocaloid" },
  { label: "ビジュアル系", value: "visual" }
])


const onRegister = () => {
  if (inputUserName.value.trim() === "" || inputEmail.value.trim() === "" || inputPassword.value.trim() === "") {
    alert("ユーザー名、メールアドレス、パスワードを入力してください")
    return
  }

  const registrationData = {
    userName: inputUserName.value,
    email: inputEmail.value,
    password: inputPassword.value,
    instrument: inputInstruments.value,
    music: inputFavoriteMusic.value,
    university: inputUniversity.value,
    grade: inputGrade.value
  }

  // 登録イベント送信
  socket.emit("registerUser", registrationData)
}
</script>

<template>
  <div class="mx-auto my-5 px-4">
    <h1 class="text-h3 font-weight-medium">関東軽音インカレサークルチャットルーム 新規登録</h1>
    <div class="mt-10">
      <p>メールアドレス</p>
      <input type="text" class="user-name-text" v-model="inputEmail" />
      <p>パスワード</p>
      <input type="text" class="user-name-text" v-model="inputPassword" />
      <p>名前</p>
      <input type="text" class="user-name-text" v-model="inputUserName" />
      <!-- <p>楽器</p>
      <input type="text" class="user-name-text" v-model="inputInstrument" /> -->
      
      <p>好きな楽器</p>
      <div class="checkbox-list">
        <label v-for="inst in instruments" :key="inst.value" class="checkbox-item">
         <input type="checkbox" :value="inst.value" v-model="inputInstruments" />
            {{ inst.label }}
          </label>
      </div>

      <p>好きな音楽</p>
      <div class="checkbox-list">
        <label v-for="genre in genres" :key="genre.value" class="checkbox-item">
          <input type="checkbox" :value="genre.value" v-model="inputFavoriteMusic" />
            {{ genre.label }}
        </label>
      </div>
      <p>大学</p>
      <input type="text" class="user-name-text" v-model="inputUniversity" />

      <p>学年</p>
        <select class="user-name-text" v-model="inputGrade">
          <option value=1>1年</option>
          <option value=2>2年</option>
          <option value=3>3年</option>
          <option value=4>4年</option>
        </select>
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

.checkbox-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12px 16px;
  margin-bottom: 1rem;
}

.checkbox-item {
  display: flex;
  align-items: center;
  font-size: 15px;
}

.checkbox-item input {
  margin-right: 5px;
}
</style>

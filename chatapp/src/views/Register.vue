<script setup>
import { inject, ref, onMounted, onUnmounted } from "vue"
import { useRouter } from "vue-router"
import BaseInput from '../components/common/BaseInput.vue'
import BaseButton from '../components/common/BaseButton.vue'
import { useSocket } from '../composables/useSocket'


const handleRegistrationResponse = (data) => {
  if (data.result) {
    alert("登録が完了しました")
    router.back()
  } else {
    alert("登録に失敗しました: " + data.message)
  }
}

const router = useRouter()
const { emit, on, off } = useSocket()

onMounted(() => {
  on("registrationResponse", handleRegistrationResponse)
})

onUnmounted(() => {
  off("registrationResponse", handleRegistrationResponse)
})

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
  if (
    inputUserName.value.trim() === "" ||
    inputEmail.value.trim() === "" ||
    inputPassword.value.trim() === "" ||
    inputUniversity.value.trim() === "" ||
    inputGrade.value === "" ||
    inputInstruments.value.length === 0 ||
    inputFavoriteMusic.value.length === 0
  ) {
    let message = ""
    if (inputEmail.value.trim() === "") message += "メールアドレスを入力してください。\n"
    if (inputPassword.value.trim() === "") message += "パスワードを入力してください。\n"
    if (inputUserName.value.trim() === "") message += "名前を入力してください。\n"
    if (inputInstruments.value.length === 0) message += "好きな楽器を1つ以上選択してください。\n"
    if (inputFavoriteMusic.value.length === 0) message += "好きな音楽を1つ以上選択してください。\n"
    if (inputUniversity.value.trim() === "") message += "大学名を入力してください。\n"
    if (inputGrade.value === "") message += "学年を選択してください。\n"
   
    
    alert(message)
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

  emit("registerUser", registrationData)
}
</script>

<template>
  <v-container fluid class="fill-height">
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card elevation="8" rounded="lg" class="my-5">
          <v-card-title class="text-center">
            <div class="w-100">
              <h1 class="page-title-main">関東軽音インカレサークル</h1>
              <h2 class="page-title-sub">チャットルーム 新規登録</h2>
            </div>
          </v-card-title>
          
          <v-card-text class="pt-4">
            <v-form @submit.prevent="onRegister">
              <BaseInput
                v-model="inputEmail"
                type="email"
                label="メールアドレス"
                placeholder="メールアドレスを入力"
                required
              />
              
              <BaseInput
                v-model="inputPassword"
                type="password"
                label="パスワード"
                placeholder="パスワードを入力"
                required
              />
              
              <BaseInput
                v-model="inputUserName"
                type="text"
                label="名前"
                placeholder="名前を入力"
                required
              />
              
              <v-card variant="outlined" class="mb-4">
                <v-card-title class="text-subtitle-1">
                  好きな楽器 <span class="text-error">*</span>
                </v-card-title>
                <v-card-text>
                  <v-chip-group
                    v-model="inputInstruments"
                    multiple
                    column
                  >
                    <v-chip
                      v-for="inst in instruments"
                      :key="inst.value"
                      :value="inst.value"
                      filter
                      variant="outlined"
                    >
                      {{ inst.label }}
                    </v-chip>
                  </v-chip-group>
                </v-card-text>
              </v-card>

              <v-card variant="outlined" class="mb-4">
                <v-card-title class="text-subtitle-1">
                  好きな音楽 <span class="text-error">*</span>
                </v-card-title>
                <v-card-text>
                  <v-chip-group
                    v-model="inputFavoriteMusic"
                    multiple
                    column
                  >
                    <v-chip
                      v-for="genre in genres"
                      :key="genre.value"
                      :value="genre.value"
                      filter
                      variant="outlined"
                    >
                      {{ genre.label }}
                    </v-chip>
                  </v-chip-group>
                </v-card-text>
              </v-card>
              
              <BaseInput
                v-model="inputUniversity"
                type="text"
                label="大学"
                placeholder="大学名を入力"
                required
              />

              <v-select
                v-model="inputGrade"
                :items="[
                  { title: '1年', value: '1' },
                  { title: '2年', value: '2' },
                  { title: '3年', value: '3' },
                  { title: '4年', value: '4' }
                ]"
                label="学年"
                variant="outlined"
                density="comfortable"
                required
              ></v-select>
              
              <div class="button-group">
                <BaseButton 
                  type="submit"
                  variant="primary"
                  full-width
                  size="large"
                >
                  <v-icon start>mdi-account-plus</v-icon>
                  登録
                </BaseButton>
                
                <BaseButton 
                  @click="router.back()"
                  variant="ghost"
                  full-width
                >
                  戻る
                </BaseButton>
              </div>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.fill-height {
  min-height: 100vh;
}

.page-title-main {
  font-size: 1.75rem;
  color: rgb(59, 59, 244);
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.page-title-sub {
  font-size: 1.25rem;
  color: #666;
  font-weight: normal;
}

.button-group {
  margin-top: 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.w-100 {
  width: 100%;
}
</style>

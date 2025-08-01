<script setup>
import { inject, ref, onMounted, onUnmounted } from "vue"
import { useRouter } from "vue-router"
import BaseInput from '../components/common/BaseInput.vue'
import BaseButton from '../components/common/BaseButton.vue'
import { useSocket } from '../composables/useSocket'

const setUser = inject("setUser")
const router = useRouter()
const { emit, on, off } = useSocket()

const inputEmail = ref("")
const inputPassword = ref("")

const onEnter = () => {
  if (inputEmail.value.trim() === "" || inputPassword.value.trim() === "") {
    alert("メールアドレスとパスワードを入力してください")
    return
  }
  emit("login", { email: inputEmail.value, password: inputPassword.value })
}


const handleLoginResponse = (data) => {
  if (data.result) {
    setUser(data.userName, data.userId)
    emit("enterEvent", { userName: data.userName, userId: data.userId })
    router.push({ name: "chat" })
  } else {
    alert("ログインに失敗しました: " + data.message)
  }
}

onMounted(() => {
  on("loginResponse", handleLoginResponse)
})

onUnmounted(() => {
  off("loginResponse", handleLoginResponse)
})

const onRegister = () => {
  router.push({ name: "register" })
}

</script>

<template>
  <v-container fluid class="fill-height">
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card elevation="8" rounded="lg">
          <v-card-title class="text-center">
            <div class="w-100">
              <h1 class="page-title-main">関東軽音インカレサークル</h1>
              <h2 class="page-title-sub">チャットルームログイン</h2>
            </div>
          </v-card-title>
          
          <v-card-text class="pt-8 pb-8">
            <v-form @submit.prevent="onEnter">
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
              
              <div class="button-group">
                <BaseButton 
                  type="submit"
                  variant="primary"
                  full-width
                  size="large"
                >
                  <v-icon start>mdi-login</v-icon>
                  入室する
                </BaseButton>
                
                <v-divider class="my-3">または</v-divider>
                
                <BaseButton 
                  @click="onRegister" 
                  variant="ghost"
                  full-width
                >
                  <v-icon start>mdi-account-plus</v-icon>
                  新規ユーザー登録
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
}

.w-100 {
  width: 100%;
}
</style>
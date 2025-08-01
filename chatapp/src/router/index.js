import { createRouter, createWebHistory } from "vue-router"
import { useUser } from "../composables/useUser"
import Chat from "../views/Chat.vue"
import Login from "../views/Login.vue"
import Register from "../views/Register.vue"

const routes = [
  {
    path: "/",
    name: "login",
    component: Login,
    meta: { requiresAuth: false }
  },
  {
    path: "/chat",
    name: "chat",
    component: Chat,
    meta: { requiresAuth: true }
  },
  {
    path: "/register",
    name: "register",
    component: Register,
    meta: { requiresAuth: false }
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: { name: 'login' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// グローバルナビゲーションガード
router.beforeEach((to, from, next) => {
  const { isLoggedIn } = useUser()
  
  // 認証が必要なルートかチェック
  if (to.meta.requiresAuth && !isLoggedIn()) {
    // 未認証の場合はログインページへリダイレクト
    next({ name: 'login' })
  } else if (!to.meta.requiresAuth && isLoggedIn() && to.name === 'login') {
    // 既にログイン済みの場合はチャット画面へリダイレクト
    next({ name: 'chat' })
  } else {
    // その他の場合は通常通り遷移
    next()
  }
})

export default router
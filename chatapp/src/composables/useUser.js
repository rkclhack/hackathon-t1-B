import { ref } from 'vue'

const userName = ref('')
const userId = ref('')

export function useUser() {
  const setUser = (name, id) => {
    userName.value = name
    userId.value = id
  }

  const clearUser = () => {
    userName.value = ''
    userId.value = ''
  }

  const isLoggedIn = () => {
    return userName.value !== '' && userId.value !== ''
  }

  return {
    userName,
    userId,
    setUser,
    clearUser,
    isLoggedIn
  }
}
<script setup>
import { inject, ref, reactive, onMounted, computed } from "vue"
import { ChatMessage } from '../objects/message.js'
import ChatHeader from '../components/chat/ChatHeader.vue'
import UserList from '../components/chat/UserList.vue'
import MessageInput from '../components/chat/MessageInput.vue'
import MessageSort from '../components/chat/MessageSort.vue'
import MessageList from '../components/chat/MessageList.vue'
import UserModal from '../components/chat/UserModal.vue'
import BaseButton from '../components/common/BaseButton.vue'
import { useSocket } from '../composables/useSocket'
import { instrumentMap, musicMap } from '../constants/mappings'
import { convertToJST } from '../utils/dateUtils'


const userName = inject("userName")
const userId = inject("userId")
const clearUser = inject("clearUser")
const { emit, on, off } = useSocket()
const chatList = reactive([])
const isNewestOrder = ref(true);
const isModalOpen = ref(false);
const selectedUserName = ref('');
const selectedUserId = ref('');
const selectedUserDetails = reactive({
  instrument: '',
  music: '',
  grade: '',
  university: '',
  lastLogin: ''
})

const menuOpen = ref(false)
const allUsers = ref([])

onMounted(() => {
  registerSocketEvent()
})

const addMessageToChatList = (message) => {
  if (isNewestOrder.value) {
    chatList.unshift(message)
  } else {
    chatList.push(message)
  }
}

const onPublish = (postMessage) => {
  const postMessageObject = {
    userName: userName.value,
    postMessage: postMessage,
    userId: userId.value
  }
  emit("publishEvent", postMessageObject)
}

const onExit = () => {
  const exitData = {
    userName: userName.value,
    userId: userId.value
  }
  emit("exitEvent", exitData)
  clearUser()
}
const onMemo = (memoContent) => {
  const memo = new ChatMessage(
    3,
    userName.value,
    new Date(),
    memoContent,
    userId.value
  )
  addMessageToChatList(memo)
}

const sortByNewest = () => {
  if (!isNewestOrder.value) {
    chatList.reverse()
    isNewestOrder.value = true
  }
}

const sortByOldest = () => {
  if (isNewestOrder.value) {
    chatList.reverse()
    isNewestOrder.value = false
  }
}

const openUserModal = async (name, id) => {
  selectedUserName.value = name
  selectedUserId.value = id
  emit("getUserInfo", { userId: id })
}

const closeUserModal = () => {
  isModalOpen.value = false
  selectedUserName.value = ''
  selectedUserId.value = ''
  selectedUserDetails.instrument = ''
  selectedUserDetails.music = ''
  selectedUserDetails.grade = ''
  selectedUserDetails.university = ''
  selectedUserDetails.lastLogin = ''
}
const onReceiveEnter = (data) => {
  const message = new ChatMessage(
    0,
    data.userName,
    new Date(),           
    `${data.userName}さんが入室しました。`,
    data.userId
  )
  addMessageToChatList(message)
  emit("getUserList")
}
const onReceivePublish = (data) => {
  const receivedMessage = new ChatMessage(
    data.messageType,
    data.sendBy,
    data.sendAt,
    data.content,
    data.userId
  )
  addMessageToChatList(receivedMessage)
}

const onReceiveUserDetails = (response) => {
    selectedUserDetails.instrument = response?.instrument 
      ? response.instrument.map(inst => instrumentMap[inst] || inst).join(', ') : 'N/A'
    selectedUserDetails.music = response?.music 
      ? response.music.map(inst => musicMap[inst] || inst).join(', ') : 'N/A'
    selectedUserDetails.grade = response?.grade || 'N/A'
    selectedUserDetails.university = response?.university || 'N/A'
    selectedUserDetails.lastLogin = response?.last_login_at 
      ? convertToJST(response.last_login_at) : 'N/A'
    isModalOpen.value = true
}

const handleEnterEvent = (data) => {
  onReceiveEnter(data)
}

const handleExitEvent = (data) => {
    const exitMessage = new ChatMessage(
      1,
      data.userName,
      new Date(),
      `${data.userName}さんが退室しました。`,
      data.userId
    )
    addMessageToChatList(exitMessage)
}

const handlePublishEvent = (data) => {
    const publishMessage = new ChatMessage(
      2,
      data.userName,
      new Date(),
      data.postMessage,
      data.userId
    )
    addMessageToChatList(publishMessage)
}

const handleUserListResponse = (data) => {
  allUsers.value = data.users || []
}

const handleUserInfoResponse = (response) => {
    onReceiveUserDetails(response)
}

const registerSocketEvent = () => {
  on("enterEvent", handleEnterEvent)
  on("exitEvent", handleExitEvent)
  on("publishEvent", handlePublishEvent)
  on("userListResponse", handleUserListResponse)
  on("userInfoResponse", handleUserInfoResponse)
}

const toggleMenu = () => {
  menuOpen.value = !menuOpen.value
  if (menuOpen.value) {
    emit("getUserList")
  }
}
</script>

<template>
  <div>
    <ChatHeader :user-name="userName" />
    
    <v-main>
      <v-container fluid class="chat-container">
      <v-row>
        <v-col cols="12">
          <UserList 
            :users="allUsers" 
            :is-open="menuOpen"
            @user-click="openUserModal"
            @toggle="toggleMenu"
          />
          
          <MessageInput 
            @publish="onPublish"
            @memo="onMemo"
          />
          
          <v-card class="mt-4 pa-3" elevation="2">
            <v-row align="center" class="mb-3">
              <v-col>
                <MessageSort 
                  :is-newest-order="isNewestOrder"
                  @sort-newest="sortByNewest"
                  @sort-oldest="sortByOldest"
                />
              </v-col>
              <v-col cols="auto">
                <router-link to="/" class="link">
                  <BaseButton 
                    @click="onExit" 
                    variant="danger"
                    size="small"
                  >
                    <v-icon start>mdi-logout</v-icon>
                    退室
                  </BaseButton>
                </router-link>
              </v-col>
            </v-row>
          </v-card>
          
          <MessageList 
            :messages="chatList"
            :current-user-id="userId"
            :is-newest-order="isNewestOrder"
            @user-click="openUserModal"
          />
          
          <UserModal 
            :is-open="isModalOpen"
            :user-name="selectedUserName"
            :user-details="selectedUserDetails"
            @close="closeUserModal"
          />
        </v-col>
      </v-row>
    </v-container>
    </v-main>
  </div>
</template>

<style scoped>
.chat-container {
  max-width: 1200px;
}

.link {
  text-decoration: none;
}
</style>
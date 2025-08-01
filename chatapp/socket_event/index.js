import { handleEnterEvent, handleExitEvent, handlePublishEvent } from './handlers/chatHandlers.js'
import { handleLogin, handleRegisterUser } from './handlers/authHandlers.js'
import { handleGetUserInfo, handleGetUserList, handleInitDB } from './handlers/userHandlers.js'
import { logEvent, logError } from './utils.js'

// UserModelを一度だけインポート
let UserModel = null

const initializeUserModel = async () => {
  if (!UserModel) {
    const module = await import("../src/db/models/userModel.js")
    UserModel = module.UserModel
  }
  return UserModel
}

export default async (io, socket) => {
  logEvent('connection', socket.id, { 
    address: socket.handshake.address,
    time: new Date().toISOString() 
  })
  
  // UserModelを初期化
  try {
    await initializeUserModel()
  } catch (error) {
    logError('UserModel initialization', error, socket.id)
    socket.disconnect(true)
    return
  }
  
  // チャット関連のイベント
  socket.on("enterEvent", handleEnterEvent(io, socket))
  socket.on("exitEvent", handleExitEvent(io, socket))
  socket.on("publishEvent", handlePublishEvent(io, socket))
  
  // 認証関連のイベント
  socket.on("login", handleLogin(socket, UserModel))
  socket.on("registerUser", handleRegisterUser(socket, UserModel))
  
  // ユーザー情報関連のイベント
  socket.on("getUserInfo", handleGetUserInfo(socket, UserModel))
  socket.on("getUserList", handleGetUserList(socket, UserModel))
  socket.on("initDB", handleInitDB(socket, UserModel))
  
  // 切断イベント
  socket.on("disconnect", (reason) => {
    logEvent('disconnect', socket.id, { reason })
  })
  
  // エラーハンドリング
  socket.on("error", (error) => {
    logError('socket error', error, socket.id)
  })
}
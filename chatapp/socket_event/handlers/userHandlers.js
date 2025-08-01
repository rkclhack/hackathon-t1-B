import { 
  createErrorResponse, 
  createSuccessResponse, 
  validateRequired,
  logEvent,
  logError
} from '../utils.js'

// ユーザー情報取得ハンドラー
export const handleGetUserInfo = (socket, UserModel) => {
  return async (data) => {
    logEvent('getUserInfo', socket.id, { userId: data.userId })
    
    try {
      // バリデーション
      if (!validateRequired(data.userId)) {
        socket.emit('userInfoResponse', createErrorResponse('User ID is required'))
        return
      }
      
      // ユーザー情報取得
      const userInfo = await UserModel.getUserInfoByID(data.userId)
      
      if (!userInfo) {
        socket.emit('userInfoResponse', createErrorResponse('User not found'))
        return
      }
      
      socket.emit('userInfoResponse', userInfo)
      
    } catch (error) {
      logError('getUserInfo', error, socket.id)
      socket.emit('userInfoResponse', createErrorResponse(
        'Failed to fetch user information'
      ))
    }
  }
}

// ユーザー一覧取得ハンドラー
export const handleGetUserList = (socket, UserModel) => {
  return async () => {
    logEvent('getUserList', socket.id)
    
    try {
      // ユーザー一覧取得
      const users = await UserModel.getAllUsers()
      
      // 必要な情報のみ送信（パスワードなどは除外）
      const sanitizedUsers = users.map(user => ({
        id: user.id,
        userName: user.userName,
        email: user.email,
        lastLoginAt: user.last_login_at
      }))
      
      socket.emit('userListResponse', {
        users: sanitizedUsers,
        count: sanitizedUsers.length
      })
      
    } catch (error) {
      logError('getUserList', error, socket.id)
      socket.emit('userListResponse', createErrorResponse(
        'Failed to fetch user list'
      ))
    }
  }
}

// データベース初期化ハンドラー（開発環境用）
export const handleInitDB = (socket, UserModel) => {
  return async (data) => {
    logEvent('initDB', socket.id)
    
    try {
      console.log('Initializing database...')
      await UserModel.createTable()
      
      socket.emit('initDBResponse', createSuccessResponse({
        message: 'Database initialized successfully'
      }))
      
    } catch (error) {
      logError('initDB', error, socket.id)
      socket.emit('initDBResponse', createErrorResponse(
        'Database initialization failed'
      ))
    }
  }
}
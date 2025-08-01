import { 
  createErrorResponse, 
  createSuccessResponse, 
  validateEmail, 
  validatePassword,
  validateUserName,
  validateRequired,
  validateArray,
  logEvent,
  logError
} from '../utils.js'

// ログインハンドラー
export const handleLogin = (socket, UserModel) => {
  return async (data) => {
    logEvent('login', socket.id, { email: data.email })
    
    try {
      // バリデーション
      if (!validateEmail(data.email)) {
        socket.emit('loginResponse', createErrorResponse('Invalid email format'))
        return
      }
      
      if (!validatePassword(data.password)) {
        socket.emit('loginResponse', createErrorResponse('Invalid password format'))
        return
      }
      
      // 認証処理
      const user = await UserModel.authenticateUser(data.email, data.password)
      
      if (!user) {
        socket.emit('loginResponse', createErrorResponse('Invalid email or password'))
        return
      }
      
      // 最終ログイン時刻を更新
      await UserModel.updateLastLogin(user.id)
      
      socket.emit('loginResponse', createSuccessResponse({
        userName: user.userName,
        userId: user.id
      }))
      
    } catch (error) {
      logError('login', error, socket.id)
      socket.emit('loginResponse', createErrorResponse('Login failed. Please try again.'))
    }
  }
}

// ユーザー登録ハンドラー
export const handleRegisterUser = (socket, UserModel) => {
  return async (data) => {
    logEvent('registerUser', socket.id, { email: data.email, userName: data.userName })
    
    try {
      // バリデーション
      const validationErrors = []
      
      if (!validateEmail(data.email)) {
        validationErrors.push('Invalid email format')
      }
      
      if (!validatePassword(data.password)) {
        validationErrors.push('Password must be at least 6 characters')
      }
      
      if (!validateUserName(data.userName)) {
        validationErrors.push('User name is required and must be less than 50 characters')
      }
      
      if (!validateArray(data.instrument)) {
        validationErrors.push('At least one instrument must be selected')
      }
      
      if (!validateArray(data.music)) {
        validationErrors.push('At least one music genre must be selected')
      }
      
      if (!validateRequired(data.grade) || data.grade < 1 || data.grade > 4) {
        validationErrors.push('Grade must be between 1 and 4')
      }
      
      if (!validateRequired(data.university)) {
        validationErrors.push('University is required')
      }
      
      if (validationErrors.length > 0) {
        socket.emit('registrationResponse', createErrorResponse(
          'Validation failed',
          validationErrors
        ))
        return
      }
      
      // ユーザー登録処理
      const userId = await UserModel.createUser(
        data.email,
        data.password,
        data.userName,
        data.instrument,
        data.music,
        data.grade,
        data.university
      )
      
      socket.emit('registrationResponse', createSuccessResponse({ userId }))
      
    } catch (error) {
      logError('registerUser', error, socket.id)
      
      // 重複エラーの特別処理
      if (error.message && error.message.includes('UNIQUE constraint failed')) {
        socket.emit('registrationResponse', createErrorResponse(
          'This email is already registered'
        ))
      } else {
        socket.emit('registrationResponse', createErrorResponse(
          'Registration failed. Please try again.'
        ))
      }
    }
  }
}
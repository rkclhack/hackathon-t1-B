// エラーレスポンスを統一的に作成
export const createErrorResponse = (message, details = null) => {
  return {
    result: false,
    error: message,
    details: details
  }
}

// 成功レスポンスを統一的に作成
export const createSuccessResponse = (data = {}) => {
  return {
    result: true,
    ...data
  }
}

// 基本的なバリデーション関数
export const validateEmail = (email) => {
  // 開発環境では簡易的なチェックのみ
  if (!email || email.trim() === '') {
    return false
  }
  
  // 本番環境では厳密なメールフォーマットチェック
  if (process.env.NODE_ENV === 'production') {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }
  
  // 開発環境では最低限のチェックのみ
  return email.length > 0
}

export const validatePassword = (password) => {
  if (!password) {
    return false
  }
  
  // 本番環境では6文字以上を要求
  if (process.env.NODE_ENV === 'production') {
    return password.length >= 6
  }
  
  // 開発環境では最低限のチェックのみ
  return password.length > 0
}

export const validateUserName = (userName) => {
  return userName && userName.trim().length > 0 && userName.trim().length <= 50
}

export const validateRequired = (value) => {
  return value !== null && value !== undefined && value !== ''
}

export const validateArray = (value) => {
  return Array.isArray(value) && value.length > 0
}

// ログヘルパー
export const logEvent = (eventName, socketId, data = {}) => {
  console.log(`[Socket Event] ${eventName} - Socket: ${socketId}`, data)
}

export const logError = (eventName, error, socketId) => {
  console.error(`[Socket Error] ${eventName} - Socket: ${socketId}`, error)
}
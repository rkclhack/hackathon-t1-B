// Socket.io設定
export const socketConfig = {
  // メッセージの最大長
  MAX_MESSAGE_LENGTH: parseInt(process.env.MAX_MESSAGE_LENGTH) || 1000,
  
  // ユーザー名の最大長
  MAX_USERNAME_LENGTH: parseInt(process.env.MAX_USERNAME_LENGTH) || 50,
  
  // パスワードの最小長
  MIN_PASSWORD_LENGTH: parseInt(process.env.MIN_PASSWORD_LENGTH) || 6,
  
  // ログレベル
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
  
  // 開発モード
  IS_DEVELOPMENT: process.env.NODE_ENV !== 'production'
}
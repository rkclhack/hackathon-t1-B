import { logEvent, validateRequired } from '../utils.js'

// 入室イベントハンドラー
export const handleEnterEvent = (io, socket) => {
  return (data) => {
    logEvent('enterEvent', socket.id, data)
    
    // バリデーション
    if (!validateRequired(data.userName) || !validateRequired(data.userId)) {
      console.error('Invalid enter event data:', data)
      return
    }
    
    // 全クライアントに通知
    io.sockets.emit('enterEvent', {
      userName: data.userName,
      userId: data.userId,
      timestamp: new Date().toISOString()
    })
  }
}

// 退室イベントハンドラー
export const handleExitEvent = (io, socket) => {
  return (data) => {
    logEvent('exitEvent', socket.id, data)
    
    // バリデーション
    if (!validateRequired(data.userName) || !validateRequired(data.userId)) {
      console.error('Invalid exit event data:', data)
      return
    }
    
    // 送信者以外の全クライアントに通知
    socket.broadcast.emit('exitEvent', {
      userName: data.userName,
      userId: data.userId,
      timestamp: new Date().toISOString()
    })
  }
}

// 投稿イベントハンドラー
export const handlePublishEvent = (io, socket) => {
  return (data) => {
    logEvent('publishEvent', socket.id, { userName: data.userName })
    
    // バリデーション
    if (!validateRequired(data.userName) || 
        !validateRequired(data.postMessage) || 
        !validateRequired(data.userId)) {
      console.error('Invalid publish event data:', data)
      return
    }
    
    // メッセージの長さ制限
    if (data.postMessage.length > 1000) {
      socket.emit('publishError', {
        error: 'Message too long (max 1000 characters)'
      })
      return
    }
    
    // 全クライアントに通知
    io.sockets.emit('publishEvent', {
      userName: data.userName,
      postMessage: data.postMessage,
      userId: data.userId,
      timestamp: new Date().toISOString()
    })
  }
}
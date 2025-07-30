export default (io, socket) => {
  // 入室メッセージをクライアントに送信する
  socket.on("enterEvent", (data) => {
    socket.broadcast.emit("enterEvent", data)
  })

  // 退室メッセージをクライアントに送信する
  socket.on("exitEvent", (data) => {
    const displayUserName = data.userName && data.userName.trim() !== '' ? data.userName : "誰か";
    const processedData = {
        userName: displayUserName,
        socketId: data.socketId // socketId は常に含める
    };
    socket.broadcast.emit("exitEvent", processedData)
  })

  // 投稿メッセージを送信する
  socket.on("publishEvent", (data) => {
    io.sockets.emit("publishEvent", data)
  })
}
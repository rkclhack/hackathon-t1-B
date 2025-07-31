export default (io, socket) => {
  // 入室メッセージをクライアントに送信する
  socket.on("enterEvent", (data) => {
    io.sockets.emit("enterEvent", data)
  })

  // 退室メッセージをクライアントに送信する
  socket.on("exitEvent", (data) => {
    socket.broadcast.emit("exitEvent", data)
  })

  // 投稿メッセージを送信する
  socket.on("publishEvent", (data) => {
    io.sockets.emit("publishEvent", data)
  })

  // DBの初期化
  socket.on("initDB", async (data) =>  {
    try {
      console.log('Initializing database...');
      const { UserModel } = await import("../src/db/models/userModel.js");
      await UserModel.createTable();
    } catch (error) {
      console.error('Database initialization failed:', error);
    }
  })

  // ユーザー情報を取得する
  socket.on("getUserInfo", async (data) => {
    try {
      const { UserModel } = await import("../src/db/models/userModel.js");
      const userInfo = await UserModel.getUsernameByID(data.userID);
      socket.emit("userInfoResponse", { userID: data.userID, username: userInfo });
    } catch (error) {
      console.error('Error fetching user info:', error);
      socket.emit("userInfoResponse", { userID: data.userID, error: 'Failed to fetch user info' });
    }
  })

  // ユーザー認証を行う
  socket.on("login", async (data) => {
    try {
      const { UserModel } = await import("../src/db/models/userModel.js");
      const user = await UserModel.authenticateUser(data.email, data.password);
      socket.emit("loginResponse", { result: true, username: user.username, userID: user.id });
    } catch (error) {
      console.error('Error authenticating user:', error);
      socket.emit("loginResponse", { result: false, error: 'Failed to authenticate user' });
    }
  })

  // ユーザー登録を行う
  socket.on("registerUser", async (data) => {
    try {
      const { UserModel } = await import("../src/db/models/userModel.js");
      const userID = await UserModel.createUser(
        data.email,
        data.password,
        data.username,
        data.instrument,
        data.music,
        data.grade,
        data.university
      );
      socket.emit("registrationResponse", { result: true });
    } catch (error) {
      console.error('Error registering user:', error);
      socket.emit("registrationResponse", { result: false, error: 'Failed to register user' });
    }
  })
}
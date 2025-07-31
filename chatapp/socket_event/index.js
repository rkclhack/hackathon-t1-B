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
      const userInfo = await UserModel.getUserInfoByID(data.userId);
      socket.emit("userInfoResponse", userInfo);
    } catch (error) {
      console.error('Error fetching user info:', error);
      socket.emit("userInfoResponse", { userId: data.userId, error: 'Failed to fetch user info' });
    }
  })

  // ユーザー認証を行う
  socket.on("login", async (data) => {
    try {
      const { UserModel } = await import("../src/db/models/userModel.js");
      const user = await UserModel.authenticateUser(data.email, data.password);
      if (!user) {
        socket.emit("loginResponse", { result: false, error: 'Invalid email or password' });
        return;
      }
      await UserModel.updateLastLogin(user.id);
      socket.emit("loginResponse", { result: true, userName: user.userName, userId: user.id });
    } catch (error) {
      console.error('Error authenticating user:', error);
      socket.emit("loginResponse", { result: false, error: 'Failed to authenticate user' });
    }
  })

  // ユーザー登録を行う
  socket.on("registerUser", async (data) => {
    try {
      const { UserModel } = await import("../src/db/models/userModel.js");
      const userId = await UserModel.createUser(
        data.email,
        data.password,
        data.userName,
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

  // ユーザー一覧を取得する
  socket.on("getUserList", async () => {
    try {
      const { UserModel } = await import("../src/db/models/userModel.js");
      const users = await UserModel.getAllUsers();
      socket.emit("userListResponse", { users });
    } catch (error) {
      console.error('Error fetching user list:', error);
      socket.emit("userListResponse", { error: 'Failed to fetch user list' });
    }
  })
}
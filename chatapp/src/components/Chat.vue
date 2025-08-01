<script setup>
import { inject, ref, reactive, onMounted, computed, onUnmounted } from "vue"
import socketManager from '../socketManager.js'
import { ChatMessage } from '../objects/message.js'


// #region global state
const userName = inject("userName")
const userId = inject("userId")
// #endregion

// #region local variable
const socket = socketManager.getInstance()
// #endregion

// #region reactive variable
const chatContent = ref("")
const chatList = reactive([])
const isNewestOrder = ref(true);
const isModalOpen = ref(false);
const selectedUserName = ref('');
const selectedUserId = ref('');
const selectedUserEmail = ref('');
const selectedUserInstrument = ref('');
const selectedUserMusic = ref('');
const selectedUserGrade = ref('');
const selectedUserUniversity = ref('');
const selectedUserLastLogin = ref('');
// #endregion
const memoList = reactive([])

const menuOpen = ref(false)
let allUsers;

const instrumentMap = {
  'vocal': 'ボーカル',
  'electric_guitar': 'エレキギター',
  'acoustic_guitar': 'アコギ',
  'bass': 'ベース',
  'drum': 'ドラム',
  'keyboard': 'キーボード',
  'others': 'その他'
};

const musicMap = {
  'pop': 'ポップ',
  'rock': 'ロック',
  'metal': 'メタル',
  'punk': 'パンク',
  'alternative_rock': 'オルタナティブ・ロック',
  'indie_rock': 'インディー・ロック',
  'pop_punk': 'ポップパンク',
  'j-pop': 'J-POP',
  'anime_song': 'アニソン',
  'vocaloid': 'ボカロ',
  'visual': 'ビジュアル系'
};

// #region lifecycle
onMounted(() => {
  registerSocketEvent()
})

onUnmounted(() => {
  // コンポーネントが破棄される時にイベントリスナーを削除
  socket.off("enterEvent", handleEnterEvent)
  socket.off("exitEvent", handleExitEvent)
  socket.off("publishEvent", handlePublishEvent)
  socket.off("userListResponse", handleUserListResponse)
  socket.off("userInfoResponse", handleUserInfoResponse)
})
// #endregion

const addMessageToChatList = (message) => {
  if (isNewestOrder.value) {
    chatList.unshift(message); // 新しい順なら先頭に追加
  } else {
    chatList.push(message);    // 古い順なら末尾に追加
  }
};

// #region browser event handler
// 投稿メッセージをサーバに送信する
// 投稿ボタンを押したときの処理
const onPublish = () => {
  const postMessage = chatContent.value
  // 空の場合エラー
  if(postMessage.trim() === ""){
      alert("文字列を入力してください。")
      return
  }

  //この部分でNew Date()にしたのにも関わらずできない(鈴木隆慎)
  // 投稿内容(ChatMessageオブジェクト)生成
  const postMessageObject = {userName:userName.value,postMessage:postMessage, userId:userId.value}
  socket.emit("publishEvent", postMessageObject)
  // 入力欄を初期化
  chatContent.value = ""
  //chatList.push(msg)

}

// 退室メッセージをサーバに送信する
const onExit = () => {
  const exitData = {
    userName: userName.value,userId:userId.value
  };
  // サーバーに退室イベントを送信
  socket.emit("exitEvent", exitData);
}
// メモを画面上に表示する
const onMemo = () => {
  // メモの内容を表示
if (chatContent.value.trim() === ""){
  alert("文字列を入力してください")
  return;
}
  const memo = new ChatMessage(
    3,                    // messageType: 3 = メモ
    userName.value,
    new Date(),
    chatContent.value,
    userId.value          // ユーザーIDを追加
  );
  addMessageToChatList(memo);
  chatContent.value = "";
  // 入力欄を初期化
}

const sortByNewest = () => {
  if (!isNewestOrder.value) { // 現在が古い順なら反転
    chatList.reverse();
    isNewestOrder.value = true;
  }
};

const sortByOldest = () => {
  if (isNewestOrder.value) { // 現在が新しい順なら反転
    chatList.reverse();
    isNewestOrder.value = false;
  }
};

const openUserModal = async (name, id) => {
  selectedUserName.value = name;
  selectedUserId.value = id;

  // サーバーにユーザー詳細情報をリクエスト
  socket.emit("getUserInfo", { userId: id });
};

const closeUserModal = () => {
  isModalOpen.value = false;
  selectedUserName.value = '';
  selectedUserId.value = ''; 
  selectedUserInstrument.value = ''; 
  selectedUserMusic.value = ''; 
  selectedUserGrade.value = '';  
  selectedUserUniversity.value = ''; 
};
// #endregion
// #region socket event handler
// サーバから受信した入室メッセージ画面上に表示する
const onReceiveEnter = (data) => {
  const time = new Date()// 現在時刻
  const message = new ChatMessage(
    0,                    // messageType: 0 = 入室
    data.userName,
    time,           
    `${data.userName}さんが入室しました。`,
    data.userId          // ユーザーIDを追加
  )
  addMessageToChatList(message);
  // 誰かが入室してdbが更新されている可能性があるから更新リクエスト
  socket.emit("getUserList",)
}
// サーバから受信した退室メッセージを受け取り画面上に表示する
const onReceiveExit = (data) => {
}
// サーバから受信した投稿メッセージを画面上に表示する
const onReceivePublish = (data) => {
  const receivedMessage = new ChatMessage(
    data.messageType,
    data.sendBy,
    data.sendAt, // ChatMessage内でDateオブジェクトに変換されることを期待
    data.content,
    data.userId
  );
  addMessageToChatList(receivedMessage);
}

const onReceiveUserDetails = (response) => {
    const userDetails = response;
    // 取得した詳細情報をリアクティブ変数に格納
    // JSONフィールドはオブジェクトとして保存されているので、表示用に文字列化するか、適切に処理
    selectedUserInstrument.value = userDetails?.instrument 
      ? userDetails.instrument.map(inst => instrumentMap[inst] || inst).join(', ') : 'N/A';
    selectedUserMusic.value = userDetails?.music ? userDetails.music.map(inst => musicMap[inst] || inst).join(', ') : 'N/A';
    selectedUserGrade.value = userDetails?.grade || 'N/A';
    selectedUserUniversity.value = userDetails?.university || 'N/A'; 
    selectedUserLastLogin.value = userDetails?.last_login_at  || 'N/A'; 
    selectedUserLastLogin.value = convertToJST(selectedUserLastLogin.value)
    isModalOpen.value = true;
};
// #endregion

// #region local methods
// イベント登録をまとめる

const handleEnterEvent = (data) => {
  onReceiveEnter(data);
}

const handleExitEvent = (data) => {
    // ChatMessage クラスのインスタンスとして退室メッセージを作成します。
    // ChatMessage(messageType, sendBy, sendAt, content) の形式です。
    const exitMessage = new ChatMessage(
      1, // 仮のMessageType.EXIT_NOTIFICATION (1) - メッセージの種類を示します
      data.userName, // 退室したユーザーの名前
      new Date(),    // メッセージが生成された現在時刻
      `${data.userName}さんが退室しました。`, // 実際に表示されるメッセージ本文
      data.userId    // ユーザーIDを追加
    );

      // 作成した退室メッセージを chatList 配列に追加します。
      // chatList は template で v-for ループされており、これに追加すると画面に表示されます。
      addMessageToChatList(exitMessage);
  };

const handlePublishEvent = (data) => {
     const publishmessage = new ChatMessage(
      2,
      data.userName,
     new Date(),   // ISO 文字列でもOK
      data.postMessage,
      data.userId   // ユーザーIDを追加
  ); 
    addMessageToChatList(publishmessage);
  };

const handleUserListResponse = (data) => {
  allUsers = data;
};

const handleUserInfoResponse = (response) => {
    onReceiveUserDetails(response);
  };

const registerSocketEvent = () => {
  // 入室イベントを受け取ったら実行
  socket.on("enterEvent", handleEnterEvent)

  // 退室イベントを受け取ったら実行
  socket.on("exitEvent", handleExitEvent)

  // 投稿イベントを受け取ったら実行
  socket.on("publishEvent", handlePublishEvent)

  socket.on("userListResponse", handleUserListResponse)

  socket.on("userInfoResponse", handleUserInfoResponse);
}

const toggleMenu = () => {
  menuOpen.value = !menuOpen.value
  socket.emit("getUserList",)
}

// データベースの時間がUTC（協定世界時）だから日本時間にする(9時間ずらせばよい)
function convertToJST(datetimeString) {
  const utcDate = new Date(datetimeString.replace(" ", "T"));
  const jstDate = new Date(utcDate.getTime() + 9 * 60 * 60 * 1000);

  const yyyy = jstDate.getFullYear();
  const mm = String(jstDate.getMonth() + 1).padStart(2, "0");
  const dd = String(jstDate.getDate()).padStart(2, "0");
  const hh = String(jstDate.getHours()).padStart(2, "0");
  const min = String(jstDate.getMinutes()).padStart(2, "0");

  return `${yyyy}-${mm}-${dd} ${hh}:${min}`;
}


// #endregion
</script>

<template>
  <div class="mx-auto my-5 px-4">

    <header class="main-header">
      <h1 class="text-h3 font-weight-medium chat-title">関東軽音インカレサークルチャットルーム</h1>
      <p class="main-header-user">ログインユーザ：{{ userName }}さん</p>
    </header>
    <div class="layout">
       <button class="button-normal button-side" @click="toggleMenu">
        <p v-if="menuOpen">△ユーザー一覧</p>
        <p v-else>▽ユーザー一覧</p></button>
      <!--ユーザー一覧 ここから-->
      <nav class="side-nav" v-if="menuOpen">
        
        <div class="all-users">
          <div v-for="(user, index) in allUsers.users" :key="index">
            <div class="user-list-user">
              <p @click="openUserModal(user.userName, user.id)" class="clickable-username">{{ user.userName }}</p>
            </div>
          </div>
        </div>
      </nav>
      <!--ユーザー一覧 ここまで-->
      <div class="main-content">
        <textarea v-model="chatContent" variant="outlined" placeholder="投稿文を入力してください" rows="4" class="area"></textarea>
        <button class="button-normal button-post" @click="onPublish">投稿</button>
        <button @click="onMemo" class="button-normal button-memo">メモ</button>
        <router-link to="/" class="link">
          <button type="button" class="button-normal button-exit" @click="onExit">退室する</button>
        </router-link>
              <div class="mt-5">
            <v-btn
                @click="sortByNewest"
                :color="isNewestOrder ? 'primary' : 'grey'"  :variant="isNewestOrder ? 'flat' : 'flat'"
                class="custom-sort-btn"
                small >
                新しい順
              </v-btn>
              <v-btn
                @click="sortByOldest"
                :color="!isNewestOrder ? 'primary' : 'grey'" :variant="!isNewestOrder ? 'flat' : 'flat'" 
                class="custom-sort-btn"
                small >
                古い順
              </v-btn>
          </div>
        <div class="mt-5" v-if="chatList.length !== 0">
      <ul>
        <li class="item mt-4" v-for="(chat, i) in chatList" :key="i">
            <div v-if="chat.messageType === 0" class="entry-message">
              <p>{{ chat.content }}</p>
              <p>{{ chat.sendAt.toLocaleString() }}</p>
            </div>
            <div v-else-if="chat.messageType === 1" class="exit-message">
              <p>{{ chat.content }}</p>
              <p>{{ chat.sendAt.toLocaleString() }}</p>
            </div>
            <div v-else-if="chat.messageType === 2 || chat.messageType === 3" class="normal-message" :class="{'reverse': chat.userId === userId }">
              <div class="normal-message-user">
                <div class="normal-img">
                  <img src="../images/user-solid.svg"></img>
                </div>
                <p @click="openUserModal(chat.sendBy, chat.userId)" class="clickable-username">{{ chat.sendBy }}</p>
              </div>
              <div class="normal-message-main"  :class="{ 'blue-border': chat.messageType === 3}">
                <div class="normal-message-main-content">
                  <p class="message-content-text">{{ chat.content }} </p>

                </div>
                <div class="normal-message-main-time">
                  <p>{{ chat.sendAt.toLocaleString() }}</p>
                </div>
              </div>
            </div>
          </li>
        </ul>
          </div>
        <Transition name="modal-fade">
          <div v-if="isModalOpen" class="modal-overlay" @click.self="closeUserModal">
            <div class="modal-content">
              <h2>ユーザー情報</h2>
              <p>ユーザー名: {{ selectedUserName }}</p>
              <!-- ★修正: 日本語ラベルで表示 -->
              <p v-if="selectedUserInstrument && selectedUserInstrument !== 'N/A'">楽器: {{ selectedUserInstrument }}</p>
              <p v-if="selectedUserMusic && selectedUserMusic !== 'N/A'">好きな音楽: {{ selectedUserMusic }}</p>
              <p v-if="selectedUserGrade && selectedUserGrade !== 'N/A'">学年: {{ selectedUserGrade }}年</p>
              <p v-if="selectedUserUniversity && selectedUserUniversity !== 'N/A'">大学: {{ selectedUserUniversity }}</p>
              <p v-if="selectedUserLastLogin && selectedUserLastLogin !== 'N/A'">最終ログイン日: {{ selectedUserLastLogin }}</p>
              <button @click="closeUserModal" class="button-normal">閉じる</button>
            </div>
          </div>
        </Transition>

    </div>
      </div>

    </div>
</template>

<style scoped>

.all-users {
  display: flex;
  gap: 1px;
  overflow-x: auto;   /* 横スクロールを有効にする */
  white-space: nowrap; /* 改行させない */
}

.user-list-user {
  display: inline-flex;
  min-width: 150px;
  height: 30px;
  display: flex;
  border-radius: 10px;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  margin-top: 5px;
  background-color: #b55e5e;
  color: white;
}

.link {
  text-decoration: none;
}

.area {
  width: 100%;
  border: 1px solid #000;
  margin-top: 8px;
}

.item {
  display: block;
}

.util-ml-8px {
  margin-left: 8px;
}
.main-header {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.main-header-user {
  margin-left: auto;
  right: 10%;
  align-items: center;     /* 横方向中央揃え */
}

.chat-title {
  color: rgb(59, 59, 244);
}

.button-normal {
  width: 100%;
  margin-top: 10px;
}

.button-post {
  background-color:rgb(192, 239, 239);
}

.button-memo {
  background-color: white;
}

.button-exit {
  color: #000;
  background-color: rgb(195, 169, 169);
  margin-top: 8px;
}

.entry-message {
  margin-top: 10px;
  background-color: aliceblue;
  border-radius: 10px;
  text-align: center;
}

.exit-message {
  margin-top: 10px;
  background-color: rgb(254, 240, 255);
  border-radius: 10px;
  text-align: center;
}

.normal-message {
  display: flex;
  min-height: 150px;
  margin-top: 10px;
  box-sizing: border-box;
  overflow-wrap: break-word;
}

.normal-message-user {
  width: 150px;
  height: 150px;
  display: flex;
  border-radius: 10px;
  justify-content: center;
  align-items: center;
  /* border-radius: 10px; ← 重複しているので削除してもOK */

  font-size:1em;
  color: black;
  /* ★変更: flex-direction を column にして、p タグが中央に来るように調整 */
  flex-direction: column; 
}

/* ★追加: ユーザー名のクリック感 */
.clickable-username {
  cursor: pointer; /* マウスカーソルを指の形にする */
  transition: background-color 0.2s, transform 0.1s; /* スムーズなアニメーション */
  padding: 5px 10px; /* クリックできる範囲を広げる */
  border-radius: 5px; /* 角を丸くする */
}

.clickable-username:hover {
  background-color: rgba(255, 255, 255, 0.2); /* ホバー時に薄い背景色 */
  text-decoration: underline; /* ホバー時に下線 */
}

.clickable-username:active {
  transform: translateY(1px); /* クリック時に少し下にずれる */
  background-color: rgba(255, 255, 255, 0.3); /* クリック時に少し濃い背景色 */
}

.normal-message-main {
  position: relative;
  background-color: rgba(179, 179, 179, 0.497);
  border-radius: 10px;
  margin-left: 10px;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between; /* 上：content、下：time */
  padding: 8px; /* 内容の余白調整 */
}

.normal-message-main-content {
  margin: 8px;
}

.message-content-text {
  white-space: pre-wrap; 
  word-break: break-word;
}

.normal-message-main-time {
  bottom: 0;
  right: 0;
  margin: 8px;
  text-align: right;
}

.blue-border {
  border: 2px solid #477eb9; /* 青 */
  background-color: rgb(224, 224, 255);
}

.normal-message.reverse {
  flex-direction: row-reverse;
}

.reverse .normal-message-main {
  margin-right: 10px;
  margin-left: 0px;
}
/* ★追加: モーダル関連のスタイル */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7); /* 半透明の黒背景 */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000; /* 他の要素より手前に表示 */
}

.modal-content {
  background-color: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  min-width: 300px;
  max-width: 80%;
  text-align: center;
  position: relative; /* ボタンの配置のため */
}

.modal-content h2 {
  margin-top: 0;
  margin-bottom: 20px;
  color: #333;
}

.modal-content p {
  font-size: 1.1em;
  margin-bottom: 25px;
  color: #555;
}

/* モーダル内のボタンのスタイル調整 */
.modal-content .button-normal {
  background-color: #007bff; /* 青色のボタン */
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.2s;
  width: auto; /* 全幅ではなく内容に合わせる */
  margin-top: 15px; /* 上部に少しスペース */
}

.modal-content .button-normal:hover {
  background-color: #0056b3;
}
.normal-img{
  width:100px;
  height:100px;
}
.normal-img img{
  width:100%;
  height:100%;
}

/* モーダル全体のフェードイン・アウト */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

/* モーダルコンテンツのスケールアップ・ダウン */
.modal-fade-enter-active .modal-content,
.modal-fade-leave-active .modal-content {
  transition: transform 0.3s ease;
}

.modal-fade-enter-from .modal-content,
.modal-fade-leave-to .modal-content {
  transform: scale(0.9);
}

</style>
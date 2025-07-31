<script setup>
import { inject, ref, reactive, onMounted, computed } from "vue"
import socketManager from '../socketManager.js'
import { ChatMessage } from '../objects/message.js'



// #region global state
const userName = inject("userName")
// #endregion

// #region local variable
const socket = socketManager.getInstance()
// #endregion

// #region reactive variable
const chatContent = ref("")
const chatList = reactive([])
const isNewestOrder = ref(true);
// #endregion
const memoList = reactive([])

// #region lifecycle
onMounted(() => {
  registerSocketEvent()
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
  const postMessageObject = {userName:userName.value,postMessage:postMessage}
  socket.emit("publishEvent", postMessageObject)
  // 入力欄を初期化
  chatContent.value = ""
  //chatList.push(msg)

}

// 退室メッセージをサーバに送信する
const onExit = () => {
  const exitData = {
    userName: userName.value
  };
  // サーバーに退室イベントを送信
  socket.emit("exitEvent", exitData);
}
// メモを画面上に表示する
const onMemo = () => {
  // メモの内容を表示
if (chatContent.value.trim() === "") return;
  const memo = new ChatMessage(
    3,                    // messageType: 3 = メモ
    userName.value,
    new Date(),
    chatContent.value
  );
  const formatted = `[${memo.getFormattedTime()}] ${memo.sendBy}さんのメモ：${memo.content}`;
  //↑これいらないかも(鈴木隆慎)
  // memoList.unshift(formatted);      // メモ専用リストに追加
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
// #endregion
// #region socket event handler
// サーバから受信した入室メッセージ画面上に表示する
const onReceiveEnter = (data) => {
  const time = new Date()// 現在時刻
  const message = new ChatMessage(
    0,                    // messageType: 0 = 入室
    data.userName,
    time,           
    `${data.userName}さんが入室しました。`
  )
  addMessageToChatList(message);
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
    data.content
  );
  addMessageToChatList(receivedMessage);
}
// #endregion

// #region local methods
// イベント登録をまとめる

const registerSocketEvent = () => {
  // 入室イベントを受け取ったら実行
  socket.on("enterEvent", (data) => {
    onReceiveEnter(data);
  })

  // 退室イベントを受け取ったら実行
  socket.on("exitEvent", (data) => {
    // ChatMessage クラスのインスタンスとして退室メッセージを作成します。
    // ChatMessage(messageType, sendBy, sendAt, content) の形式です。
    const exitMessage = new ChatMessage(
      1, // 仮のMessageType.EXIT_NOTIFICATION (1) - メッセージの種類を示します
      data.userName, // 退室したユーザーの名前
      new Date(),    // メッセージが生成された現在時刻
      `${data.userName}さんが退室しました。` // 実際に表示されるメッセージ本文
    );

      // 作成した退室メッセージを chatList 配列に追加します。
      // chatList は template で v-for ループされており、これに追加すると画面に表示されます。
      addMessageToChatList(exitMessage);
  })
// a
  // 投稿イベントを受け取ったら実行
  socket.on("publishEvent", (data) => {
     const publishmessage = new ChatMessage(
      2,
      data.userName,
     new Date(),   // ISO 文字列でもOK
      data.postMessage
  ); 
    addMessageToChatList(publishmessage);
  })
}
// #endregion
</script>

<template>
  <div class="mx-auto my-5 px-4">

    <header class="main-header">
      <h1 class="text-h3 font-weight-medium chat-title">Vue.js Chat チャットルーム</h1>
      <p class="main-header-user">ログインユーザ：{{ userName }}さん</p>
    </header>
    <textarea v-model="chatContent" variant="outlined" placeholder="投稿文を入力してください" rows="4" class="area"></textarea>
    <button class="button-normal button-post" @click="onPublish">投稿</button>
    <button @click="onMemo" class="button-normal button-memo">メモ</button>
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
              <p>{{ chat.sendAt }}</p>   
            </div>  
            <div v-else-if="chat.messageType === 1" class="exit-message">
              <p>{{ chat.content }}</p>
              <p>{{ chat.sendAt }}</p>
            </div>  
            <div v-else-if="chat.messageType === 2 || chat.messageType === 3" class="normal-message">
              <div class="normal-message-user">
                <p>{{ chat.sendBy }}</p>
              </div>
              <div class="normal-message-main"  :class="{ 'blue-border': chat.messageType === 3 }">
                <div class="normal-message-main-content">
                  <p>{{ chat.content }} </p>
                  
                </div>
                <div class="normal-message-main-time">
                  <p>{{ chat.sendAt }}</p>
                </div>
              </div>           
            </div>            
          </li>
        </ul>
      </div>
    <router-link to="/" class="link">
      <button type="button" class="button-normal button-exit" @click="onExit">退室する</button>
    </router-link>
  </div>
</template>

<style scoped>
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
  border-radius: 10px;
  background-color: #423636;
  color: white;
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


</style>
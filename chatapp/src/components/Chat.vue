<script setup>
import { inject, ref, reactive, onMounted } from "vue"
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
// #endregion
const memoList = reactive([])

// #region lifecycle
onMounted(() => {
  registerSocketEvent()
})
// #endregion

// #region browser event handler
// 投稿メッセージをサーバに送信する
// 投稿ボタンを押したときの処理
const onPublish = () => {
  // 入力欄のメッセージを取得
  const postMessage = chatContent.value
  // 入力欄を初期化
  chatContent.value = ""

  // 投稿内容(ChatMessageオブジェクト)生成
  const data = new ChatMessage(
      2,
      userName.value,
     "2025",   // ISO 文字列でもOK
      postMessage
  );
  socket.emit("publishEvent", data)
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

  const formatted = `[${memo.getFormattedTime()}] ${memo.sendBy}さんのメモ：「${memo.content}」`;

  // memoList.unshift(formatted);      // メモ専用リストに追加
  chatList.unshift(formatted);      // 表示中チャットにも追加（任意）
  chatContent.value = "";
  // 入力欄を初期化

}
// #endregion

// #region socket event handler
// サーバから受信した入室メッセージ画面上に表示する
const onReceiveEnter = (data) => {
  chatList.push(`${data.userName}さんが入室しました`);
}

// サーバから受信した退室メッセージを受け取り画面上に表示する
const onReceiveExit = (data) => {
}

// サーバから受信した投稿メッセージを画面上に表示する
const onReceivePublish = (data) => {
  chatList.push()
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
      chatList.push(exitMessage.content);
  })

  // 投稿イベントを受け取ったら実行
  socket.on("publishEvent", (data) => {
    chatList.push(data)
  })
}
// #endregion
</script>

<template>
  <div class="mx-auto my-5 px-4">
    <h1 class="text-h3 font-weight-medium">Vue.js Chat チャットルーム</h1>
    <div class="mt-10">
      <p>ログインユーザ：{{ userName }}さん</p>
      <textarea v-model="chatContent" variant="outlined" placeholder="投稿文を入力してください" rows="4" class="area"></textarea>
      <div class="mt-5">
        <button class="button-normal" @click="onPublish">投稿</button>
        <button @click="onMemo" class="button-normal util-ml-8px">メモ</button>
      </div>
      <div class="mt-5" v-if="chatList.length !== 0">
        <ul>
          <li class="item mt-4" v-for="(chat, i) in chatList" :key="i">{{ chat.sendBy }}{{ chat.content }}</li>
        </ul>
      </div>
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
  width: 500px;
  border: 1px solid #000;
  margin-top: 8px;
}

.item {
  display: block;
}

.util-ml-8px {
  margin-left: 8px;
}

.button-exit {
  color: #000;
  margin-top: 8px;
}
</style>
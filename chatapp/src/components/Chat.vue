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
const sortOrder = ref('newest');
// #endregion
const memoList = reactive([])

// #region lifecycle
onMounted(() => {
  registerSocketEvent()
})
// #endregion

//投稿をソートするプロパティ
const sortedChatList = computed(() => {
  // chatList のコピーを作成してソート（元の配列を変更しないため）
  const listCopy = [...chatList];

  if (sortOrder.value === 'newest') {
    // 新しい順: sendAt が新しいものほどリストの上に来るように降順でソート
    return listCopy.sort((a, b) => b.sendAt.getTime() - a.sendAt.getTime());
  } else {
    // 古い順: sendAt が古いものほどリストの上に来るように昇順でソート
    return listCopy.sort((a, b) => a.sendAt.getTime() - b.sendAt.getTime());
  }
});

// #region browser event handler
// 投稿メッセージをサーバに送信する
const onPublish = () => {

  // 入力欄を初期化

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

  // memoList.unshift(formatted);      // メモ専用リストに追加
  chatList.unshift(formatted);      // 表示中チャットにも追加（任意）
  chatContent.value = "";
  // 入力欄を初期化

}

// ★★★ ソート順を切り替えるメソッドの追加 ★★★
const sortByNewest = () => {
  sortOrder.value = 'newest';
};

const sortByOldest = () => {
  sortOrder.value = 'oldest';
};
// #endregion

// #region socket event handler
// サーバから受信した入室メッセージ画面上に表示する
const onReceiveEnter = (data) => {
  const message = new ChatMessage(
    0,                    // messageType: 0 = 入室
    data.userName,
    new Date(),           // 現在時刻
    "入室しました"
  )
  const formatted = `[${message.getFormattedTime()}] ${message.sendBy}さんが${message.content}`;
  chatList.push(formatted);
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

  })
}
// #endregion
</script>

<template>
  <div class="mx-auto my-5 px-4">
    <h1 class="text-h3 font-weight-medium">Vue.js Chat チャットルーム</h1>
    <div class="mt-10">
      <p>ログインユーザ：{{ userName }}さん</p>
      <textarea v-model="chatContent" placeholder="投稿文を入力してください" rows="4" class="area"></textarea>
      <div class="mt-5">
        <button class="button-normal">投稿</button>
        <button @click="onMemo" class="button-normal util-ml-8px">メモ</button>
      </div>
      <div class="mt-5">
        <v-btn
            @click="sortByNewest"
            :color="sortOrder === 'newest' ? 'primary' : ''"
            :variant="sortOrder === 'newest' ? 'flat' : 'outlined'"
            class="custom-sort-btn"
            small >
            新しい順
          </v-btn>
          <v-btn
            @click="sortByOldest"
            :color="sortOrder === 'oldest' ? 'primary' : ''"
            :variant="sortOrder === 'oldest' ? 'flat' : 'outlined'"
            class="custom-sort-btn"
            small >
            古い順
          </v-btn>
      </div>
      <div class="mt-5" v-if="chatList.length !== 0">
        <ul>
          <li class="item mt-4" v-for="(chat, i) in chatList" :key="i">{{ chat }}</li>
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
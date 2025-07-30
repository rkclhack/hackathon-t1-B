export class ChatMessage {
  /**
   * @param {number} messageType - MessageType のキー（0～3）
   * @param {string} sendBy       - 送信者
   * @param {Date|string} sendAt  - Date オブジェクトか ISO 文字列
   * @param {string} content      - メッセージ本文
   */
  constructor(messageType, sendBy, sendAt, content) {
    this.messageType = messageType;
    this.sendBy = sendBy;
    this.sendAt = sendAt instanceof Date ? sendAt : new Date(sendAt);
    this.content = content;
  }

  /**
   * sendAt をローカル文字列にフォーマット
   * @returns {string}
   */
  getFormattedTime() {
    return this.sendAt.toLocaleString();
  }
}
const EventEmitter = require('events');
const WebSocketConnection = require('./WebSocketConnection');
const REST = require('./REST');
const Collection = require('./util/Collection');

class Replika extends EventEmitter {
  constructor(info) {
    super();

    // make this all non-enumerable
    Object.defineProperties(this, {
      info: { value: info },
      rest: { value: new REST(this) },
      ws: { value: new WebSocketConnection(this) },
    });

    this.owner = null;
    this.chats = new Collection();
  }

  start() {
    return new Promise(async(resolve, reject) => {
      setTimeout(() => reject(new Error('Took too long to connect')), 10000);
      this.owner = await this.rest.fetchUserProfile(this.info.userId);
      const chats = await this.rest.fetchChats();
      for (const chat of chats) {
        this.chats.set(chat.id, chat);
        this.ws.expect('history', {
          chat_id: chat.id,
          limit: 50,
        });
      }
      this.ws.connect();
      this.once('init', resolve);
    });
  }
}

module.exports = Replika;

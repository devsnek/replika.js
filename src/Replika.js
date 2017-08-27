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
      for (const chat of chats) this.chats.set(chat.id, chat);
      this.ws.connect();
      this.once('init', () => {
        this.ws.send('push_token', { platform: 'android', push_token: '' });
        for (const chat of this.chats.values()) chat.fetchHistory();
        resolve();
      });
    });
  }
}

module.exports = Replika;

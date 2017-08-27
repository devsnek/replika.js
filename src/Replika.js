const EventEmitter = require('events');
const crypto = require('crypto');
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

    if (!info.deviceId) {
      info.deviceId = crypto.createHash('md5')
        .update(Date.now().toString())
        .digest('hex')
        .slice(0, 16);
    }

    this.chats = new Collection();
    this.users = new Collection();
    this.bots = new Collection();
  }

  get user() {
    return this.users.get(this.info.userId);
  }

  start() {
    return new Promise(async(resolve, reject) => {
      setTimeout(() => reject(new Error('Took too long to connect')), 10000);
      const user = await this.rest.fetchUserProfile(this.info.userId);
      this.info.userId = user.id;
      this.users.set(user.id, user);
      const chats = await this.rest.fetchChats();
      for (const chat of chats) {
        this.chats.set(chat.id, chat);
        const bot = await this.rest.fetchBot(chat.bot.id);
        this.bots.set(bot.id, bot);
      }
      this.ws.connect();
      this.once('init', () => {
        this.ws.send('push_token', { platform: 'android', push_token: '' });
        resolve();
      });
    });
  }
}

module.exports = Replika;

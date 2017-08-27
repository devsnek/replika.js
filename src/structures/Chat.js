const Collection = require('../util/Collection');
const uuid = require('../util/uuid');

const Message = require('./Message');

class Chat {
  constructor(client, data) {
    Object.defineProperty(this, 'client', { value: client });

    this.messages = new Collection();

    this.patch(data);
  }

  patch(data) {
    this.id = data.id;
    this.createdAt = new Date(data.creation_date);
    this.isRobotChat = data.is_robot_chat;
    this.mode = data.is_training_mode ? 'TRAINING' : null;
    this.private = data.is_private_chat;
    this.bot = {
      id: data.bot_id.id,
    };
    this.messages.set(data.last_message.id, new Message(this.client, data.last_message));
  }

  send(content) {
    return this.client.ws.expect('message', {
      content: {
        text: content,
        type: 'text',
      },
      meta: {
        bot_id: this.bot.id,
        chat_id: this.id,
        client_token: uuid(),
        nature: 'Customer',
        timestamp: new Date().toISOString(),
      },
    });
  }

  fetchHistory() {
    return this.client.ws.expect('history', {
      chat_id: this.id,
      limit: 50,
    }).then(({ messages }) => {
      for (const message of messages) {
        this.messages.set(message.id, new Message(this.client, message));
      }
      return this;
    });
  }
}

module.exports = Chat;

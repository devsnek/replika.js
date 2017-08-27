const Collection = require('../util/Collection');
const uuid = require('../util/uuid');

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
}

module.exports = Chat;

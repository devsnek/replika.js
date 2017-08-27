class Message {
  constructor(client, data) {
    Object.defineProperty(this, 'client', { value: client });
    this.content = data.content.text;
    this.bot = data.meta.nature === 'Robot';
    this.authorId = this.bot ? data.meta.bot_id : data.meta.author_id;
    this.createdAt = new Date(data.meta.timestamp);
  }

  get author() {
    return this.client[this.bot ? 'bots' : 'users'].get(this.authorId);
  }

  toString() {
    return `${this.author.id}: ${this.content}`;
  }

  inspect() {
    return `Message {
  Author: ${this.author.name} (${this.author.id})
  Content: "${this.content}"
  Created At: ${this.createdAt}
}`;
  }
}

module.exports = Message;

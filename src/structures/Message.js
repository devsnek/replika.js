class Message {
  constructor(client, data) {
    Object.defineProperty(this, 'client', { value: client });
    this.content = data.content.text;
    const bot = this.meta.nature === 'Robot';
    this.author = {
      bot,
      id: bot ? data.meta.author_id : data.meta.bot_id,
    };
    this.createdAt = new Date(data.meta.timestamp);
  }

  toString() {
    return `${this.author.id}: ${this.content}`;
  }
}

module.exports = Message;

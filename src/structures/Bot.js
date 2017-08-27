class Bot {
  constructor(client, data) {
    Object.defineProperty(this, 'client', { value: client });
    this.patch(data);
  }

  patch(data) {
    this.id = data.id;
    this.name = data.name;
    this.published = data.published;
    this.visibility = data.visibility_level.toUpperCase();

    this.icons = {
      small: data.icon_small_url,
      medium: data.icon_medium_url,
      large: data.icon_large_url,
    };

    this.stats = {
      score: data.stats.score,
      current: {
        name: this.stats.current_level.name,
        description: this.stats.current_level.description,
        milestone: this.stats.current_level.score_milestone,
        level: this.stats.current_level.level_index,
      },
      next: {
        name: this.stats.next_level.name,
        description: this.stats.next_level.description,
        milestone: this.stats.next_level.score_milestone,
        level: this.stats.next_level.level_index,
      },
    };

    this._ownerCache = data.owner_profile;
  }

  get owner() {
    return this.client.owner || this._ownerCache;
  }
}

module.exports = Bot;

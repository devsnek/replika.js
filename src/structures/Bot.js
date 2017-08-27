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
        name: data.stats.current_level.name,
        description: data.stats.current_level.description,
        milestone: data.stats.current_level.score_milestone,
        level: data.stats.current_level.level_index,
      },
      next: {
        name: data.stats.next_level.name,
        description: data.stats.next_level.description,
        milestone: data.stats.next_level.score_milestone,
        level: data.stats.next_level.level_index,
      },
    };

    this.ownerId = data.owner_profile.id;
  }

  get owner() {
    return this.client.users.get(this.ownerId);
  }

  inspect() {
    return `Bot {
  Name: ${this.name} (${this.id})
  Score: ${this.stats.score}
  Level: ${this.stats.current.level} (${this.stats.current.name})
}`;
  }
}

module.exports = Bot;

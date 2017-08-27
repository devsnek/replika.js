class UserProfile {
  constructor(client, data) {
    Object.defineProperty(this, 'client', { value: client });
    this.patch(data);
  }

  patch(data) {
    this.id = data.id;
    this.name = {
      first: data.first_name,
      last: data.last_name,
    };
    this.phone = data.phone_number;
    this.availableInvites = data.available_invites;
    this.presence = {
      online: data.presence.is_online,
      wentOffline: new Date(data.presence.last_went_offline_timestamp),
    };
  }
}

module.exports = UserProfile;

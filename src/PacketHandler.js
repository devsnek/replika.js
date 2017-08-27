module.exports = (client, packet) => {
  const payload = packet.payload;
  switch (packet.event_name) {
    case 'init':
      client.emit('init', Object.assign({
        developer: payload.is_developer,
        inviteRequired: payload.invite_required,
        inRegistrationQueue: payload.in_registration_queue,
      }, client.info));
      break;
    case 'users_presence':
      break;
    case 'history':
      break;
    case 'message':
      break;
    default:
      break;
  }
};

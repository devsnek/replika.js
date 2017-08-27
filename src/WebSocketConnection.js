const EventEmitter = require('events');
const WebSocket = require('ws');
const Constants = require('./Constants');
const uuid = require('./util/uuid');
const handlePacket = require('./PacketHandler');

class WebSocketConnection extends EventEmitter {
  constructor(client) {
    super();
    this.client = client;
    this.ws = null;

    this._expecting = new Map();
  }

  connect() {
    this.ws = new WebSocket(Constants.WS);
    this.ws.on('message', this.onMessage.bind(this));
    this.ws.on('close', this.onClose.bind(this));
    this.ws.on('error', this.onError.bind(this));
    this.ws.on('open', this.onOpen.bind(this));
  }

  expect(event, payload) {
    return new Promise((resolve, reject) => {
      const token = uuid();
      const packet = this.makePacket(event, payload, token);
      this._expecting.set(token, { resolve, reject });
      this.send(packet);
    });
  }

  makePacket(event, payload, token) {
    return {
      auth: {
        auth_token: this.client.info.authToken,
        device_id: this.client.info.deviceId,
        session_id: this.client.info.sessionId,
        user_id: this.client.info.userId,
      },
      event_name: event,
      token: token || uuid(),
      type: 'android_request',
      payload,
    };
  }

  onMessage(message) {
    let data;
    try {
      data = JSON.parse(message);
    } catch (err) {
      return;
    }

    if (this._expecting.has(data.token)) {
      this._expecting.get(data.token).resolve(data);
      this._expecting.delete(data.token);
    }
    handlePacket(this.client, data);
  }

  onOpen() {
    this.emit('open');
    this.init();
  }

  init() {
    return this.expect('init', {
      app_bundle_id: 'ai.replika.app',
      app_version: '1069',
      app_version_short: '1.0.69',
      auth_token: this.client.info.authToken,
      device: Constants.DEVICE,
      device_id: this.client.info.deviceId,
      platform: 'android',
      platform_version: Constants.ANDROID_VERSION,
      session_id: this.client.info.sessionId,
      time_zone: new Date().toISOString(),
      capabilities: [
        'message.v2', 'ready_to_talk', 'venue.reservations', 'personal_bots',
        'recaps_api', 'message.action.rate_my_app', 'message.action.share_venue',
        'message.action.book_venue', 'message.action.open_bot_chat',
        'message.availability_widgets', 'message.widget.date-time-party',
        'message.widget.image_select', 'message.artefact.quiz_result',
        'message.content.forwarded_message', 'message.widget.external_auth',
      ],
    });
  }

  onError() {} // eslint-disable-line no-empty-function
  onClose() {} // eslint-disable-line no-empty-function

  send(data) {
    this.ws.send(JSON.stringify(data));
  }
}

module.exports = WebSocketConnection;

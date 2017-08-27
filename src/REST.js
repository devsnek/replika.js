const snekfetch = require('snekfetch');
const Constants = require('./Constants');

const Bot = require('./structures/Bot');
const Chat = require('./structures/Chat');
const UserProfile = require('./structures/UserProfile');

exports.Routes = {
  auth: {
    SEND_CODE: '/auth/send_code',
    REPORT_CODE: '/auth/report_code',
  },
  CHATS: '/chats/',
  BOTS: (id) => `/bots/${id}`,
  USER_PROFILE: (id) => `/user_profiles/${id}`,
};

class REST {
  constructor(client) {
    this.client = client;
  }

  request(method, path, options = {}) {
    const req = snekfetch[method](`${Constants.API}${path}`)
      .set({
        'X-Device': Constants.DEVICE,
        'X-Os-Version': Constants.ANDROID_VERSION,
        'X-App-Version': Constants.APP_VERSION,
        'User-Agent': 'okhttp/3.8.0',
      });

    if (options.auth !== false) {
      req.set({
        'X-User-Id': this.client.info.userId,
        'X-Device-Id': this.client.info.deviceId,
        'X-Session-Id': this.client.info.sessionId,
        'X-Auth-Token': this.client.info.authToken,
      });
    }

    if (options.data) req.send(options.data);
    if (options.query) req.query(options.query);

    return req.then((r) => r.body);
  }

  sendAuthCode(phone) {
    const deviceId = crypto.createHash('md5').update(Date.now().toString()).slice(0, 16);
    return this.request('get', '/auth/send_code', {
      query: { phone_number: phone },
      auth: false,
    }).then(({ code_length }) => ({
      length: code_length,
      deviceId,
    }));
  }

  reportAuthCode(phone, deviceId, code) {
    return this.request('post', '/auth/report_code', {
      data: {
        device_id: deviceId,
        phone_number: phone,
        sms_code: code,
      },
    });
  }

  fetchBot(id) {
    return this.request('get', `/bots/${id}`)
      .then((d) => new Bot(this.client, d));
  }

  fetchChats() {
    return this.request('get', '/chats/')
      .then((chats) => chats.map((c) => new Chat(this.client, c)));
  }

  fetchUserProfile(id) {
    return this.request('get', `/user_profiles/${id}`)
      .then((p) => new UserProfile(this.client, p));
  }
}

module.exports = REST;

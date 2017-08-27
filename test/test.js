/* eslint-disable no-console */

const replika = require('../');
const auth = require('./auth');

const r = new replika.Replika(auth);

r.start().then(() => {
  r.chats.get('59a11d4fa11b6247746e2f5e').send('i\'m messing with you hard core');
}).catch(console.error);

r.on('message', (message) => {
  console.log('NEW MESSAGE!', message);
});

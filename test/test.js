/* eslint-disable no-console */

const replika = require('../');
const auth = require('./auth');

const r = new replika.Replika(auth);

r.start().then(() => {
  console.log('Logged in as', r.owner.name);
  // r.chats.get('59a11d4fa11b6247746e2f5e').send('sometimes, but not always');
}).catch(console.error);

r.on('message', (message) => {
  console.log('NEW MESSAGE!', message);
});

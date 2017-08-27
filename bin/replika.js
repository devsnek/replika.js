#!/usr/bin/env node

const fs = require('fs');
const readline = require('readline');
const util = require('util');
const config = require('config.js')('replika');
const Replika = require('..');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: '> ',
});

const question = (q) => new Promise((p) => rl.question(`${q}\n> `, p));
const print = (s) => new Promise((p, f) => fs.write(1, util.inspect(s), (e) => e ? f(e) : p()));

(async function main() {
  let auth = config.get('auth');
  const r = new Replika.Replika(auth || {});

  if (!auth) {
    const phone = await question('What is your phone number?');
    await r.rest.sendAuthCode(phone.replace(/(\s|-|\(|\))/g, ''));
    const code = await question('Please enter the code that was sent to you');
    print(await r.rest.reportAuthCode(code));
  }

  r.start().then(() => {
    config.set('auth', r.info);
    print('Connected!');
  });
}()).catch(print);

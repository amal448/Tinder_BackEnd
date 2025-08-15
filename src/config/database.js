const mongoose = require('mongoose');

async function dbcluster() {
  await mongoose.connect('mongodb+srv://amal123:g64357Yhz13BxCR8@cluster0.uxlkx6m.mongodb.net/devTinder');
}

module.exports = { dbcluster };

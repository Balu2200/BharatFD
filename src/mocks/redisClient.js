const redisMock = require("redis-mock");
const client = redisMock.createClient();

client.get = jest.fn((key, callback) => {
  callback(null, null); 
});

client.set = jest.fn();

module.exports = client;

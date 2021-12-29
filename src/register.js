const { Client, ClientApplication } = require("discord.js");

const commands = [
  {
    type: "MESSAGE",
    name: "チェック"
  },
  {
    type: "MESSAGE",
    name: "ゴーストチェック"
  }
];

require("dotenv").config();

(async () => {
  const client = new Client({ intents: 0 });
  client.token = process.env.BOT_TOKEN;
  client.application = new ClientApplication(client, {});

  await client.application.fetch();

  await client.application.commands.set(commands, process.argv[2]);

  console.log("Registration Success!");
})()
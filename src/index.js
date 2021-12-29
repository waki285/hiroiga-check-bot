const { Client, Intents, MessageButton, MessageActionRow, Message } = require("discord.js");
const { default: axios } = require("axios");

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES], allowedMentions: { repliedUser: true, parse: [] } });;

require("dotenv").config();

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}.`);
  client.user.setPresence({ activities: [{ name: "調べたい画像にメンション" }] });
});

client.on("messageCreate", async (message) => {
  if (!message.mentions.users.has(client.user.id)) return;
  if (!message.reference || !message.reference.messageId) return message.reply({
    embeds: [{
      title: "拾い画チェックbot",
      description: `画像があるメッセージに返信でこのbotにメンションすることで、画像が拾い画かどうか調べることができます。\n(見つからなかったからと言って拾い画でないことを保証するわけではありません。)\nTwitterの[拾い画チェックbot](https://twitter.com/imgcheck)のDiscord版です。`
    }], components: [new MessageActionRow().addComponents([
      new MessageButton().setURL("https://twitter.com/imgcheck").setStyle("LINK").setLabel("拾い画検知bot(本家)"),
      new MessageButton().setURL("https://imgcheck.irucabot.com/").setStyle("LINK").setLabel("本家様のサイト"),
      new MessageButton().setURL("https://twitter.com/iruca_bb").setStyle("LINK").setLabel("本家の開発者様"),
      new MessageButton().setURL("https://github.com/waki285/hiroiga-check-bot").setStyle("LINK").setLabel("ソースコード")
    ])]
  }).catch(() => { });

  /** @type {Message<true>} */
  const ref = await message.channel.messages.fetch(message.reference.messageId);
  if (!ref.attachments.size && !ref.embeds.filter(x => x.type === "image").length) return message.reply("そのメッセージには画像がありません。");
  const imageUrls = [];
  for (const url of ref.attachments.map(x => x.url)) imageUrls.push(url);
  for (const url of ref.embeds.filter(x => x.type === "image").map(x => x.url)) imageUrls.push(url);
  /** @type {Message} */
  const msg = await message.reply("調査中です...お待ち下さい");
  const promiseArr = imageUrls.map(async (image, i) => {
    try {
      const { data } = await axios({
        url: `https://api.irucabot.com/imgcheck/check_url?url=${encodeURIComponent(image)}`,
        responseType: "json",
        method: "get"
      });
      if (data.status !== "success") return `${i + 1}番目の画像: 失敗しました。`;
      if (data.found)
        return `${i + 1}番目の画像: **${data.count}**個の画像が見つかりました。\n${data.resulturl}`;
      else return `${i + 1}番目の画像: 画像が見つかりませんでした。`;
    } catch {
      return `${i + 1}番目の画像: 失敗しました。`;
    }
  });
  const fullResult = await Promise.all(promiseArr);
  msg.edit({
    content: null, embeds: [
      { description: fullResult.join("\n") }
    ]
  });
});

client.on("interactionCreate", async (i) => {
  if (!i.isMessageContextMenu()) return;
  /** @type {Message<true>} */
  const ref = await i.channel.messages.fetch(i.targetId);
  if (i.commandName === "チェック") {
    if (!ref.attachments.size && !ref.embeds.filter(x => x.type === "image").length) return i.reply({ content: "そのメッセージには画像がありません。", ephemeral: true });
    const imageUrls = [];
    for (const url of ref.attachments.map(x => x.url)) imageUrls.push(url);
    for (const url of ref.embeds.filter(x => x.type === "image").map(x => x.url)) imageUrls.push(url);
    await i.deferReply();
    const promiseArr = imageUrls.map(async (image, i) => {
      try {
        const { data } = await axios({
          url: `https://api.irucabot.com/imgcheck/check_url?url=${encodeURIComponent(image)}`,
          responseType: "json",
          method: "get"
        });
        if (data.status !== "success") return `${i + 1}番目の画像: 失敗しました。`;
        if (data.found)
          return `${i + 1}番目の画像: **${data.count}**個の画像が見つかりました。\n${data.resulturl}`;
        else return `${i + 1}番目の画像: 画像が見つかりませんでした。`;
      } catch {
        return `${i + 1}番目の画像: 失敗しました。`;
      }
    });
    const fullResult = await Promise.all(promiseArr);
    i.followUp({
      content: null, embeds: [
        { description: fullResult.join("\n") }
      ]
    });
  } else if (i.commandName === "ゴーストチェック") {
    if (!ref.attachments.size && !ref.embeds.filter(x => x.type === "image").length) return i.reply({ content: "そのメッセージには画像がありません。", ephemeral: true });
    const imageUrls = [];
    for (const url of ref.attachments.map(x => x.url)) imageUrls.push(url);
    for (const url of ref.embeds.filter(x => x.type === "image").map(x => x.url)) imageUrls.push(url);
    await i.deferReply({ ephemeral: true });
    const promiseArr = imageUrls.map(async (image, i) => {
      try {
        const { data } = await axios({
          url: `https://api.irucabot.com/imgcheck/check_url?url=${encodeURIComponent(image)}`,
          responseType: "json",
          method: "get"
        });
        if (data.status !== "success") return `${i + 1}番目の画像: 失敗しました。`;
        if (data.found)
          return `${i + 1}番目の画像: **${data.count}**個の画像が見つかりました。\n${data.resulturl}`;
        else return `${i + 1}番目の画像: 画像が見つかりませんでした。`;
      } catch {
        return `${i + 1}番目の画像: 失敗しました。`;
      }
    });
    const fullResult = await Promise.all(promiseArr);
    i.followUp({
      content: null, embeds: [
        { description: fullResult.join("\n") }
      ]
    });
  }
})

client.login(process.env.BOT_TOKEN)
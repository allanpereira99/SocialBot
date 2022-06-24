const TelegramBot = require("node-telegram-bot-api");
const dotenv = require("dotenv");
const api = require("social-media-down");
const downloader = require("./utils/downloader");
dotenv.config();

const bot = new TelegramBot(process.env.BOT_TOKEN, {
  polling: true,
});
bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, `Welcome ${msg.from.first_name}`, {
    reply_to_message_id: msg.message_id,
  });
});
bot.onText(
  /https\:(\/){2}twitter.com(\.br|)\/\w{1,}\/status\/(\d|\w|[.&?=-]){1,}/,
  (msg) => {
    api
      .twitter(msg.text)
      .then((response) => {
        return response.data.url;
      })
      .then((url) => {
        downloader(url).then((video) => {
          bot.sendVideo(msg.chat.id, video, {
            reply_to_message_id: msg.message_id,
          });
        });
      });
  }
);
bot.onText(
  /https\:(\/){2}(www.|)tiktok.com\/\@(\d|\w|[.]){1,}\/video\/(\d|\w|[?=&]){1,}/,
  (msg) => {
    api
      .tiktok(msg.text)
      .then((response) => {
        return response.data.link;
      })
      .then((url) => {
        downloader(url).then((video) => {
          bot.sendVideo(msg.chat.id, video, {
            reply_to_message_id: msg.message_id,
          });
        });
      });
  }
);
bot.onText(/\/help/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
    "Just send a link to a twitter, tiktok video, if the video exists it will be returned.",
    { reply_to_message_id: msg.message_id }
  );
});
bot.on("polling_error", console.log);

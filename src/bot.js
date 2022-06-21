const TelegramBot = require("node-telegram-bot-api");
const dotenv = require("dotenv");
dotenv.config();

const bot = new TelegramBot(process.env.BOT_TOKEN, {
  polling: true,
});

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, `Welcome ${msg.from.first_name}`, {
    reply_to_message_id: msg.message_id,
  });
});
bot.onText(/\/help/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
    "Just send a link to a twitter video, if the video exists it will be returned.",
    {
      reply_to_message_id: msg.message_id,
    }
  );
});

bot.on("message", (msg) => {
  const text = msg.text;
  const chatId = msg.chat.id;
  if (
    text.match(
      /https\:(\/){2}twitter.com(\.br|)\/\w{1,}\/status\/(\d|\w|[.&?=-]){1,}/g
    )
  ) {
    const getMedia = require("./lib/getMedia");
    const mediaDownloder = require("./utils/downloader");
    getMedia
      .twitter(text)
      .then((response) => {
        mediaDownloder(response)
          .then((res) => {
            bot.sendVideo(chatId, res, {
              reply_to_message_id: msg.message_id,
            });
          })
          .catch(() => {
            console.log("error when searching for video");
          });
      })
      .catch((err) => {
        console.log(err);
      });
  }
});
bot.on("polling_error", console.log);

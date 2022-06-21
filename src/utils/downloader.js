const download = require("download");

function mediaDownloader(url) {
  return new Promise((resolve) => {
    resolve(download(url));
  });
}
module.exports = mediaDownloader;

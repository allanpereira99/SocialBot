class getMedia {
  static twitter(url) {
    const twitter = require("twitter-url-direct");
    const regex = /\?+tag=\w+$/g;
    return new Promise((resolve) => {
      twitter(url).then((resp) => {
        let url = resp.download[resp.dimensionsAvailable - 1].url.replace(
          resp.download[resp.dimensionsAvailable - 1].url.match(regex),
          ""
        );
        resolve(url);
      });
    });
  }
}
module.exports = getMedia;

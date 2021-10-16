const fs = require('fs');
module.exports = {
  stop() {
    process.exit(0);
  },
  clearLogs(console) {
    fs.readdir("./logs", { encoding: "utf-8" }, (err, files) => {
      if (err) return console.error("Unable to delete logs!");
      files.forEach((value, index, array) => {
        fs.rm("./logs/"+value, { force: true }, () => {});
      });
    });
    console.log("Cleared Logs!");
  },
  history(console) {
    console.log(console.history.toString());
  }
}
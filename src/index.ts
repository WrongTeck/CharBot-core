import { spawn } from "node:child_process";
const maxRetries = 5;


function main(retries: number) {
  const child = spawn("node", ["botStart.js"], {
    stdio: "inherit",
    env: {
      PATH: process.env.PATH,
    },
  });
  // TODO: Implement the logger there and not in the bot
  // TODO: Needed the implementation of more exit code with a meaning
  child.on("exit", (code, _signal) => {
    if(code == 0) {
      console.log("Exited with code 0. Exiting normally...");
      process.exit(0);
    } else {
      console.error("A non-zero exit code has been detected, trying to restart...");
      if(retries >= maxRetries)
        return console.log("Maximum restart retries reached!");
      main(retries + 1);
    }
  });
}
main(0);


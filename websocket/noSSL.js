const config = require('../config/main.json');
const ws = require('ws');
const usage = require('usage');
const fs = require('fs');
function execute(client, db) {
    const wss = new ws.Server({ port: config.websocket.port, path: "/admin" });
    wss.on('connection', (connection, req) => {
        connection.on('ping', (data) => {
            connection.pong(data);
        });
        connection.on('message', (data) => {
            switch (data) {
                case "shutdown":
                    connection.send('The bot will shutdown in few seconds');
                    process.exit(0);
                    break;
                case "status":
                    usage.lookup(process.pid, (err, result) => {
                        connection.send(`CPU: ${Math.trunc(result.cpu)}%\nRAM: ${Math.floor(result.memory / (1024 * 1024))}MB\nPing: ${client.ws.ping}ms`);
                    });
                    break;
                default:
                    connection.send("I don't know what is this! Use help to view the help");
                    break;
            }
        });
        fs.readdir('./plugins', (err, files) => {
            //Load all plugins from the folder
            if (err) {
                console.error(err);
                process.exit(1);
            }
            files.forEach((f, i, array) => {
                const element = require(`./plugins/${f[i]}/index.js`);
                element.main(wss, client, db);
            });
        });
    });
}
module.exports = { execute };

const main = require('./config/main.json');
const discord = require('discord.js');
const client = new discord.Client();
const fs = require('fs');
const { MongoClient } = require('mongodb');
const clientMongo = new MongoClient(main.mongodb.connection_str);
async function mongo() {
    await clientMongo.connect();
    let db = clientMongo.db(main.mongodb.name);
    return db;
}
client.on('ready', () => {
    fs.readdir('./plugins', (err, files) => {
        //Load all plugins from the folder
        if (err) {
            console.error(err);
            process.exit(1);
        }
        let db = mongo();
        files.forEach((f, i, array) => {
            const element = require(`./plugins/${f[i]}/index.js`);
            element.main(client, db);
        });
    });
    if (main.websocket.ssl.use) {
        let start = require('./websocket/useSSL.js');
        start.execute(client, mongo());
    }
    else {
        let ol = require('./websocket/noSSL.js');
        ol.execute(client, mongo());
    }
    console.log('Ready! ' + client.ws.ping + "ms");
});
//keep this at the bottom of this file
client.login(main.discord.token); //Login in to the discord API

const config=require('./config/main.json');

const discord=require('discord.js');
const client=new discord.Client();

const fs=require('fs');

const { MongoClient }=require('mongodb');

const clientMongo=new MongoClient(config.mongodb.connection_str);
async function mongo(){
    await clientMongo.connect();
    let db=clientMongo.db(config.mongodb.name);
    return db;
}
if(config.websocket.ssl.use){
    let start=require('./websocket/useSSL.js');
    start.execute(client);
}else{
    let start=require('./websocket/noSSL.js');
    
}
//keep this at the bottom of this file
client.login(config.discord.token); //Login in to the discord API
fs.readdir('./plugins',(err,files)=>{
    //Load all plugins from the folder
    if(err) return console.error(err) && process.exit(1);
    let db=mongo();
    files.forEach((f,i,array)=>{
        const element=require(`./plugins/${f[i]}/index.js`);
        element.main(client,db);
    });
});

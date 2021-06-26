const config=require('../config/main.json');
const ws=require('ws');
const wss=new ws.Server({port:config.websocket.port,path:"/admin"});
function execute(client){
    wss.on('connection',(connection,req)=>{
        connection.on('ping',(data)=>{
            connection.pong(data);
        });
        connection.on('message',(data)=>{
            switch(data){
                case "shutdown":
                    connection.send('The bot will shutdown in few seconds');
                    process.exit(0);
                    break;
                case "status":
                    connection.send(`CPU:${process.cpuUsage()}\nRAM:${process.memoryUsage()}\nPing:${client.ws.ping}`);
                    break;
                default:
                    connection.send("I don't know what is this! Use help to view the help");
                    break;
            }
        });
    });
}
exports.modules={execute};
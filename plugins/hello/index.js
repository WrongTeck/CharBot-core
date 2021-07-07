const {Plugins}=require('../../Plugins');
class Plugin extends Plugins{
    constructor(chairbot){
        super("");
        super.load('hello',chairbot);
        this.main=this.main;
    }
    main(chairbot){
        chairbot.discord.on('message',message=>{
            if(!message.author.bot){
                message.reply('Hello!');
            }
        });
    }
}
module.exports={Plugin};
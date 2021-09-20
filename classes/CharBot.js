const Logger = require('./Logger');
const Base = require("./Base");
var version = "0.1-ALPHA"

class CharBot extends Base {
    constructor() {
      let bot = super();
      this.bot = bot;
      this.commands();
      this.logger = new Logger(console);
      //this.pluginsloader();
      this.logger.log(`Starting CharBot v${version}...`);
      return this;
    }
    pluginsloader() {
      const fs = require('fs');
      fs.readdir('./plugins', (err, files) => {
          this.logger('PL', 'Loading plugins...');
          if (err)
              return this.logger('fatal', `Could not read the plugins folder! \n ${err}`);
          for (const key in files) {
              try {
                  if(!files[key].includes('.')){
                      let config = require(`./plugins/${files[key]}/plugin.json`);
                      if (config.enable) {
                          const { CPlugin } = require(`./plugins/${files[key]}/index.js`);
                          const p = new CPlugin(bot);
                          p.main();
                          this.logger('PL', `Loaded ${config.name} ${config.version}`);
                      }
                  }
              }
              catch (error) {
                  this.logger('err1', `Could not load ${files[key]}\n ${error}`);
              }
          }
          this.logger('info', 'ChairBot is ready!');
      });
    }
    keyhandler() {
          process.on("SIGINT", (signal) => {
              this.logger.log("Shutting down...");
              //this.unloader();
              process.exit(0);
            });
    }
    commands(){
      const fs = require('fs');
      process.stdin.on('data', (data) => {
          data=data.toString().replace('\n', '');
          fs.appendFile(`./logs/${this.log}.log`, `> ${data}\n`, (err) => {
              if(err) return console.error(err) && process.exit(1);
          });
          switch (data) {
              case 'stop':
                  this.stop();
                  break;
              case 'plugins':
                  if(this.plugins == {}) {
                      for(let key in Object.keys(this.plugins)){
                          this.logger('info', `${this.plugins[Object.values(this.plugins)[key]].name}`);
                      }
                  } else {
                      this.logger.log('No plugin were loaded!');
                  }
                  break;
              case 'help':
                  this.logger.log(fs.readFileSync('./help.txt', 'utf8') );
                  break;
              case '':
                  this.logger.log('Type "help" for help!');
                  break;
              case 'clearlogs':
                  fs.readdir('./logs', (err, files)=>{
                      if(err){
                          this.logger.error(err);
                      }
                      else{
                          for(let i=0; i<files.length; i++){
                              if(files[i].toString()!==this.log+'.log'){
                                  fs.unlink('./logs/'+files[i],(err)=>{
                                      if(err){
                                          this.logger.error(err);
                                      }
                                  });
                              }
                          }
                          this.logger.log('Logs cleared!');
                      }
                  });
                  break;
              default:
                  this.logger.error(`Unknown command: ${data}`);
                  break;
          }
      });
    }
  }

module.exports = CharBot;
const fs = require('fs');
const exec = require('node:child_process').exec;
const https = require('https');

console.log('Installing the git-manager');
exec("npm i ");
if(!fs.existsSync('index.js')) {
  console.log("Seems there's any index.js. Fixing it!");
  https.get('https://wrongteck.ga/chairbot/latest-version', res => {
    res.on('data', d =>{
      let data = JSON.parse(d);
      console.log(`Found version ${data.version} on the server!\nDownloading it...`);
      
    })
  });
}
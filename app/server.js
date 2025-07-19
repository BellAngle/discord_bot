const http = require('http');
const querystring = require('querystring');
const discord = require('discord.js');
const client = new discord.Client();
const mainChannelId = 961275112747839640;

http.createServer(function(req, res){
  if (req.method == 'POST'){
    var data = "";
    req.on('data', function(chunk){
      data += chunk;
    });
    req.on('end', function(){
      if(!data){
        res.end("No post data");
        return;
      }
      var dataObject = querystring.parse(data);
      console.log("post:" + dataObject.type);
      if(dataObject.type == "wake"){
        console.log("Woke up in post");
        res.end();
        return;
      }
      res.end();
    });
  }
  else if (req.method == 'GET'){
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Discord Bot is active now\n');
  }
}).listen(3000);

client.on('ready', message =>{
  console.log('Bot準備完了～');
  client.user.setPresence({ activity: { name: 'げーむ' } });
});


client.on('message', message =>{
  /*
  if (message.author.id == client.user.id || message.author.bot){
    return;
  }
  if(message.isMemberMentioned(client.user)){
    sendReply(message, "呼びましたか？");
    return;
  }
  if (message.content.match(/ひとつ|ふたつ|みっつ/)){
    let text = "よっつ";
    sendMsg(message.channel.id, text);
    return;
  }

  if (message.content.match(/ひとつ|ふたつ|みっつ/)){
    let text = "よっつ";
    sendMsg(message.channel.id, text);
    return;
  }
  
  if (message.content.match(/^！おみくじ/) ||
      (message.isMemberMentioned(client.user) && message.content.match(/おみくじ/))){
    let arr = ["よさそう", "いいかも", "最高","素晴らしい","どんどんいこう"];
    lottery(message.channel.id, arr);
  }else if (message.isMemberMentioned(client.user)) {
    sendReply(message, "呼びましたか？");
  }
  if (message.content.match(/^！サバイバー/) ||
    (message.isMemberMentioned(client.user) && message.content.match(/おみくじ/))){ 
    let arr = ["医師", "弁護士", "泥棒","庭師","マジシャン","冒険家","傭兵","空軍","祭司","機械技師","オフェンス","心眼","調香師","カウボーイ","踊り子","占い師","納棺師","探鉱者","呪術師","野人","曲芸師","一等航海士","バーメイド","ポストマン","墓守","囚人","昆虫学者","画家","バッツマン","玩具職人","患者","心理学者","小説家","少女","泣きピエロ","幸運児",""];
    for(var i=0;i<4;i++){
      lottery(message.channel.id, arr);
    }
  }
  if (message.content.match(/^！ハンター/) ||
    (message.isMemberMentioned(client.user) && message.content.match(/おみくじ/))){
    let arr = ["泥棒","復讐者", "道化師","断罪狩人","リッパ－","結魂者","芸者","白黒無常","写真家","狂眼","黄衣の王","夢の魔女","泣き虫","魔トカゲ","血の女王","ガードNo.26","使徒","ヴァイオリニスト","彫刻師","アンデッド","破輪","漁師","蝋人形師","悪夢","書記官"];
    lottery(message.channel.id, arr);
  }
  
  if (message.content.match(/^！なぐさめ/) ||
      (message.isMemberMentioned(client.user) && message.content.match(/なぐさめ/))){ 
      let arr = ["ドンマイ、そういう日もある","気にしすぎだよ！","お前が悪いよ！"];
    lottery(message.channel.id, arr);
  }

  if (message.content.match(/^！ぴよ|^！ぴよさん|^！たしぴよ|^！31歳/) ||
      (message.isMemberMentioned(client.user) && message.content.match(/ぴよ/))){
      let arr = ["岐阜県本巣","谷村貴稔","30歳","162cm","保育園の頃の初恋の相手「ktm」、今は嫌い","足25.5cm","生年月日1991/6/23","左利き","剣道1級","数検2級","普通免許持ち","TOEIC童貞"];
      let weight = [2,2,30,30,1,30,30,70,70,70,70,70];
      lotteryByWeight(message.channel.id, arr,weight);
  }
*/
  
  
  let prefix = "!keisan";
  if (message.content.indexOf(prefix) !== 0) return;
  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  if(command === "math"){
    if(!args[0]) return message.reply('モードを選んでください。\n 例：足し算だったら plus')
    if(!args[1] || !args[2]) return message.reply('計算する内容がありません')
    if(args[0] === "plus"){
      ++args[1];
      args[2]++;
      let k = args[1] - 1 + args[2] - 1;
      message.channel.send('${args[1]-1} + ${args[2]-1} = ${k}')
    }
  }

  
  
  
  
});

function lottery(channelId, arr){
  let random = Math.floor( Math.random() * arr.length);
  sendMsg(channelId, arr[random]);
}

function lotteryByWeight(channelId, arr, weight){
  let totalWeight = 0;
  for (var i = 0; i < weight.length; i++){
    totalWeight += weight[i];
  }
  let random = Math.floor(Math.random() * totalWeight);
  for (var i = 0; i < weight.length; i++){
    if (random < weight[i]){
      sendMsg(channelId, arr[i]);
      return;
    }else{
      random -= weight[i];
    }
  }
  console.log("lottery error");
}

if(process.env.DISCORD_BOT_TOKEN == undefined){
 console.log('DISCORD_BOT_TOKENが設定されていません。');
 process.exit(0);
}

client.login( process.env.DISCORD_BOT_TOKEN );

function sendReply(message, text){
  message.reply(text)
    .then(console.log("リプライ送信: " + text))
    .catch(console.error);
}

function sendMsg(channelId, text, option={}){
  client.channels.get(channelId).send(text, option)
    .then(console.log("メッセージ送信: " + text + JSON.stringify(option)))
    .catch(console.error);
}

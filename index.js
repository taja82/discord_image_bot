var Discordie = require("discordie");

var cheerio = require('cheerio');//스크래핑
var request = require('request');//파싱

var replaceall = require('replaceall');

var express = require('express');
var app     = express();

var Events = Discordie.Events;

var client = new Discordie();



app.listen(process.env.PORT || 3000, function(){
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});
app.get('/', function (req, res) {
   //res.send('Hello World!');
   res.sendFile(__dirname + '/index.html');
});

function getRandomInt(min, max) { //min ~ max 사이의 임의의 정수 반환
    return Math.floor(Math.random() * (max - min)) + min;
}

client.connect({ token: "NDAyNTcwNzk3MTE1NTA2Njg4.DT6q0A.tWjEzhy_HaEpudMmqifd3cvbmaA" });

client.Dispatcher.on(Events.GATEWAY_READY, e => {
console.log("Connected as: " + client.User.username);
});


//var ran = getRandomInt(1,40);

client.Dispatcher.on(Events.MESSAGE_CREATE, e => {
if (e.message.content == "ping") {
e.message.channel.sendMessage("pong");
}
console.log(e.message.content.substring(0, 7));
console.log(e.message.content.substring(7));
if (e.message.content.substring(0, 7) == "random_") {
	var rooturl = 'http://safebooru.org/';
	var url = 'http://safebooru.org/index.php?page=post&s=list&tags=' + e.message.content.substring(7) + '&pid=' + getRandomInt(1,10)*40;  
	request(url, function(error, response, html){  
    if (error) {throw error};

   //console.log (html);

    var $ = cheerio.load(html);
	//url = rooturl + $('span.thumb').find("a").eq(getRandomInt(1,40)).attr("href");
	var imgurl = $('span.thumb').find("img").eq(getRandomInt(1,40)).attr("src");
    //$('span.thumb').each(function(){
		
        
		
		/*request(url, function(error, response, html){  
		if (error) {throw error};
		$ = cheerio.load(html);
		url = "http:" + $('img#image').attr("src");
		console.log("이미지링크 : " + url);
		e.message.channel.sendMessage(url,false,{image:{url:"http:" + $('img#image').attr("src")}});
		});
		*/
		imgurl = "http:" + imgurl.replace("thumbnails","images").replace("thumbnail_","");
		//replaceall("thumbnails","samples",imgurl);
		console.log("이미지링크 : " + "http:" + imgurl);
		//replaceall("thumbnails","samples",imgurl);
		if(imgurl != 'undefined') {
			e.message.channel.sendMessage("",false,{image:{url:"http:" + imgurl}});
		} else {
			e.message.channel.sendMessage("사진이 존재하지 않는 것 같습니다. 조건에 맞게 입력하셨는지 확인해 주시기 바랍니다.");
		}
    //})

});
	//e.message.channel.sendMessage(ran);
}
});

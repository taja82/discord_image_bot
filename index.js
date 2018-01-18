var Discordie = require("discordie");

var cheerio = require('cheerio');//스크래핑
var request = require('request');//파싱

var replaceall = require('replaceall');
var rp = require('request-promise');
var Promise = require('promise');
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



function getRandomInt(min, max) { //범위 내에서 랜덤 값 소환
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
	url = rooturl + $('span.thumb').find("a").eq(getRandomInt(1,40)).attr("href");
	
    $('span.thumb').each(function(){
		
        
		
		request(url, function(error, response, html){  
		if (error) {throw error};
		$ = cheerio.load(html);
		url = "http:" + $('img#image').attr("src");
		console.log("이미지링크 : " + url);
		e.message.channel.sendMessage(url,false,{image:{url:"http:" + $('img#image').attr("src")}});
		});
		
		imgurl = imgurl.replace("thumbnails","images").replace("thumbnail_","");
		console.log("이미지링크 : " + "http:" + imgurl);
		var options = {
			uri: url,
			transform: function (body) {
				return cheerio.load(body);
			}
		};

		rp(options)
			.then(function ($) {
			// Process html like you would with jQuery...
					var imgurl = $('span.thumb').find("img").eq(getRandomInt(1,40)).attr("src");
					imgurl = imgurl.replace("thumbnails","images").replace("thumbnail_","");
					console.log("이미지링크 : " + "http:" + imgurl);
					
					e.message.channel.sendMessage("",false,{image:{url:imgurl.substring(2)}});
					console.log(imgurl.substring(2));
			})
			.catch(function (err) {
				e.message.channel.sendMessage("로딩에 실패하였습니다.");
			});
			
			
			
			/*var asyncfunction = function(param){

			return new Promise(function(resolved,rejected){

			setTimeout(
                 function(){
                       var imgurl = $('span.thumb').find("img").eq(getRandomInt(1,40)).attr("src");//사이트에 한 페이지의 40개의 이미지가 있기 때문에 랜덤으로 불러오기 위해 쓰임
					imgurl = imgurl.replace("thumbnails","images").replace("thumbnail_","");//텀브네일 사진을 일반 사진으로 바꿈
					console.log("이미지링크 : " + "http:" + imgurl);
					
					e.message.channel.sendMessage("",false,{image:{url:imgurl.substring(2)}});//그리고 소환
					console.log(imgurl.substring(2));
                 },2000);
			});
			}
			var promise = asyncfunction(' terry ');
			promise.then(console.log,console.err); // 여기가 비동기 결과에 대한 콜백함
*/
 

		
		/*if(imgurl != null) {
			e.message.channel.sendMessage("",false,{image:{url:imgurl.substring(2)}});
			console.log(imgurl.substring(2));
		} else {
			e.message.channel.sendMessage("사진이 존재하지 않는 것 같습니다. 조건에 맞게 입력하셨는지 확인해 주시기 바랍니다.");
		}*/
    //})

});
	//e.message.channel.sendMessage(ran);
}
});

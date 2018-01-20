var Promise = require('promise');
var Discordie = require("discordie");

var cheerio = require('cheerio');//스크래핑
var request = require('request');//파싱

var replaceall = require('replaceall');
var rp = require('request-promise');

var express = require('express');
var app     = express();

var Events = Discordie.Events;//디스코드 이벤트

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

client.connect({ token: "NDAyNTcwNzk3MTE1NTA2Njg4.DT6q0A.tWjEzhy_HaEpudMmqifd3cvbmaA" });//토큰

client.Dispatcher.on(Events.GATEWAY_READY, e => {
	console.log("Connected as: " + client.User.username);//봇이 연결되었을때
});



client.Dispatcher.on(Events.MESSAGE_CREATE, e => {
	
	var command = e.message.content;
	if(/\s+/gm.test(e.message.content) == true) {//뛰어쓰기 여러개일 시 한개로 줄임
		command = e.message.content.replace(/\s+/gm," ");
		//console.log(command);
	}
	if (command.split(" ")[0] == "ping") {
		e.message.channel.sendMessage("pong");
	}
	if (command.split(" ")[0] == "help") {
		e.message.channel.sendMessage("help 아직 미구현");
	}
	if (command.split(" ")[0] == "random") {
		//console.log(command.split(" ")[1]);
		
		var reg = /\"[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*\"/gi;
		if(reg.test(command.split(" ")[1]) == true) {
			var $ = "";
			var rooturl = 'http://safebooru.org/';
			console.log(command.split(" ")[1].substring(1,command.split(" ")[1].length-1));
			
			var last_page_link = "";
			var last_page = "";
			
			var url = 'http://safebooru.org/index.php?page=post&s=list&tags=' + command.split(" ")[1].substring(1,command.split(" ")[1].length-1);
			
			//검색 결과에 전체 몇 페이지가 있는지 알아보기 위해 어쩔 수 없이 파싱을 2번 하였습니다.
			//머리 좋은 사람들이 고쳐줘요 엉엉
			request(url, function(error, response, body) {//
				$ = cheerio.load(body);
				//console.log(body);
				last_page_link = $("a[alt='last page']").attr("href");
				
				last_page = last_page_link.substring(last_page_link.lastIndexOf("pid") + 4);
				console.log(last_page);
			});
			
			url = 'http://safebooru.org/index.php?page=post&s=list&tags=' + command.split(" ")[1].substring(1,command.split(" ")[1].length-1) + '&pid=' + getRandomInt(0,last_page/40)*40;
			request (url, function(error,response,body) {
				//console.log(url);
				$ = cheerio.load(body);
				var thumburl = "http:" + $('span.thumb').find("img").eq(getRandomInt(1,40)).attr("src");
				if (error) {throw error};
				var asyncfunction = function(){
					return new Promise(function(resolved,rejected){
						setTimeout(
							function(){
								
				
								imgurl = thumburl.replace("thumbnails","images").replace("thumbnail_","");
								console.log("이미지링크 : " + imgurl);
								console.log("텀넬이미지 : " + thumburl);
								//e.message.channel.sendMessage(imgurl,false,{image:{url:thumburl}});//그리고 소환
								e.message.channel.sendMessage("",false,{image:{url:imgurl}});
							},2000
						);
					});
				}
				var promise = asyncfunction();

				promise.then(console.log,console.err); // 여기가 비동기 결과에 대한 콜백함
			})
		} else {
			e.message.channel.sendMessage("명령어 형식에 맞지 않습니다. 다시 시도해 주세요.");
		}
	}
})
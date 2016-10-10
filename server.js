var http = require('http');
var express = require('express');
var socket = require('socket.io');
var wpi = require('wiring-pi');
var Gpio = require('onoff').Gpio;

var app = express();
var server = http.createServer(app);
var io = socket(server);
var client = null;

io.on('connection',function(socket){
	client = socket;
});

//motor init
wpi.setup('gpio');
wpi.pinMode(16,wpi.OUTPUT);	//motorA inputA
wpi.pinMode(19,wpi.OUTPUT);	//motorA inputB
wpi.pinMode(20,wpi.OUTPUT);	//motorB inputA
wpi.pinMode(26,wpi.OUTPUT);	//motorB inputB

wpi.digitalWrite(16,wpi.LOW);  
wpi.digitalWrite(19,wpi.LOW);
wpi.digitalWrite(20,wpi.LOW);
wpi.digitalWrite(26,wpi.LOW);


//irsensor init
var ir1 = new Gpio(23,'in','both');
var ir2 = new Gpio(24,'in','both');
var o=[0,0], n=[0,0];
var lastuptime=0;

//function for detect
function detected(){
	if(o[0]!==n[0] || o[1]!==n[1]){
		console.log('-------------');
		console.log(n[0]+' '+n[1]);
		move(n[0],n[1]);
		o[0]=n[0];
		o[1]=n[1];
		console.log(process.uptime()*1000);
		console.log('-------------');
	}
}
//action from sensing
function move(l,r){
	if(l===1&&r===1){
		if(client!=null) client.emit('not',{});
		console.log("go");
		RC('go');
	}else if(l===1&&r===0){
		if(client!=null) client.emit('left',{});
		console.log("back");
		lastuptime = process.uptime()*1000;
		while((process.uptime()*1000-lastuptime)<100){
			RC('back');
		}
		console.log("right");
		lastuptime = process.uptime()*1000;
		while((process.uptime()*1000-lastuptime)<250){
			RC('right');
		}
	}else if(l===0&&r===1){
		if(client!=null) client.emit('right',{});
		console.log("back");
		lastuptime = process.uptime()*1000;
		while((process.uptime()*1000-lastuptime)<100){
			RC('back');
		}console.log("left");  
		lastuptime = process.uptime()*1000;
		while((process.uptime()*1000-lastuptime)<250){
			RC('left'); 
		}
	}else if(l===0&&r===0){
		if(client!=null) client.emit('both',{});
		console.log("back");
		lastuptime = process.uptime()*1000;
		while((process.uptime()*1000-lastuptime)<150){
			RC('back');
		}  
		console.log("right");
		lastuptime = process.uptime()*1000;
		while((process.uptime()*1000-lastuptime)<400){
			RC('right');
		}
		console.log("stop");
		RC('stop');
	}
}

//function for moving
function RC(act){
	if(act==='go'){
		//console.log("go");
		wpi.digitalWrite(16,wpi.LOW);
		wpi.digitalWrite(19,wpi.HIGH);
		wpi.digitalWrite(20,wpi.LOW);
		wpi.digitalWrite(26,wpi.HIGH);
	}else if(act==='back'){
		//console.log("back");
		wpi.digitalWrite(16,wpi.HIGH);
		wpi.digitalWrite(19,wpi.LOW);
		wpi.digitalWrite(20,wpi.HIGH);
		wpi.digitalWrite(26,wpi.LOW);
	}else if(act==='left'){
		//console.log("left");
		wpi.digitalWrite(16,wpi.HIGH);
		wpi.digitalWrite(19,wpi.HIGH);
		wpi.digitalWrite(20,wpi.LOW);
		wpi.digitalWrite(26,wpi.HIGH);
	}else if(act==='right'){
		//console.log("right");
		wpi.digitalWrite(16,wpi.LOW);
		wpi.digitalWrite(19,wpi.HIGH);
		wpi.digitalWrite(20,wpi.HIGH);		
		wpi.digitalWrite(26,wpi.HIGH);
	}else if(act==='stop'){
		//console.log("stop");
		wpi.digitalWrite(16,wpi.LOW);
		wpi.digitalWrite(19,wpi.LOW);
		wpi.digitalWrite(20,wpi.LOW);
		wpi.digitalWrite(26,wpi.LOW);
	}
}

app.use(express.static(__dirname + '/public'));
app.get('/cmd.do', function(req, res){
	console.log(req.url);
	var sw = req.param('move');
	if(sw==="up"){
		//forward
		console.log("go");
		RC('go');
	}else if(sw==="down"){
		//reverse
		console.log("back");
		RC('back');
	}else if(sw==="right"){
		//right
		console.log("right");
		RC('right');
	}else if(sw==="left"){
		//left
		console.log("left");
		RC('left');
	}else if(sw==="stop"){
		//stop
		console.log("stop");
		RC('stop');
	}
	res.send(200, {"result":"OK"});
});
//auto mode 
app.get('/mode.do', function(req,res){
	var s = req.param('auto');
	if(s==="unauto"){
		console.log('unauto');
		RC('stop');
		ir1.unwatch();
		ir2.unwatch();
	}else if(s==="auto"){
		console.log('auto');
		RC('go');
		ir1.watch(function(err,value){
			if(err){
				throw err;
			}
			n[0] = value;
			detected();
		});
		ir2.watch(function(err,value){  
			if(err){
				throw err;
			}
			n[1] = value;
			detected();
		});
	}
	res.send(200, {"result":"OK"});
});  
setInterval(function(){
	if(client!==null) client.emit("time",function(data){
		client.send(process.uptime()/600);
	});
},600*1000);



server.listen(8000, function(){
	console.log('server running on 8000.');
});
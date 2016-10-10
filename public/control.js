var oldX, oldY;
			console.log("touchscreen is", VirtualJoystick.touchScreenAvailable() ? "available" : "not available");

			var joystick	= new VirtualJoystick({
				container	: document.getElementById('container'),
				strokeStyle : 'white',
				mouseSupport: true,
		    limitStickTravel: true,
		    stickRadius: 225
			});
			joystick.addEventListener('touchStart', function(){
				console.log('down');
			});
			joystick.addEventListener('touchEnd', function(){
				console.log('up');
			});
 			var flag = true;
			setInterval(function(){
				var neoX = joystick.deltaX();
				var neoY = joystick.deltaY();
				if(neoX !== oldX || neoY !== oldY){
				console.log("deltaX : " + joystick.deltaX());
				console.log("deltaY : " + joystick.deltaY());

				var dir = document.querySelector('#direction');
				var url = "/cmd.do?move=";
				if(joystick.up()){
					url += "up";
					console.log("up");
					dir.className="north";
				}else if(joystick.down()){
					url += "down";
					console.log("down");
					dir.className="south";
				}else if(joystick.right()){
					url += "right";
					console.log("right");
					dir.className="east";
				}else if(joystick.left()){
					url += "left";
					console.log("left");
					dir.className="west";
				}else{
					url += "stop";
					console.log("stop");
					dir.className="center";
				}

 				oldX = neoX;
				oldY = neoY;
				}
				$.ajax({
					url: url,
					success : function(){
						console.log("success");
					},
					error : function(){
						alert("error!");
					}
				});
			}, 1/30 * 1000);
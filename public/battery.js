var value;
var body;
value = document.getElementsByClassName('.battery-value');
body = document.getElementsByClassName('.battery-body');

function (){
  socket.on('time',function(data){
    span.innerHTML = data + '%';
    body.style.width = data + '%';
    console.log(data);
  });
}

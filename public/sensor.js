var div;
var left;
var right;
var level=100;

window.onload = function (){
  var socket = io.connect();
  div = document.createElement('div');
  left = document.createElement('div');
  right = document.createElement('div');

  var body = document.body;
  socket.on('left',function(data){
    $(".left").remove();
    $(".right").remove();
    body.appendChild(left);
    left.setAttribute('class','left');
    console.log(data);

  });
  socket.on('right',function(data){
    $(".left").remove();
    $(".right").remove();
    body.appendChild(right);
    right.setAttribute('class','right');
    console.log(data);
  });
  socket.on('both',function(data){
    $(".left").remove();
    $(".right").remove();
    body.appendChild(left);
    body.appendChild(right);
    left.setAttribute('class','left');
    right.setAttribute('class','right');
    console.log(data);
  });
  socket.on('not',function(data){
    $(".left").remove();
    $(".right").remove();
    console.log(data);
  });
};

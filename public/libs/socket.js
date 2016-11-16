var socket = io();

function log(message, username="Anonymous", tag="msg") {
  var $messageWrapper = $('<div>').append($('<li>').text(username).addClass("username"));
  $messageWrapper.append($('<li>').text(message).addClass(tag));
  $("#messageList").append($messageWrapper.addClass("messageWrapper"));
  $('#messageList').animate({ scrollTop: $("#messageList")[0].scrollHeight}, 500);
}

$('form').submit(function(){
  socket.emit('chat message', $('#m').val());
  $('#m').val('');
  return false;
});

socket.on('chat message', function(data){
  log(data.message, data.username);
});

// Whenever the server emits 'user joined', log it in the chat body
socket.on('user joined', function (data) {
  log(data.username + ' joined!', "", "log");
});
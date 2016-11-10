var socket = io();

function log (message, username="") {
  var $el = $('<li>').text(username + " said: " + message);
  $("#messages").append($el);
}

function addParticipantsMessage (data) {
  var message = '';
  if (data.numUsers === 1) {
    message += "there's 1 participant";
  } else {
    message += "there are " + data.numUsers + " participants";
  }
  log(message);
};

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
  log(data.username + ' joined');
  addParticipantsMessage(data);
});
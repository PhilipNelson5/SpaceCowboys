let app = require('express')();
let http = require('http').Server(app);
let io = require('socket.io')(http);

app.get('/', function(req, res) {
   res.sendFile(__dirname + '/index.html');
});

//When a client connects
io.on('connection', function(socket) {
   console.log('A user connected');

   //When a client disconnects
   socket.on('disconnect', function () {
      console.log('A user disconnected');
   });
});

http.listen(5000, function() {
   console.log('listening on port 5000');
});

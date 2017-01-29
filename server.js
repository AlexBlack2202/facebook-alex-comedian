// # SimpleServer
// A simple chat bot server
var logger = require('morgan');
var http = require('http');
var bodyParser = require('body-parser');
var express = require('express');
var router = express();

var app = express();
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
var server = http.createServer(app);
var request = require("request");

app.get('/', (req, res) => {
  res.send("Home page. Server running okay.");
});

// Đây là đoạn code để tạo Webhook
app.get('/webhook', function(req, res) {
  if (req.query['hub.verify_token'] === 'hoi_lam_chi') {
    res.send(req.query['hub.challenge']);
  }
  res.send('Error, wrong validation token');
});

// Xử lý khi có người nhắn tin cho bot
app.post('/webhook', function(req, res) {
  var entries = req.body.entry;
  for (var entry of entries) {
    var messaging = entry.messaging;
    for (var message of messaging) {
      var senderId = message.sender.id;
      if (message.message) {
        // If user send text
        if (message.message.text) {
          var text = message.message.text;
         var  command= text.substring(0,4);
          var rand_val=1;
          if(command ==='cười'){
         rand_val= Math.floor(Math.random() * 2) + 1  ;
            switch(rand_val){
              case 1: "Có 1 anh chàng một hôm đang đi nhặt lá đá ống bơ thì nhặt được 1 quyển bí kíp.\

Nghi là võ học thượng thừa nên anh ta giấu mang về nhà đọc.\

Trang 1 : Miêu tả về võ công. Có thể hô mưa gọi gió. Độc bộ thiên hạ. Đưa người ta lên đỉnh cao của võ học.\

Trang 2 : Cần phải tự cung mới có thể luyện …\

Sau một hồi đắn đo suy nghĩ. Anh ta hạ quyết tâm vung đao tự cung."\;break;
              case 2: "hết truyện";break;
                           }
          }
          sendMessage(senderId, "Tui là bot đây: " + text);
        }
      }
    }
  }

  res.status(200).send("OK");
  //res.sendStatus(200);
});


// Gửi thông tin tới REST API để trả lời
function sendMessage(senderId, message) {
   var messageData = {
    recipient: {
      id: senderId
    },
    message: {
      text: message
    }
  };

  callSendAPI(messageData);
}

function callSendAPI(messageData) {
  request({
    uri: 'https://graph.facebook.com/v2.6/me/messages',
    qs: { access_token: 'EAAaVu7M0P7QBAFZB1nK7or1ZBiIjGiFg6ZA2DvfccqvfMM2vX1w50CMyY6FUwr4yIo66eUjIZB4C8Rbd9ZAfnLKzCYOHV7fROWLLKubAj32H6JZC3a5k3XcsIMR38i0TSej0gczk1p981cRCTZAuNZAYAvn2Q2F86P4XRbclC5CnxQZDZD' },
    method: 'POST',
    json: messageData

  }, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var recipientId = body.recipient_id;
      var messageId = body.message_id;

      console.log("Successfully sent generic message with id %s to recipient %s", 
        messageId, recipientId);
    } else {
      console.error("Unable to send message.");
      console.error(response);
      console.error(error);
    }
  });  
}

app.set('port',( process.env.PORT || 5000));
app.set('ip',  process.env.IP || "127.0.0.1");

//server.listen(app.get('port'), app.get('ip'), function() {
//  console.log("Chat bot server listening at %s:%d ", app.get('ip'), app.get('port'));
//});
app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

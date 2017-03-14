// server.js
// where your node app starts

// init project
var request = require('request');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();

// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 
// http://expressjs.com/en/starter/basic-routing.html
app.post("/", function (req, res) {
  //should get the files
  //processes the request, status 200
  console.log(req.body);
  res.sendStatus(200);
  console.log(req);
  ////////////////HERE IS THE START////////////////////////////
  //the module in line containing moduleID is the end-of-day module.
  //the module in startModule down there is the next day module
  //the bot  is the number of the bot.
  //more days can be added by adding and else condition.

    if(req.body.moduleID == "474689"){
      setTimeout(function(){
          //CURL to the specified module.
            request.post(
              'https://api.motion.ai/messageHuman',
              {
                json: {
                    "to": req.body.to, 
                    "bot": "39473", 
                    "startModule": "474690", 
                    "key": "af993cfac5de0ac9418e1487e821d801",
                  }

              },
              function (error, response, body) {
                  if (!error && response.statusCode == 200) {
                      console.log(body)
                  }
              } 
          );

      },1000*60*60*24);
  }else if(req.body.moduleID == "474689"){
       setTimeout(function(){
          //CURL to the specified module.
            request.post(
              'https://api.motion.ai/messageHuman',
              {
                json: {
                    "to": req.body.to, 
                    "bot": "39173", 
                    "startModule": "474690", 
                    "key": "af993cfac5de0ac9418e1487e821d801",
                  }

              },
              function (error, response, body) {
                  if (!error && response.statusCode == 200) {
                      console.log(body)
                  }
              } 
          );

      },1000*60*5);
  }else if(req.body.moduleID == "474689"){
       setTimeout(function(){
          //CURL to the specified module.
            request.post(
              'https://api.motion.ai/messageHuman',
              {
                json: {
                    "to": req.body.to, 
                    "bot": "39173", 
                    "startModule": "474690", 
                    "key": "af993cfac5de0ac9418e1487e821d801",
                  }

              },
              function (error, response, body) {
                  if (!error && response.statusCode == 200) {
                      console.log(body)
                  }
              } 
          );

      },1000*60*5);
  }
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});

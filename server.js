// server.js
// where your node app starts

// init project
var request = require('request');
var express = require('express');
var redis = require("redis");
var client = redis.createClient(process.env.REDIS_URL);
var bodyParser = require('body-parser');
var app = express();
var Lob = require('lob')('test_83b0fa83841e210a3e7cebdef01acaec589', {
    apiVersion: '2016-06-30'//this is for backward compatibilty
});

// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));
app.use(bodyParser.json());       // to support JSON-encoded bodies
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
  } else if (req.body.botID == "39473" && req.body.moduleID == "497270" && req.body.reply == 'yes') {
        let myKey = "af993cfac5de0ac9418e1487e821d801";//motion.ai bot key
        let myBotId = "39473"//bot id for motion.ai
        let confirmAddressModuleId = "497270";
        let confirmAddressModuleIdText = "you said the your address was: ";//Remeber; the extracted data should be on a new line!
        let moduleToShowAfterSendingSuccessfully = "505747";
        //todo: should update all these msg to point to the required modules if you want, or edit them as i have explained to you.
        console.log('her--------------e');
        let currentUser = (req.body.from);//changed this to from, it was to. Perfect worked!
        console.log(currentUser);
        console.log(req.body);
        client.get(currentUser, function (err, reply) {
            // reply is null when the key is missing
            if (reply == "sent") {
                //send him something to tell him, no! 
                console.log("Unauthorized. You sent one before.");
                setTimeout(function () {
                    request.post(
                        'https://api.motion.ai/1.0/messageHuman',
                        {
                            json: {
                                "to": "" + currentUser,
                                "bot": myBotId ,
                                /// can change msg to moduleID
                                "msg": "Oops, we think you have requested a Postcard before. We can only send one to you!",
                                "key": myKey
                            }

                        },
                        function (error, response, body) {
                            if (!error && response.statusCode == 200) {
                                console.log(body);
                            }
                        }
                    );
                }, 3000);

            } else if (reply == null) {
                //should check on here if the user exists before or not.
                request.get("https://api.motion.ai/1.0/getConversations?key="+myKey+"&botID="+myBotId+"&session=" +
                    req.body.session + "&module="+confirmAddressModuleId+"&direction=out&archived=false&limit=1"
                    , function (errr, respp, bodyy) {
                        request.get("https://api.motion.ai/1.0/getConversations?key="+myKey+"&botID="+myBotId+"&session=" +
                            req.body.session + "&module="+confirmAddressModuleId+"&direction=in&archived=false&limit=1", function (errrr, respppp, bodyyyy) {
                                let userName = JSON.parse(bodyyyy).messages[0].from_metaData.first_name + " " + JSON.parse(bodyyyy).messages[0].from_metaData.last_name;
                                console.log(userName);
                                let data = JSON.parse(bodyy).messages[0].text.substr(confirmAddressModuleIdText.length + 1);
                                console.log(data);
                                //////The text before is the text in the address module before: [extractedData module = 497269 fallback = TEXT]
                                /////// including spaces too!!!
                                //the [extractedData module = 497269 fallback = TEXT] also should be on a new line
                                let output = data.split(', ');
                                let addl1 = output[0];
                                let city = output[1];
                                let state = output[2].split(' ')[0];
                                let zip = output[2].split(' ')[1];
                                let country = "US";
                                //should verify now the existence of that user in the database//should get userNumber
                                Lob.verification.verify({
                                    address_line1: addl1,
                                    address_city: city,
                                    address_state: state,
                                    address_zip: zip,
                                    address_country: country
                                }, function (err, res) {
                                    console.log(err);//none
                                    if (!err && res != null) {
                                        Lob.addresses.create({
                                            name: userName,
                                            address_line1: addl1,
                                            address_city: city,
                                            address_state: state,
                                            address_zip: zip,
                                            address_country: country
                                        }, function (err2, resp) {
                                            console.log(err2);//none

                                            if (!err2 && resp != null) {
                                                console.log(resp);
                                                Lob.postcards.create({
                                                    description: 'Demo Postcard job',
                                                    to: {
                                                        name: resp.name,
                                                        address_line1: resp.address_line1,
                                                        address_city: resp.address_city,
                                                        address_state: resp.address_state,
                                                        address_zip: resp.address_zip
                                                    },
                                                    from: null,//for now, you can also add your address on here.
                                                    front: 'https://lob.com/postcardfront.pdf',
                                                    back: 'https://lob.com/postcardback.pdf'
                                                }, function (err, res_ponse) {
                                                    console.log(err, res_ponse);
                                                    if (err == null && res_ponse != null) {
                                                        request.post(
                                                            'https://api.motion.ai/1.0/messageHuman',
                                                            {
                                                                json: {
                                                                    "to": "" + currentUser,
                                                                    "bot": myBotId,
                                                                    "startModule": moduleToShowAfterSendingSuccessfully,
                                                                    "key": myKey
                                                                }

                                                            },
                                                            function (error, response, body) {
                                                                if (!error && response.statusCode == 200) {
                                                                    console.log(body);
                                                                }
                                                            }
                                                        );
                                                        setTimeout(function () {
                                                            request.post(
                                                                'https://api.motion.ai/1.0/messageHuman',
                                                                {
                                                                    json: {
                                                                        "to": "" + currentUser,
                                                                        "bot": myBotId,
                                                                        "msg": "Estimated delivery date: " + (res_ponse).expected_delivery_date,
                                                                        "key": myKey
                                                                    }

                                                                },
                                                                function (error, response, body) {
                                                                    if (!error && response.statusCode == 200) {
                                                                        console.log(body);
                                                                    }
                                                                }
                                                            );
                                                        }, 2000);


                                                        client.set(currentUser, "sent");
                                                        console.log("Current User Set-------------")
                                                    } else {
                                                        request.post(
                                                            'https://api.motion.ai/1.0/messageHuman',
                                                            {
                                                                json: {
                                                                    "to": currentUser,
                                                                    "bot": myBotId,
                                                                    //use moduleID
                                                                    "msg": "Some error happened. Please try again later!",
                                                                    "key": myKey
                                                                }

                                                            },
                                                            function (error, response, body) {
                                                                if (!error && response.statusCode == 200) {
                                                                    console.log(body);
                                                                }
                                                            }
                                                        );
                                                    }
                                                    //in this is should respond to the user that some error happened, or
                                                    //it worked, estimated time is + date and add him to the database
                                                    //after implementing this i should add a database before the address check.
                                                });

                                            } else {
                                                request.post(
                                                    'https://api.motion.ai/1.0/messageHuman',
                                                    {
                                                        json: {
                                                            "to": currentUser,
                                                            "bot": myBotId,
                                                            "msg": "Some error happened. Please try again later!",
                                                            "key": myKey
                                                        }

                                                    },
                                                    function (error, response, body) {
                                                        if (!error && response.statusCode == 200) {
                                                            console.log(body);
                                                        }
                                                    }
                                                );
                                            }
                                        });
                                    } else {
                                        request.post(
                                            'https://api.motion.ai/1.0/messageHuman',
                                            {
                                                json: {
                                                    "to": currentUser,
                                                    "bot": myBotId,
                                                    "msg": "Some error happened. Please try again later!",
                                                    "key": myKey
                                                }

                                            },
                                            function (error, response, body) {
                                                if (!error && response.statusCode == 200) {
                                                    console.log(body);
                                                }
                                            }
                                        );
                                    }
                                });
                            });

                    });


                //This post should happen after the success of the post to the postcard API   
                //should send delivery date for example.  
            }
        });


    }
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});

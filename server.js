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
    apiVersion: '2016-06-30' //this is for backward compatibilty
});
const googleMapsGeoLocationKey = 'AIzaSyAXPdt5zyv89OrD-H4fhcBYVNGldxDfAEo';

// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));
app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
    extended: true
}));
// http://expressjs.com/en/starter/basic-routing.html
app.post("/", function(req, res) {
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

    if (req.body.moduleID == "474689") {
        setTimeout(function() {
            //CURL to the specified module.
            request.post(
                'https://api.motion.ai/messageHuman', {
                    json: {
                        "to": req.body.to,
                        "bot": "39473",
                        "startModule": "474690",
                        "key": "af993cfac5de0ac9418e1487e821d801",
                    }

                },
                function(error, response, body) {
                    if (!error && response.statusCode == 200) {
                        console.log(body)
                    }
                }
            );

        }, 1000 * 60 * 60 * 24);
    } else if (req.body.moduleID == "474689") {
        setTimeout(function() {
            //CURL to the specified module.
            request.post(
                'https://api.motion.ai/messageHuman', {
                    json: {
                        "to": req.body.to,
                        "bot": "39173",
                        "startModule": "474690",
                        "key": "af993cfac5de0ac9418e1487e821d801",
                    }

                },
                function(error, response, body) {
                    if (!error && response.statusCode == 200) {
                        console.log(body)
                    }
                }
            );

        }, 1000 * 60 * 5);
    } else if (req.body.moduleID == "474689") {
        setTimeout(function() {
            //CURL to the specified module.
            request.post(
                'https://api.motion.ai/messageHuman', {
                    json: {
                        "to": req.body.to,
                        "bot": "39173",
                        "startModule": "474690",
                        "key": "af993cfac5de0ac9418e1487e821d801",
                    }

                },
                function(error, response, body) {
                    if (!error && response.statusCode == 200) {
                        console.log(body)
                    }
                }
            );

        }, 1000 * 60 * 5);
    } else if (req.body.botID == "39473" && req.body.moduleID == "497270" && req.body.reply == 'yes') {
        let myKey = "af993cfac5de0ac9418e1487e821d801"; //motion.ai bot key
        let myBotId = "39473" //bot id for motion.ai
        let confirmAddressModuleId = "497270";
        let confirmAddressModuleIdText = "you said the your address was: "; //Remeber; the extracted data should be on a new line!
        let moduleToShowAfterSendingSuccessfully = "505747";
        //todo: should update all these msg to point to the required modules if you want, or edit them as i have explained to you.
        console.log('her--------------e');
        let currentUser = (req.body.from); //changed this to from, it was to. Perfect worked!
        console.log(currentUser);
        console.log(req.body);
        client.get(currentUser, function(err, reply) {
            // reply is null when the key is missing
            if (reply == "sent") {
                //send him something to tell him, no! 
                console.log("Unauthorized. You sent one before.");
                setTimeout(function() {
                    request.post(
                        'https://api.motion.ai/1.0/messageHuman', {
                            json: {
                                "to": "" + currentUser,
                                "bot": myBotId,
                                /// can change msg to moduleID
                                "msg": "Oops, we think you have requested a Postcard before. We can only send one to you!",
                                "key": myKey
                            }

                        },
                        function(error, response, body) {
                            if (!error && response.statusCode == 200) {
                                console.log(body);
                            }
                        }
                    );
                }, 3000);

            } else if (reply == null) {
                //should check on here if the user exists before or not.
                request.get("https://api.motion.ai/1.0/getConversations?key=" + myKey + "&botID=" + myBotId + "&session=" +
                    req.body.session + "&module=" + confirmAddressModuleId + "&direction=out&archived=false&limit=1",
                    function(errr, respp, bodyy) {
                        request.get("https://api.motion.ai/1.0/getConversations?key=" + myKey + "&botID=" + myBotId + "&session=" +
                            req.body.session + "&module=" + confirmAddressModuleId + "&direction=in&archived=false&limit=1",
                            function(errrr, respppp, bodyyyy) {
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
                                }, function(err, res) {
                                    console.log(err); //none
                                    if (!err && res != null) {
                                        Lob.addresses.create({
                                            name: userName,
                                            address_line1: addl1,
                                            address_city: city,
                                            address_state: state,
                                            address_zip: zip,
                                            address_country: country
                                        }, function(err2, resp) {
                                            console.log(err2); //none

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
                                                    from: null, //for now, you can also add your address on here.
                                                    front: 'https://lob.com/postcardfront.pdf',
                                                    back: 'https://lob.com/postcardback.pdf'
                                                }, function(err, res_ponse) {
                                                    console.log(err, res_ponse);
                                                    if (err == null && res_ponse != null) {
                                                        request.post(
                                                            'https://api.motion.ai/1.0/messageHuman', {
                                                                json: {
                                                                    "to": "" + currentUser,
                                                                    "bot": myBotId,
                                                                    "startModule": moduleToShowAfterSendingSuccessfully,
                                                                    "key": myKey
                                                                }

                                                            },
                                                            function(error, response, body) {
                                                                if (!error && response.statusCode == 200) {
                                                                    console.log(body);
                                                                }
                                                            }
                                                        );
                                                        setTimeout(function() {
                                                            request.post(
                                                                'https://api.motion.ai/1.0/messageHuman', {
                                                                    json: {
                                                                        "to": "" + currentUser,
                                                                        "bot": myBotId,
                                                                        "msg": "Estimated delivery date: " + (res_ponse).expected_delivery_date,
                                                                        "key": myKey
                                                                    }

                                                                },
                                                                function(error, response, body) {
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
                                                            'https://api.motion.ai/1.0/messageHuman', {
                                                                json: {
                                                                    "to": currentUser,
                                                                    "bot": myBotId,
                                                                    //use moduleID
                                                                    "msg": "Some error happened. Please try again later!",
                                                                    "key": myKey
                                                                }

                                                            },
                                                            function(error, response, body) {
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
                                                    'https://api.motion.ai/1.0/messageHuman', {
                                                        json: {
                                                            "to": currentUser,
                                                            "bot": myBotId,
                                                            "msg": "Some error happened. Please try again later!",
                                                            "key": myKey
                                                        }

                                                    },
                                                    function(error, response, body) {
                                                        if (!error && response.statusCode == 200) {
                                                            console.log(body);
                                                        }
                                                    }
                                                );
                                            }
                                        });
                                    } else {
                                        request.post(
                                            'https://api.motion.ai/1.0/messageHuman', {
                                                json: {
                                                    "to": currentUser,
                                                    "bot": myBotId,
                                                    "msg": "Some error happened. Please try again later!",
                                                    "key": myKey
                                                }

                                            },
                                            function(error, response, body) {
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
//////////////////////////////////////////////////////////////////////////////////////////
/////////////CHATFUEL////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////
//////////////Added by Youssef Dec. '17//////////////////////////////////////////////////
////////////BOT1////////
app.post("/webhook/addressVerifyBot1", function(req, response) {
    /////for bot 1
    const chatFuelBotId = '58c54d9de4b00d399692844f';
    const chatFuelToken = 'vnbqX6cpvXUXFcOKr5RHJ7psSpHDRzO1hXBY8dkvn50ZkZyWML3YdtoCnKH7FSjC';
    const chatFuelAreYouSureModule = '5995d295e4b032e0ea86536c';
    const chatFuelSentModule = '5996ca34e4b0e44fe73f74dc';
    const chatFuelManualAddressModule = '5995d40ae4b032e0ea8ecaac';
    const chatFuelAddressNotFoundModule = '599a97b0e4b0e17b1abfb9f1';
    /////for bot 1
    let longitude = (req.body.longitude)
    let latitude = (req.body.latitude);
    console.log('latitude: ' + latitude);
    console.log('longitude: ' + longitude);
    let messengerId = req.body['messenger user id'];
    //can use the maps api to get also the street number etc..
    request.get('https://maps.googleapis.com/maps/api/geocode/json?latlng=' + latitude + ',' + longitude + '&key=' + googleMapsGeoLocationKey + '&location_type=ROOFTOP',
        function(err, res) {
            if (err) {
                request.post('https://api.chatfuel.com/bots/' + chatFuelBotId + '/users/' + messengerId + '/send?chatfuel_token=' + chatFuelToken + '&chatfuel_block_id=' + chatFuelAddressNotFoundModule, function(err, res) {
                    //response.sendStatus(200);

                });

            } else {
                let parsedLocation = JSON.parse(res.body);
                //should check here if results.length == 0, send to enter address manually module.
                if (parsedLocation.results.length <= 0) {
                    request.post('https://api.chatfuel.com/bots/' + chatFuelBotId + '/users/' + messengerId + '/send?chatfuel_token=' + chatFuelToken + '&chatfuel_block_id=' + chatFuelManualAddressModule, function(err, res) {
                        //response.sendStatus(200);

                    });

                } else {
                    let fullAddress = (parsedLocation.results[0].formatted_address);
                    //This will save details in a local database because Chatfuel isn't reliable...
                    //parameters get stuck sometimes and the behaviour is unpredictable.
                    //So I better store the lat/long on my own.
                    client.HSET('latestUserChoice', (messengerId), (fullAddress), function(err, res) {
                        if (err) {
                            request.post('https://api.chatfuel.com/bots/' + chatFuelBotId + '/users/' + messengerId + '/send?chatfuel_token=' + chatFuelToken + '&chatfuel_block_id=' + chatFuelAddressNotFoundModule, function(err, res) {
                                // response.sendStatus(200);

                            });

                        } else {
                            request.post('https://api.chatfuel.com/bots/' + chatFuelBotId + '/users/' + messengerId + '/send?chatfuel_token=' + chatFuelToken + '&chatfuel_block_id=' + chatFuelAreYouSureModule + '&addressFromQuery=' + fullAddress, function(err, res) {
                                //response.sendStatus(200);

                            });

                        }
                    });
                }
            }
        });

    response.json({});

});

app.post("/webhook/manualAddressBot1", function(req, response) {
    //I should check if something confirm + db update then ask same question and if it's his address send.
    /////for bot 1
    const chatFuelBotId = '58c54d9de4b00d399692844f';
    const chatFuelToken = 'vnbqX6cpvXUXFcOKr5RHJ7psSpHDRzO1hXBY8dkvn50ZkZyWML3YdtoCnKH7FSjC';
    const chatFuelAreYouSureModule = '5995d295e4b032e0ea86536c';
    const chatFuelSentModule = '5996ca34e4b0e44fe73f74dc';
    const chatFuelManualAddressModule = '5995d40ae4b032e0ea8ecaac';
    const chatFuelAddressNotFoundModule = '599a97b0e4b0e17b1abfb9f1';
    /////for bot 1

    let address = (req.body.manualAddress);
    let messengerId = req.body['messenger user id'];

    request.get('https://maps.googleapis.com/maps/api/geocode/json?address=' + address + '&key=' + googleMapsGeoLocationKey + '&location_type=ROOFTOP',
        function(err, res) {
            if (err) {
                request.post('https://api.chatfuel.com/bots/' + chatFuelBotId + '/users/' + messengerId + '/send?chatfuel_token=' + chatFuelToken + '&chatfuel_block_id=' + chatFuelAddressNotFoundModule, function(err, res) {
                    response.json({});

                });

            } else {

                console.log(res);
                let parsedLocation = JSON.parse(res.body);
                //should check here if results.length == 0, send to enter address manually module.
                if (parsedLocation.results.length <= 0) {
                    request.post('https://api.chatfuel.com/bots/' + chatFuelBotId + '/users/' + messengerId + '/send?chatfuel_token=' + chatFuelToken + '&chatfuel_block_id=' + chatFuelManualAddressModule, function(err, res) {
                        response.json({});
                    });
                } else {
                    let fullAddress = (parsedLocation.results[0].formatted_address);
                    //This will save details in a local database because Chatfuel isn't reliable...
                    //parameters get stuck sometimes and the behavious is unpredictable.
                    //So I better store the lat/long on my own.
                    client.HSET('latestUserChoice', (messengerId), (fullAddress), function(err, res) {
                        if (err) {
                            request.post('https://api.chatfuel.com/bots/' + chatFuelBotId + '/users/' + messengerId + '/send?chatfuel_token=' + chatFuelToken + '&chatfuel_block_id=' + chatFuelAddressNotFoundModule, function(err, res) {
                                response.json({});

                            });

                        } else {
                            request.post('https://api.chatfuel.com/bots/' + chatFuelBotId + '/users/' + messengerId + '/send?chatfuel_token=' + chatFuelToken + '&chatfuel_block_id=' + chatFuelAreYouSureModule + '&addressFromQuery=' + fullAddress, function(err, res) {
                                response.json({});

                            });
                        }
                    });
                }
            }
        });
    //response.sendStatus(200);
    //will get a text.
});


//setting up the post request
app.post("/webhook/sendPostcardBot1", function(req, res) {
    //This should send the data
    /////for bot 1
    const chatFuelBotId = '58c54d9de4b00d399692844f';
    const chatFuelToken = 'vnbqX6cpvXUXFcOKr5RHJ7psSpHDRzO1hXBY8dkvn50ZkZyWML3YdtoCnKH7FSjC';
    const chatFuelAreYouSureModule = '5995d295e4b032e0ea86536c';
    const chatFuelSentModule = '5996ca34e4b0e44fe73f74dc';
    const chatFuelManualAddressModule = '5995d40ae4b032e0ea8ecaac';
    const chatFuelAddressNotFoundModule = '599a97b0e4b0e17b1abfb9f1';
    /////for bot 
    let requestParams = (req.body);
    let messengerUserId = requestParams['messenger user id'];
    client.hget('latestUserChoice', (messengerUserId), function(err, data) {
        if (err) {
            request.post('https://api.chatfuel.com/bots/' + chatFuelBotId + '/users/' + messengerId + '/send?chatfuel_token=' + chatFuelToken + '&chatfuel_block_id=' + chatFuelAddressNotFoundModule, function(err, res) {
                response.json({});

            });
        } else {
            console.log(data)
            if (data != null && err == null) {
                let fullName = (requestParams['first name'] + " " + requestParams['last name']);
                addAddressAndSendPostcardBot1(messengerUserId, fullName, data, function() {

                });
            } else {
                request.post('https://api.chatfuel.com/bots/' + chatFuelBotId + '/users/' + messengerId + '/send?chatfuel_token=' + chatFuelToken + '&chatfuel_block_id=' + chatFuelAddressNotFoundModule, function(err, res) {
                    response.json({});

                });
            }
        }
    });

    // response.json({});
});


function addAddressAndSendPostcardBot1(messengerId, fullName, addressString, callback) {
    /////for bot 1
    const chatFuelBotId = '58c54d9de4b00d399692844f';
    const chatFuelToken = 'vnbqX6cpvXUXFcOKr5RHJ7psSpHDRzO1hXBY8dkvn50ZkZyWML3YdtoCnKH7FSjC';
    const chatFuelAreYouSureModule = '5995d295e4b032e0ea86536c';
    const chatFuelSentModule = '5996ca34e4b0e44fe73f74dc';
    const chatFuelManualAddressModule = '5995d40ae4b032e0ea8ecaac';
    const chatFuelAddressNotFoundModule = '599a97b0e4b0e17b1abfb9f1';
    /////for bot 
    let addressArray = addressString.split(',')
    console.log('Full ADDRESS' + addressString);
    if (addressString != '') {
        var street, city, stateZip, country, state, zip;
        if (addressArray.length == 4) {
            street = addressArray[0];
            city = addressArray[1];
            stateZip = addressArray[2].trim();
            stateZip = stateZip.split(' ');
            country = addressArray[3].trim();
            state = (stateZip[0]).trim();
            zip = (stateZip[1]).trim();
        } else if (addressArray.length == 5) {
            street = addressArray[0] + addressArray[1];
            city = addressArray[2];
            stateZip = addressArray[3].trim();
            stateZip = stateZip.split(' ');
            country = addressArray[4].trim();
            state = (stateZip[0]).trim();
            zip = (stateZip[1]).trim();
        }
        Lob.addresses.create({
            name: fullName,
            address_line1: street,
            address_city: city,
            address_state: state,
            address_zip: zip,
            address_country: "US"
        }, function(err2, res2) {
            if (!err2 && res2 != null) {
                console.log("NOTE" + res2.address_line1)
                Lob.postcards.create({
                    description: 'Demo Postcard job',
                    to: {
                        name: res2.name,
                        address_line1: res2.address_line1,
                        address_city: res2.address_city,
                        address_state: res2.address_state,
                        address_zip: res2.address_zip
                    },
                    from: null, //for now, you can also add your address on here.
                    front: 'https://lob.com/postcardfront.pdf',
                    back: 'https://lob.com/postcardback.pdf'
                }, function(err3, res3) {
                    console.log(err3);
                    console.log(res3);
                    if (!err3 && res3 != null) {
                        request.post('https://api.chatfuel.com/bots/' + chatFuelBotId + '/users/' + messengerId + '/send?chatfuel_token=' + chatFuelToken + '&chatfuel_block_id=' + chatFuelSentModule + '&deliveryTimeData=' + res3.expected_delivery_date, function(err, res) {

                        });
                    } else {
                        request.post('https://api.chatfuel.com/bots/' + chatFuelBotId + '/users/' + messengerId + '/send?chatfuel_token=' + chatFuelToken + '&chatfuel_block_id=' + chatFuelAddressNotFoundModule, function(err, res) {

                        });
                    }
                });
            } else {
                request.post('https://api.chatfuel.com/bots/' + chatFuelBotId + '/users/' + messengerId + '/send?chatfuel_token=' + chatFuelToken + '&chatfuel_block_id=' + chatFuelAddressNotFoundModule, function(err, res) {

                });
            }
        });
    } else {
        //should send some kind of error.
        request.post('https://api.chatfuel.com/bots/' + chatFuelBotId + '/users/' + messengerId + '/send?chatfuel_token=' + chatFuelToken + '&chatfuel_block_id=' + chatFuelAddressNotFoundModule, function(err, res) {

        });

    }
}
//////////END BOT1/////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////

///////////////////////////MANYCHAT////////////////////////////////////////////////////
//////////////////////////LOCATION MAKER //////////////////////////////////////////////
app.post("/webhook/manyChatgpsLocToAddress", function(req, res) {
    console.log(req.body);
    let latitude = req.body.address.split(',')[0];
    let longitude = req.body.address.split(',')[1];

    request.get('https://maps.googleapis.com/maps/api/geocode/json?latlng=' + latitude + ',' + longitude + '&key=' + googleMapsGeoLocationKey + '&location_type=ROOFTOP',
        function(err, resp) {
            if (err) {

            } else {
                let parsedLocation = JSON.parse(resp.body);
                //should check here if results.length == 0, send to enter address manually module.
                if (parsedLocation.results.length <= 0) {

                } else {
                    let fullAddress = (parsedLocation.results[0].formatted_address);
                    res.json({
                        address: fullAddress,
                    })
                }
            }
        });
    res.sendStatus(200);
});

////////////////////////////END LOCATION MAKER///////////////////////////////////

// listen for requests :)
var listener = app.listen(process.env.PORT, function() {
    console.log('Your app is listening on port ' + listener.address().port);
});
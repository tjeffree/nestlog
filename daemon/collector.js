// load up the models
var User       = require('../app/models/user');
var Datalog    = require('../app/models/datalog');
//var Firebase   = require ('../firebase');
var https      = require('follow-redirects').https;
var async      = require('async');

var restHost = 'developer-api.nest.com';
var collectTO = null;

function startTimer() {
    clearTimeout(collectTO);
    collectTO = setTimeout(function() { start(); }, 300000 );   // 5 minutes
}

function getUsers(callback) {
    
    User.find({ }, function(err, userList) {
        
        if (!err) {
            callback(userList);
        }
        else {
            callback([]);
        }
    });
}

function start() {
    
    getUsers(parseUsers);
    
}

function parseUsers(users) {
    
    if (users.length === 0) {
        startTimer();
        return;
    }
    
    async.timesSeries(users.length, function(n, next) {
        var user = users[n];
        console.log('RUNNING: ' + user.google.id);
        runCollector(user, next);
        
    }, function(err, res) {
        if (err) {
            console.log('ASYNC TS: ' + err);
        }
        startTimer();
    });
    
}

function runCollector(user, done) {
    
    getToken(user, done, function(sId) {
        
        getTemperature(user, sId, done);
        
    });
    
}
    
function getToken(user, done, callback) {
    
    if (user.nest && user.nest.token) {

        console.log('Token: ' + user.nest.token);

        var httpOpt = {
            host: restHost,
            port: 443,
            path: '/structures.json?auth=' + user.nest.token,
            headers: {
                'Accept' : 'application/json'
            }
        };

        var req = https.get(httpOpt, function(res) {

            var body = "";

            console.log(res.statusCode);

            res.on('data', function(chunk) {
                body += chunk;
            });
            res.on('end', function() {

                var structures = JSON.parse(body);

//                console.log(structures);

                for (var structure in structures) {

                    callback(structures[structure].thermostats[0]);

                    break;
                }

            });
        }).on('error', function(e) {
            console.log(e);

            done();
        });

    } else {
    
        done();
    }
    
}

function getTemperature(user, sId, done) {
    
    var token   = user.nest.token,
        userid  = user.google.id,
        httpOpt = {
            host: restHost,
            port: 443,
            path: '/devices/thermostats/' + sId + '.json?auth=' + token,
            headers: {
                'Accept' : 'application/json'
            }
        };
    
//    console.log('URI: ' + httpOpt.host + httpOpt.path);

    var req = https.get(httpOpt, function(res) {

        var body = "";

        console.log('REQUEST STATS: ' + res.statusCode + ' | ' + user.google.id + 'URI: ' + httpOpt.host + httpOpt.path);

        res.on('data', function(chunk) {
            body += chunk;
        });
        res.on('end', function() {
            
            console.log('PARSING STATS: ' + user.google.id);
            
            try {
                var stats = JSON.parse(body);
                
//                console.log(stats);

                var datalog = new Datalog({
                    userid      : userid,
                    temp        : stats.ambient_temperature_c,
                    humidity    : stats.humidity,
                    target      : stats.target_temperature_c
                });

                datalog.save(function(err, saved) {
                    if (err) console.log(err);
                    
                    console.log('SAVED: ' + user.google.id);

                    done();

                });
            } catch(e) {
                console.log('ERR : ' + user.google.id + ' : ' + e);
                console.log(stats);
                done();
            }
            
        });
    }).on('error', function(e) {
        console.log(e);
        
        done();
    });
}

start();

/*
            humidity: 45,
            locale: 'en-GB',
            temperature_scale: 'C',
            is_using_emergency_heat: false,
            has_fan: false,
            software_version: '4.3.3',
            has_leaf: false,
            device_id: 'pddPDIhkgdbfxaih8NYFELUeautfL-i7',
            name: 'Hallway',
            can_heat: true,
            can_cool: false,
            hvac_mode: 'heat',
            target_temperature_c: 19,
            target_temperature_f: 66,
            target_temperature_high_c: 24,
            target_temperature_high_f: 75,
            target_temperature_low_c: 20,
            target_temperature_low_f: 68,
            ambient_temperature_c: 18,
            ambient_temperature_f: 64,
            away_temperature_high_c: 24,
            away_temperature_high_f: 76,
            away_temperature_low_c: 9,
            away_temperature_low_f: 48,
            structure_id: 'i9gmwQBuF6S9f38Wjsxkd6oDcymn9KTqxAakPDHoWLrqxSZBux779w',
            fan_timer_active: false,
            name_long: 'Hallway Thermostat',
            is_online: true,
            last_connection: '2014-12-05T16:03:34.006Z' }
*/
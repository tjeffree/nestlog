var Datalog    = require('./models/datalog');

module.exports.loadData = function(req, res) {

    Datalog.find({ userid: req.user.google.id },
                 null,
                 {
                    skip: 0,
                    limit: 1000,
                    sort: {
                        '_id': -1
                    }
                 }
        , function(err, logList) {

        if (!err) {
            
            var logListLen = logList.length,
                log, t,
                temp = [],
                humid = [],
                target = [],
                x = 0;
            
            if (logListLen === 0) {
                startTimer();
            }
            
            for (; x < logListLen; x++) {
                
                log = logList[x];
                
                t = Math.round(new Date(log.t).getTime());
                
                temp.push([t , log.temp]);
                humid.push([t, log.humidity]);
                target.push([t, log.target]);
                
            }
            
            temp.reverse();
            humid.reverse();
            target.reverse();
            
            res.end(JSON.stringify([temp, humid, target]));

        } else {
            console.log(err);
        }

    });

}

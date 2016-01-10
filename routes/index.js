var express = require('express');
var router = express.Router();
var request = require('request');



/************************************************************************/
/***************************** Varaibles ********************************/
/************************************************************************/


/* Hooks Information */
var register = [{user: "user", repo: "repo", title: "title", desc: "description"}];

/* Targets Information */
var target = [{link: "link"}, {link: "localhost:3000/push"}];  // The default target is this server itself (for better testing)

/* Local Storage */
/* Note: 3-tuple is enough id: {title: *, description: *} - because github has a unique id for each issue it maintains */
var store = {};

/* Date pending to be checked */
var date = new Date();
var since = "";  // initial empty to allow getting all issues

/* Checking period */
/* Note: It can help to reduce the size of information received from the issues by sepcifying parameter 'since'
/* Note: For better testing, here I use 10 seconds, but for practical purposes, maybe 15 minutes would be a reasonable choice */
var period = 10000;



/************************************************************************/
/***************************** Functions ********************************/
/************************************************************************/


/* A Helper function to send the notification to each target one by one */
sendNotification = function(body){
    // repository and sender information should be able to be got by extra API requests, I will assume it can be trivially done and not of enormous importance
    msg={action: 'updated', issue: body, repository: 'trivial', sender: 'trivial'}; 
    for(i=1;i<target.length;i++)
        request.post({
            method: 'POST',
            body: msg,
            json: true,
            url: "http://"+target[i].link
        }, function(error, response, body){
            console.log("Notificaiton sent to due to change(s) in issue: #" + msg.issue.id);
        });
}

/* A Core function to determine whether there are changes of title and description for each issue */
makeRequest = function(z,cb){
    if(z<register.length){
        request({
            url: 'https://api.github.com/repos/'+register[z].user+'/'+register[z].repo+'/issues?state=all&filter=all'+since,
            headers: { 'User-Agent': 'test'}
        }, function (error, response, body) {
            body = JSON.parse(body);
            for(i in body){
                // Case 1: A new issue is found => store the three tuple
                if(!store[body[i].id])
                    store[body[i].id]={
                        title: body[i].title, 
                        body: body[i].body
                    };
                // Case 2: The issue already exists => check whether title or/and description is different from storage, depending on the hook information (the register variable)
                else if((register[z].title&&store[body[i].id].title!=body[i].title)
                        ||(register[z].desc&&store[body[i].id].body!=body[i].body)){
                    store[body[i].id].title=body[i].title;
                    store[body[i].id].body=body[i].body;
                    sendNotification(body[i]);
                }
            }
        }, makeRequest(z+1,cb));
    }
    else cb();
}

/* A Timer function to allow periodic update */
setInterval(function(){
    makeRequest(1, function(){
        since='&since='+date.toISOString(); // Refresh
        date = new Date(date.getTime()+period-1000); // Refresh
    });

},period);



/************************************************************************/
/***************************** Routings *********************************/
/************************************************************************/


router.get('/', function(req, res, next){
  res.render('index', { register: register, target: target });
});

router.post('/register', function(req, res, next){
    register.push({
        user: req.body.user,
        repo: req.body.repo,
        title: req.body.title,
        desc: req.body.desc
    });
    res.redirect('../');
});

router.post('/target', function(req, res, next){
    target.push({
        link: req.body.link
    });
    res.redirect('../');
});

router.post('/push', function(req, res, next){
    console.log('Received Notification');
    res.sendStatus(200);
});

module.exports = router;

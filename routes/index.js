var express = require('express');
var router = express.Router();
var request = require('request');

var register = [{user: "user", repo: "repo", type: "type(s)"}];
var store = {};
var target = [{link: "link"}];


sendRequest = function(id){
    
}

// Assume no injection
setInterval(function(){
    request({url: 'https://api.github.com/repos/xforceco/test/issues?state=all&filter=all', headers: {
    'User-Agent': 'test'
  }}, function (error, response, body) {

        body = JSON.parse(body);
            console.log(body);
      for(i in body)
          for(j in body[i]){
            if(!store[body[i][j].id])
                store[body[i][j].id]={
                    title: body[i][j].title, 
                    body: body[i][j].body
                };
            else if(store[body[i][j].id].title!=body[i][j].title||store[body[i][j].id].body!=body[i][j].body)
                sendRequest(body[i][j].id);
          }
})
    console.log(store);
},5000);


router.get('/', function(req, res, next){
  res.render('index', { register: register, target: target });
});

router.post('/register', function(req, res, next){
    register.push({
        user: req.body.user,
        repo: req.body.repo,
        type: [].concat(req.body.type)
    });
    res.redirect('../');
});

router.post('/target', function(req, res, next){
    target.push({
        user: req.body.link
    });
    res.redirect('../');
});

module.exports = router;

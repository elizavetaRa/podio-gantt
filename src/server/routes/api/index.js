const express = require('express');
const router = express.Router();
var PodioJS = require('podio-js');
var sessionStore = require('../../sessionStore');
var Busboy = require("busboy");
var temp = require('temp');
var fs = require('fs');

const authRoutes = require('./auth')
const { userMiddleware, checkLoggedIn } = require('../../utils/middleware')

var config = JSON.parse(fs.readFileSync('./config.json'));

var clientId = config.clientId;
var clientSecret = config.clientSecret;

var podio = new PodioJS.api({ authType: 'server', clientId: clientId, clientSecret: clientSecret }, { sessionStore: sessionStore });

function getFullURL(req) {
    return req.protocol + '://' + req.get('host') + '/';
}

router.use(userMiddleware)

router.get('/', (req, res) => {
    console.log("URL", req.url)
    var authCode = req.query.code;
    //authCode = "4f75f4ae45cb49469b86b1623253632d"
    var errorCode = req.query.error;
    var redirectURL = getFullURL(req);
    console.log("coming in!")
    let loggedin = false;

    podio.isAuthenticated()
        .then(function () {
            // ready to make API calls
            console.log("Authenticated!")
            loggedin = true
            res.send(
                {loggedin}
            )
        }).catch(function () {

            if (typeof authCode !== 'undefined') {
                podio.getAccessToken(authCode, redirectURL, function (err) {
                    console.log("get Access Token!")
                    if (err !== null) {
                        // we have catched an error
                        res.send(err)
                    } else {
                        // ready to make API calls
                        console.log("Authenticated!")
                        loggedin = true
                        res.send(
                            {loggedin}
                        )
                    }
                });
            } else if (typeof errorCode !== 'undefined') {
                // an error occured
                console.log("Error!")
            } else {
                // we have neither an authCode nor have we authenticated before
                console.log("WE are here with authURL")
                let authUrl = podio.getAuthorizationURL(redirectURL);
                res.send({loggedin,
                    authUrl});
            }
        });

})


router.get('/user', function (req, res) {
    
    podio.isAuthenticated()
        
        .then(function () {
            console.log("Authenticated& Making user request")
            return podio.request('get', '/user/status');
        })
        .then(function (responseData) {
            console.log("GOT USER: ", responseData)
            res.send(responseData)
        })
        .catch(function (err) {
            res.send(401);
        });
});



router.get("/apps", function(req, res){
   
    podio.isAuthenticated()
      .then(function() {
        return podio.request('get', `/app/`);
      }) .then(function(data) {
        
        res.send(data)

      }).catch(err=>{
        console.error(err)
      })
  
  })


  router.get("/app/:id/items", function(req, res){
   
    let id = req.params.id
    podio.isAuthenticated()
      .then(function() {
      
        //21545916
        return podio.request('get', `/app/${id}/values`);
      }) .then(function(data) {
        
        res.send(data)
  
  
      }).catch(err=>{
        console.error(err)
      })
  
  })







router.get('/protected', checkLoggedIn, (req, res) => {
    console.log('USER', req.user)
    res.send({ success: true })
})

router.use('/auth', authRoutes)

router.use((req, res) => {
    res.status(404).send({ error: 'not-found' })
})

module.exports = router

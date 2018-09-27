const express = require('express')
const router = express.Router()
var PodioJS = require('podio-js')
var sessionStore = require('../../sessionStore')
var Busboy = require('busboy')
var temp = require('temp')
var fs = require('fs')

const authRoutes = require('./auth')
const { userMiddleware, checkLoggedIn } = require('../../utils/middleware')

var config = JSON.parse(fs.readFileSync('./config.json'))

var clientId = config.clientId
var clientSecret = config.clientSecret

var podio = new PodioJS.api(
    { authType: 'server', clientId: clientId, clientSecret: clientSecret },
    { sessionStore: sessionStore }
)

function getFullURL(req) {
    console.log(req.protocol + '://' + req.get('host') + '/app/')
    return req.protocol + '://' + req.get('host') + '/app/'
}

router.use(userMiddleware)

router.get('/', (req, res) => {
    var authCode = req.query.code
    
    //authCode = "4f75f4ae45cb49469b86b1623253632d"
    var errorCode = req.query.error
    var redirectURL = getFullURL(req)
    let loggedin = false

    podio
        .isAuthenticated()
        .then(function() {
            // ready to make API calls
            console.log('Authenticated!')
            loggedin = true
            res.send({ loggedin })
        })
        .catch(function() {
            if (typeof authCode !== 'undefined') {
                podio.getAccessToken(authCode, redirectURL, function(err) {
                    
                    if (err !== null) {
                        // we have catched an error
                        res.send(err)
                    } else {
                        // ready to make API calls
                        console.log('Authenticated!')
                        loggedin = true
                        res.send({ loggedin })
                    }
                })
            } else if (typeof errorCode !== 'undefined') {
                // an error occured
                console.log('Error!')
            } else {
                // we have neither an authCode nor have we authenticated before
                
                let authUrl = podio.getAuthorizationURL(redirectURL)
                res.send({
                    loggedin,
                    authUrl,
                })
            }
        })
})

router.get('/user', function(req, res) {
    podio
        .isAuthenticated()

        .then(function() {
            console.log('Authenticated& Making user request')
            return podio.request('get', '/user/status')
        })
        .then(function(responseData) {
            
            res.send(responseData)
        })
        .catch(function(err) {
            res.send(401)
        })
})

router.get('/apps', function(req, res) {
    podio
        .isAuthenticated()
        .then(function() {
            return podio.request('get', `/app/`)
        })
        .then(function(data) {
            res.send(data)
        })
        .catch(err => {
            console.error(err)
        })
})

router.get('/app/:id/items', function(req, res) {
    let id = req.params.id
    podio
        .isAuthenticated()
        .then(function() {
            //21545916
            return podio.request('post', `/item/app/${id}/filter`)
        })
        .then(function(data) {
            res.send(data)
        })
        .catch(err => {
            console.error(err)
        })
})

//Update Verbindung
router.post('/item/:target_id/:source_id', function(req, res) {
    let target = req.params.target_id
    let source =req.params.source_id

    console.log("TARGET; SOURCE", target, source)
    

    //find field
    router.get("/item/${target}").then(item=>{

        let verbindungField = item.fields.filter(el => {
            return el.label == "Verbindung"
        })

        

        let fieldId= verbindungField.field_id
        console.log("VERBINDUNG FIELD ID", fieldId)
        let requestData = [
            {
              "value": source
            }
          ]

    podio
        .isAuthenticated()
        .then(function() {
            return podio.request('put', `/item/${id}/value/${fieldId}`, requestData)
        })
        .then(function(data) {
            res.send(data)
        })
        .catch(err => {
            console.error(err)
        })



    })



})



router.get('/logout', (req, res) => {
    console.log("Backend logout")
    fs.writeFileSync("src/server/tmp/server.json", JSON.stringify({}))
    res.send("done")
})

router.use('/auth', authRoutes)

router.use((req, res) => {
    res.status(404).send({ error: 'not-found' })
})

module.exports = router
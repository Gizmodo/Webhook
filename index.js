const express = require('express')
const bodyParser = require('body-parser');
const crypto = require('crypto');
const app = express()
const port = 8000
const webhook_secret = process.env.WEBHOOK_SECRET || '1234'

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

app.listen(port, (err) => {
    if (err) {
        return console.log('something bad happened', err)
    }

    console.log(`server is listening on ${port}`)
})

app.get('/', (request, response) => {
    response.send('Hello from Express!')
})

function validateSignature(body, secret, signature) {
    var hash = crypto.createHmac('SHA256', secret)
        .update(JSON.stringify(body))
        .digest('base64');
    console.log("Hash of body => ", hash);
    return (hash === signature);
}

/* 
GET - Challenge
*/
app.get('/webhook', function(req, res, next) {
    res.json({
        challenge: req.query.challenge
    });
});

/* 
POST - Handle webhook
*/
app.post('/webhook', function(req, res, next) {
    console.log('Received webhook request:', JSON.stringify(req.body));
    console.log('X-Exl-Signature', req.get('X-Exl-Signature'));
    // Validate signature
    if (!validateSignature(req.body,
            webhook_secret,
            req.get('X-Exl-Signature'))) {
        return res.status(401).send({
            errorMessage: 'Invalid Signature'
        });
    }

    // Handle webhook
    console.log(req.body.action)
    var action = req.body.action.toLowerCase();
    switch (action) {
        default: console.log('No handler for type', action);
    }

    res.status(204).send();
});
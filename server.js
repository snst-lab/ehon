'use strict';
const express = require('express');
const redis = require('redis');
const root =  require("app-root-path");

/**
 * Configure Redis
 */
if (process.env.REDISTOGO_URL) {
    const rtg    = require('url').parse(process.env.REDISTOGO_URL);
    var db = redis.createClient(rtg.port, rtg.hostname);
    db.auth(rtg.auth.split(':')[1]);
} else {
    var db = redis.createClient();
}
db.on('connect', ()=> console.log('Redis client connected.'));
db.on('error', err => console.log('Error: ' + err));


/**
 * Configure Server
 */
const app = new express();
app.use(express.static('public'));
app.get("/", (req, res) => {
    res.sendFile(root + '/index.html');
});
app.post('/api',  (req, res) => {
    res.send('POST request received.');
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on ${port}`));
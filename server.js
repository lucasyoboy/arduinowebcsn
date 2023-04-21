const express = require('express');
const axios = require('axios');
const bodyParser = require("body-parser");
const app = express();
const PocketBase = require('pocketbase/cjs')
const schedule = require('node-schedule');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const pb = new PocketBase('https://database.hostlink.tech');

app.use(express.static(__dirname + '/public'));

const job = schedule.scheduleJob('* * * * *', function(){
    (async () => {
        await axios.get('http://192.168.137.219/')
        .then((response) => {
            // example create data
            const data = {
                "temperature": response.data.temp,
                "pressure": response.data.pressure,
                "humidity": response.data.humidity,
                "altitude": response.data.altitude,
                "windspeed": response.data.speed
            };

            const record = pb.collection('wetterstation').create(data);
        });
    })().catch(err => {
        console.error(err);
    });
  });


app.listen(3000, () => console.log(`Started server at http://localhost:3000!`));
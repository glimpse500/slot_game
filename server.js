'use strict'
const fs = require('fs');
const express = require('express')

// Create a new instance of express
const app = express()
const PORT = 8080
const IP_ADDRESS = '10.182.0.2'
app.use(express.json({
  type: "*/*"
}))

console.log("DEBUG key = ",process.env.OPENAI_API_KEY);

const test_res = 
{
  "created": 1589478378,
  "data": [
    {
      "url": "https://www.kindpng.com/picc/m/107-1075517_-hd-png-download.png"
    },
    {
      "url": "https://123"
    }
  ]
}

app.post('/style', function(req, res) {
    console.log("Receive style = ",req.body.style);
    res.send(JSON.stringify(test_res));
});

function onServerListening(){
    console.log("Listen on ", IP_ADDRESS, ":", PORT);
}
var server = app.listen(PORT, IP_ADDRESS, onServerListening);

app.use(express.static(__dirname, { // host the whole directory
        extensions: ["html", "htm", "gif", "png"],
    }))
app.get("*", (req, res) => {
    return res.sendStatus(404)
})

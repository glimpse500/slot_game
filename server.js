'use strict'
const fs = require('fs');
const express = require('express')

// Create a new instance of express
const app = express()

app.use(express.json({
  type: "*/*"
}))


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
    console.log(req.body.style);
	console.log(process.env.OPENAI_API_KEY);
    res.send(JSON.stringify(test_res));
});
const server = app.listen(8080, () => { // create a HTTP server on port 3000
    console.log(`Express running → PORT ${server.address().port}`)
});

app.use(express.static(__dirname, { // host the whole directory
        extensions: ["html", "htm", "gif", "png"],
    }))
console.log(process.env.OPENAI_API_KEY);
console.log(test_res.data[0].url);


app.get("*", (req, res) => {
    return res.sendStatus(404)
})
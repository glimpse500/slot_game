'use strict';
import express from'express'
import path from 'path';
import { fileURLToPath } from 'url';
import { Configuration, OpenAIApi } from "openai";

const DEBUG = true;

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename)
// Create a new instance of express
const app = express()
const PORT = 8080
const IP_ADDRESS = '127.0.0.1'
app.use(express.json({
  type: "*/*"
}))

async function createImage(my_prompt){
	const configuration = new Configuration({
	  apiKey: process.env.OPENAI_API_KEY,
	});
	const openai = new OpenAIApi(configuration);
	console.log("Prompt = ", my_prompt);
	const response = await openai.createImage({
	  prompt: my_prompt,
	  n: 5,
	  size: "256x256",
	});
	return response;
}


console.log("DEBUG key = ",process.env.OPENAI_API_KEY);

const test_res = 
{
  "created": 1589478378,
  "data": [
    {
      "url": "https://www.kindpng.com/picc/m/107-1075517_-hd-png-download.png"
    },
    {
      "url": "./img/2xBAR.png"
    },
	{
      "url": "./img/3xBAR.png"
    },   
	{
      "url": "./img/7.png"
    },    
	{
      "url": "./img/Cherry.png"
    }
  ]
}

app.post('/style', async function(req, res) {
	if (DEBUG){
		res.send(test_res);
	}
	else{
		try {
			console.log("Receive style = ",req.body.style);

			const response = await createImage(req.body.style);
			
			console.log(response.data.data[0].url);
			const my_res = 
			{
			  "data": [
				{
				  "url": response.data.data[0].url
				},
			  ]
			}
			res.send(JSON.stringify(my_res));
		} catch (error) {
			console.error(error);
		}
	}
});

function onServerListening(){
    console.log("Listen on ", IP_ADDRESS, ":", PORT);
}
var server = app.listen(PORT, IP_ADDRESS, onServerListening);

app.use(express.static(__dirname, { // host the whole directory
        extensions: ["html", "htm", "gif", "png"],
    }))
console.log(__dirname)
app.get("*", (req, res) => {
    return res.sendStatus(404)
})

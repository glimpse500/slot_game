'use strict';
import express from 'express'
import path from 'path';
import { fileURLToPath } from 'url';
import { Configuration, OpenAIApi } from "openai";
import Replicate from "replicate";

// DEBUG
const DEBUG_IMG = true;
const DEBUG_MUSIC = true;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create a new instance of express
const app = express();
const PORT = 8080;
const IP_ADDRESS = '127.0.0.1';
//const IP_ADDRESS = '10.182.0.2';

app.use(express.json({
    type: "*/*"
}))


async function createImage(my_prompt) {
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

async function createMusic(my_prompt) {
    const replicate = new Replicate({
        auth: process.env.REPLICATE_API_TOKEN,
    });
    const output = await replicate.run(
        "facebookresearch/musicgen:7a76a8258b23fae65c5a22debb8841d1d7e816b75c2f24218cd2bd8573787906",
        {
            input: {
                prompt: my_prompt,
                model_version: "melody",
                normalization_strategy: "peak",
                duration: 7,
                top_k: 100,
                classifier_free_guidance: 3,
                output_format: "mp3"
            }
        }
    );
    console.log("Music url: ", output);
    return output;
}

app.post('/style', async function (req, res) {
    const ai_result =
    {
        "data": [
            { "url": "./img/BAR.png" },
            { "url": "./img/2xBAR.png" },
            { "url": "./img/3xBAR.png" },
            { "url": "./img/7.png" },
            { "url": "./img/Cherry.png" }
        ],
        "sound": "/sound/spin.mp3"
    }
    console.log("Receive img_style = ", req.body.img_style);
    console.log("Receive music_style = ", req.body.music_style);
    if (DEBUG_IMG) {
        await new Promise(r => setTimeout(r, 500));
    } else {
        try {
            const response = await createMusic(req.body.img_style);
            ai_result.data[0].url = response.data.data[0].url;
            ai_result.data[1].url = response.data.data[1].url;
            ai_result.data[2].url = response.data.data[2].url;
            ai_result.data[3].url = response.data.data[3].url;
            ai_result.data[4].url = response.data.data[4].url;

        } catch (error) {
            console.error(error);
        }
    }
    if (DEBUG_MUSIC) {
        await new Promise(r => setTimeout(r, 500));
    } else {
        try {
            const response = await createImage(req.body.music_style);
            ai_result.sound = response;
        } catch (error) {
            console.error(error);
        }
    }
    res.send(JSON.stringify(ai_result));
});

function onServerListening() {
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

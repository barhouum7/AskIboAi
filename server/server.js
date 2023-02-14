import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import handleCorsError from './cors-error-handler.js';

import { Configuration, OpenAIApi } from 'openai';



/* Here in order to load that Variable inside dotenv file
    we just do a simple check If we are 
    running in the production environment or Not... */
if (process.env.NODE_ENV !== 'production') {
    dotenv.config();
}


const PORT = process.env.PORT || 3000

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const app = express();
app.use(cors({
    origin: true,
    credentials: true,
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
}));
app.use(express.json());


app.use((err, req, res, next) => {
const corsErrorResponse = handleCorsError(err);
if (corsErrorResponse) {
    res.status(corsErrorResponse.statusCode).set(corsErrorResponse.headers).send(corsErrorResponse.body);
    return;
}
next(err);
});


app.get('/', async (req, res) => {
    res.status(200).send({
        message: 'Hello from AskIboAi',
    })
})

app.post('/', async (req, res) => {
    try {
        const prompt = req.body.prompt;

        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: `${prompt}`,
            temperature: 0,
            max_tokens: 3000,
            top_p: 1,
            frequency_penalty: 0.5,
            presence_penalty: 0,
        });

        res.status(200).send({
            bot: response.data.choices[0].text
        });
    } catch (error) {
        if (error.message === "Request failed with status code 401") {
            res.status(401).send("Unauthorized! Please check your API Key.");
        } else if (error.message === "Request failed with status code 400") {
            res.status(400).send("Bad Request! Please check your request body.");
        } else if (error.message === "Request failed with status code 404") {
            res.status(404).send("Not Found! Please check your request URL.");
        } else if (error.message === "Request failed with status code 429") {
            res.status(429).send("Too Many Requests! Please try again later.");
        } else if (error.message === "Request failed with status code 403") {
            res.status(403).send("Forbidden! Please check your request URL.");
        } else if (error.message === "Request failed with status code 503") {
            res.status(503).send("Service Unavailable! Please try again later.");
        } else if (error.message === "Request failed with status code 502") {
            res.status(502).send("Bad Gateway! Please try again later.");
        } else if (error.message === "Request failed with status code 504") {
            res.status(504).send("Gateway Timeout! Please try again later.");
        } else if (error.message === "Request failed with status code 408") {
            res.status(408).send("Request Timeout! Please try again later.");
        } else if (error.message === "Request failed with status code 500") {
            res.status(500).send("Internal Server Error! Please try again later.");
        }   else {
            res.status(500).send("Something Went Wrong! Please try again later.");
        }
        console.log(error);
    }
})


app.listen(PORT, (error) => {
    error ?
        console.log(`\nERROR! Something Went Wrong.\n`) :
        console.log(`\nServer is running on PORT: http://localhost:${PORT}\n`)
}) /* Telling to our App that we want to Listening on Certain PORT */
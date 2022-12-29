import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';

import { Configuration, OpenAIApi } from 'openai';

const PORT = process.env.PORT || 3000


/* Here in order to load that Variable inside dotenv file
    we just do a simple check If we are 
    running in the production environment or Not... */
    if (process.env.NODE_ENV !== 'production') {
        dotenv.config();
    }


const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const app = express();
app.use(cors());
app.use(express.json());

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
        console.log(error);
        res.status(500).send({ error });
    }
})


app.listen(PORT, (error) => {
    error ?
        console.log(`\nERROR! Something Went Wrong.\n`) :
        console.log(`\nServer is running on PORT: http://localhost:${PORT}\n`)
}) /* Telling to our App that we want to Listening on Certain PORT */
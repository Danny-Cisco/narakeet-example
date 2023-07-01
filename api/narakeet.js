const fetch = require('node-fetch');
const { pipeline } = require('stream/promises');
const { createWriteStream } = require('fs');
const { Readable } = require('stream');
const { promisify } = require('util');
const streamPipeline = promisify(pipeline);
const dotenv = require('dotenv');
dotenv.config();

module.exports = async (req, res) => {
    const APIKEY = process.env.NARAKEET_API_KEY;
    const voice = 'mike';
    const text = req.body.text;

    try {
        const response = await fetch(
            `https://api.narakeet.com/text-to-speech/mp3?voice=${voice}`,
            {
                method: 'POST',
                headers: {
                    'accept': 'application/octet-stream',
                    'x-api-key': APIKEY,
                    'content-type': 'text/plain'
                },
                body: text
            }
        );
        
        if (!response.ok) {
            throw new Error(`Server response: ${response.statusText}`);
        }

        await streamPipeline(response.body, createWriteStream('result.mp3'));
        res.status(200).send('Audio created successfully');
    } catch (error) {
        res.status(500).send(`Server error: ${error.message}`);
    }
}

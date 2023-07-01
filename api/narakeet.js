const axios = require('axios');
const fs = require('fs');
const dotenv = require('dotenv');
dotenv.config();

module.exports = async (req, res) => {
    const APIKEY = process.env.NARAKEET_API_KEY;
    const voice = 'Mike';
    const text = req.body.text;

    try {
        const response = await axios({
            method: 'post',
            url: `https://api.narakeet.com/text-to-speech/mp3?voice=${voice}`,
            headers: {
                'accept': 'application/octet-stream',
                'x-api-key': APIKEY,
                'content-type': 'text/plain'
            },
            data: text,
            responseType: 'stream'
        });

        response.data.pipe(fs.createWriteStream('result.mp3'));
        res.status(200).send('Audio created successfully');
    } catch (error) {
        res.status(500).send(`Server error: ${error.message}`);
    }
}

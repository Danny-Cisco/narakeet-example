const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

module.exports = async (req, res) => {
    const APIKEY = process.env.NARAKEET_API_KEY;
    const voice = 'mike';
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
            responseType: 'arraybuffer'
        });

        res.setHeader('Content-Type', 'audio/mpeg');
        res.send(Buffer.from(response.data, 'binary'));
    } catch (error) {
        res.status(500).send(`Server error: ${error.message}`);
    }
}

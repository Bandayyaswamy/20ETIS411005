const express = require('express');
const request = require('request');
const app = express();

app.get('/', async(req,res) =>{
    res.sendFile(__dirname + '/index.html')
});

app.get('/numbers', async (req, res) => {
    const urls = req.query.url || [];
    let numbers = [];

    const fetchNumbersFromUrl = async (url) => {
        return new Promise((resolve) => {
            request(url, { timeout: 5000 }, (error, response, body) => {
                if (!error && response.statusCode === 200) {
                    try {
                        const data = JSON.parse(body);
                        if (data && Array.isArray(data.numbers)) {
                            numbers = numbers.concat(data.numbers);
                        }
                    } catch (e) {
                    
                    }
                }
                resolve();
            });
        });
    };

    const fetchPromises = urls.map(fetchNumbersFromUrl);

    try {
        await Promise.all(fetchPromises);
    } catch (error) {
    
    }

    numbers = [...new Set(numbers)].sort((a, b) => a - b);

    res.json({ numbers });
});

app.listen(8008, () => {
    console.log(`Server is running on port 8008`);
});

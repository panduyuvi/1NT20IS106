const express = require('express');
const axios = require('axios');
const app = express();
const port = 8008;

app.get('/numbers', async (req, res) => {
    const urls = req.query.url;
    if (!urls || !Array.isArray(urls)) {
        return res.status(400).json({ error: 'Invalid or missing URL parameter' });
    }

    const results = [];

    try {
        const axiosPromises = urls.map(async url => {
            try {
                const response = await axios.get(url, { timeout: 500 });
                if (response.status === 200) {
                    const data = response.data;
                    results.push(...data.numbers);
                }
            } catch (error) {
                console.error(`Error fetching data from ${url}:`, error.message);
            }
        });

        await Promise.all(axiosPromises);

        const uniqueSortedNumbers = Array.from(new Set(results)).sort((a, b) => a - b);

        return res.json({ numbers: uniqueSortedNumbers });
    } catch (err) {
        console.error('Error processing URLs:', err.message);
        return res.status(500).json({ error: 'Error processing URLs' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

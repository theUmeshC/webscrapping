const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require("cors");

const app = express();

app.use(
    cors({
        origin: true,
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        credentials: true,
    })
);

// Define a route for web scraping
app.get('/api', async (req, res) => {
    const httpLink = req.query.url;
    try {
        // Fetch HTML content of the website
        const response = await axios.get(httpLink);
    
        // Load HTML content into Cheerio
        const $ = cheerio.load(response.data);

        // Extract the main DOM element
        const mainContent = $('main').html();

        const stylesheets = [];
        $('link[rel="stylesheet"]').each((index, element) => {
            stylesheets.push($(element).attr('href'));
        });
    
        res.json(`
            <html>
            <head>
                ${stylesheets.map(href => `<link rel="stylesheet" href="${href}">`).join('\n')}
            </head>
            <body>
                ${mainContent}
            </body>
            </html>
        `);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('An error occurred while fetching the data.');
    }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

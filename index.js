// Import required modules
const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require("cors");

// Create Express app
const app = express();

app.use(
    cors({
      origin: true,
      methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
      credentials: true,
    })
  );

// Define a route for web scraping
app.get('/', async (req, res) => {
    try {
        // Fetch HTML content of the website
        const response = await axios.get('https://lagynecomastia.org/out-of-town/pre-operative-clearance/');
        
        // Load HTML content into Cheerio
        const $ = cheerio.load(response.data);
        
        // Extract the main DOM element
        const mainContent = $('main').html();
        
        // Extract and append the CSS stylesheets
        const stylesheets = [];
        $('link[rel="stylesheet"]').each((index, element) => {
            stylesheets.push($(element).attr('href'));
        });
        
        // Send the HTML content and CSS stylesheets as the response
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
        // Handle errors
        console.error('Error:', error);
        res.status(500).send('An error occurred while fetching the data.');
    }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

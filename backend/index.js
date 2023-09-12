const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = 4000;
const expectedApiToken = process.env.API_TOKEN;

// Middleware to parse JSON requests
app.use(bodyParser.json());

// Middleware for API token authentication
app.use((req, res, next) => {
    const apiToken = req.headers['x-api-token'];
    
    if (!apiToken) {
        return res.status(401).json({ error: 'API token missing.' });
    }

    // In a real-world scenario, you'd validate the token against some list/database of tokens.
    if (apiToken !== expectedApiToken) {
        return res.status(401).json({ error: 'Invalid API token.' });
    }

    next();
});

app.get('/weather', (_req, res) => {
  console.log('Handling Request');
    res.json({
        location: "New York",
        temperature: 24,
        condition: "Sunny"
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});


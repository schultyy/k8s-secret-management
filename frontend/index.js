const express = require('express');
const { exec } = require('child_process');
const pug = require('pug');
const axios = require('axios');

const app = express();
const port = 3000;
const weatherApiToken = process.env.WEATHER_API_TOKEN;
const weatherApiEndpoint = process.env.WEATHER_API_ENDPOINT;

app.use(express.urlencoded({ extended: true }));

async function fetchWeatherReport() {
  const response = await axios({
    method: 'get',
    url: `http://${weatherApiEndpoint}/weather`,
    headers: {
      'x-api-token': weatherApiToken
    }
  });

  console.log('response: ', response.status);
  console.log('response: ', response.data);

  if (response.status === 200) {
    return response.data;
  }
  else {
    return null;
  }
}

app.get('/', async (req, res) => {
  const weatherReport = await fetchWeatherReport();
  console.log('received report: ', weatherReport);
  const compiledFunction = pug.compileFile('public/index.pug');
  res.send(compiledFunction({report: weatherReport}));
});

app.post('/ping', (req, res) => {
  const domain = req.body.domain;

  console.log('Probing domain: ', domain);

  exec(`ping -c 4 ${domain}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      return;
    }

    if (stderr) {
      console.error(`stderr: ${stderr}`);
      return;
    }

    const output = stdout;
    res.send(output);
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});


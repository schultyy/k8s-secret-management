const express = require('express');
const { exec } = require('child_process');
const { Client } = require('pg');
const pug = require('pug');

const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));

async function storeToDatabase(domain) {
  const client = new Client();
  await client.connect();

  const text = 'INSERT INTO domains(name) VALUES($1);';
  const values = [domain];

  const res = await client.query(text, values);
  console.log(res);
  await client.end();
}

async function fetchLastDomains() {
  const client = new Client();
  await client.connect();

  const res = await client.query("SELECT NAME FROM domains LIMIT 5;");
  return res.rows.map(r => r.name);
}

app.get('/', async (req, res) => {
  console.log('fetching last domains');
  const result = await fetchLastDomains();
  console.log(result);

  const compiledFunction = pug.compileFile('public/index.pug');
  res.send(compiledFunction({domains: result}));
});

app.post('/ping', (req, res) => {
  const domain = req.body.domain;

  console.log('Probing domain: ', domain);

  exec(`ping -c 4 ${domain}`, async (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      return;
    }

    if (stderr) {
      console.error(`stderr: ${stderr}`);
      return;
    }

    const output = stdout;
    console.log(output);
    await storeToDatabase(domain);
    res.send(output);
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});


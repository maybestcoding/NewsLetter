const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const path = require('path');
const app = express();
require('dotenv').config();

const mailchimpApiKey = process.env.MAILCHIMP_API_KEY;

app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post("/", (req, res) => {
  const { fName: firstName, lName: lastName, email } = req.body;
  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  };

  const jsonData = JSON.stringify(data);
  const datacenter = mailchimpApiKey.split('-')[1].trim(); // Extract datacenter from API key
  const audienceId = 'a3b7a77982'; // Replace with your actual audience ID
  const url = `https://${datacenter}.api.mailchimp.com/3.0/lists/${audienceId}`;

  const options = {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${mailchimpApiKey}`,
      'Content-Type': 'application/json'
    }
  };

  const request = https.request(url, options, (response) => {
    if (response.statusCode === 200) {
      res.sendFile(path.join(__dirname, 'public', 'success.html'));
    } else {
      res.sendFile(path.join(__dirname, 'public', 'fail.html'));
    }
    response.on("data", (data) => {
      console.log(JSON.parse(data));
    });
  });

  request.on('error', (e) => {
    console.error(e);
    res.sendFile(path.join(__dirname, 'public', 'fail.html'));
  });

  request.write(jsonData);
  request.end();
});

app.post("/fail", (req, res) => {
  res.redirect("/");
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

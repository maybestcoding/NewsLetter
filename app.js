const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const path = require('path');
const app = express();
require('dotenv').config();
const mailchimpApiKey = process.env.MAILCHIMP_API_KEY;

app.use(express.static(path.join(__dirname)));

app.use(bodyParser.urlencoded({extended:true}));
app.get("/", function(req, res) {
  res.sendFile(__dirname+"/index.html")
  
});

app.post("/", function(req, res) {
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body. email;
  const data = {
    members : [
      {
        email_address: email,
        status : "subscribed",
        merge_fields : {
          FNAME : firstName,
          LNAME : lastName
        }
      }
    ]
  };

  const jasonData = JSON.stringify(data);
  
const datacenter = mailchimpApiKey.split('-')[1].replace(/"/g, '').trim();  // Extract datacenter from API key
console.log(datacenter)
const audienceId = 'a3b7a77982';  // Replace with your actual audience ID
const url = `https://${datacenter}.api.mailchimp.com/3.0/lists/${audienceId}`;

const options = {
    method: 'POST',
    headers: {
        'Authorization': `Bearer ${mailchimpApiKey}`,
        'Content-Type': 'application/json'
    }
};

  
  const request = https.request(url, options, function(response){
    if (response.statusCode === 200){
      console.log(response.statusCode)
        res.sendFile(path.join(__dirname, 'success.html'));
      }
      else {
        console.log(response.statusCode)
        res.sendFile(path.join(__dirname,"/fail.html"));
      }
    response.on("data", function(data){
      console.log(JSON.parse(data));
    })
  })
  request.write(jasonData);
  request.end();
});

app.post("/fail", function(req, res) {
  res.redirect("/");
})

app.listen(process.env.PORT || 3000, function() {
  console.log("Server started port 3000");
});



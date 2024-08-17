const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.get("/", function(req, res) {
  res.sendFile(__dirname+"/signup.html")
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
  const apiKey = 'ac71c12ae65ffb5883d5c1e32d1391f0-us9';
const datacenter = apiKey.split('-')[1];  // Extract datacenter from API key
const audienceId = 'a3b7a77982';  // Replace with your actual audience ID
const url = `https://${datacenter}.api.mailchimp.com/3.0/lists/${audienceId}`;

const options = {
    method: 'POST',
    headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
    }
};
  // const options = {
  //   method: "POST",
  //   auth: "Mayi:ac71c12ae65ffb5883d5c1e32d1391f0-us9"
  // }
  // url="https://us9.admin.mailchimp.com/lists/members/?id=a3b7a77982"

  // url = "https://us9.api.mailchimp.com/3.0/lists/a3b7a77982"
  const request = https.request(url, options, function(response){
    if (response.statusCode === 200){
      console.log(response.statusCode)
        res.sendFile(__dirname + "/success.html");
      }
      else {
        console.log(response.statusCode)
        res.sendFile(__dirname + "/fail.html");
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



// const options = {
//   method: "POST",
//   auth: "Mayi:25e9ca443c55b49b5d5079b393042baf-us20"
// }

// url = "https://us20.api.mailchimp.com/3.0/lists/30b1b228f9"
// ac71c12ae65ffb5883d5c1e32d1391f0-us9
//  auth: "Mayi:ac71c12ae65ffb5883d5c1e32d1391f0-us9"


//url = "https://us9.admin.mailchimp.com/audience/add-contact?id=1036028"
  
  
// a3b7a77982



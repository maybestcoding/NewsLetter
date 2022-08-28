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
  const options = {
    method: "POST",
    auth: "Mayi:25e9ca443c55b49b5d5079b393042baf-us20"
  }

  url = "https://us20.api.mailchimp.com/3.0/lists/30b1b228f9"
  const request = https.request(url, options, function(response){
    if (response.statusCode === 200){
        res.sendFile(__dirname + "/success.html");
      }
      else{
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

// 527d066778efdd93a598273d356e973f-us20
// 30b1b228f9

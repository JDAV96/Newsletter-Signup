//jshint esversion:6

const constants = require("./constants");
const https = require("https");
const bodyParser = require("body-parser");
const express = require("express");
const app = express();

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public"));

app.get("/", (req, res) =>
{
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", (req, res) =>
{
  const data =
  {
    email_address: req.body.email,
    status: "subscribed",
    merge_fields:
    {
      FNAME: req.body.firstName,
      LNAME: req.body.lastName
    }
  };

  const jsonData = JSON.stringify(data);

  const options =
  {
    method: "POST",
    auth: "key:" + constants.MAILCHIMP_API_KEY
  };

  const apiReq = https.request(constants.MAILCHIMP_API_AUDIENCE_LIST_ENDPOINT, options, (apiRes) =>
  {
    if (apiRes.statusCode === 200)
    {
      res.sendFile(__dirname + "/success.html");
    }
    else
    {
      res.sendFile(__dirname + "/failure.html");
    }
  });

  apiReq.write(jsonData);
  apiReq.end();

});

app.post("/failure", (req, res) =>
{
  res.redirect("/");
});

app.listen(3000, () =>
{
  console.log("server start on port 3000");
});

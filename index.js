const AWS = require('aws-sdk');
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
} = require("@aws-sdk/lib-dynamodb");
const express = require("express");
const serverless = require("serverless-http");
const multer = require("multer");
const multerS3 = require("multer-s3")

const fs = require("fs");

AWS.config.region = "us-east-1";
var s3Client = new AWS.S3();

const app = express();

const USERS_TABLE = process.env.USERS_TABLE;
const client = new DynamoDBClient();
const dynamoDbClient = DynamoDBDocumentClient.from(client);


AWS.config.update({
  accessKeyId: process.env.aws_access_key_id,
  secretAccessKey: process.env.aws_secret_access_key,
  region: "us-east-1"
})

var s3Client = new AWS.S3();

const upload = multer(
  {
    Storage: multerS3({
      s3: s3Client,
      ACL: 'public-read',
      bucket: "apiprojectaws-dev-serverlessdeploymentbucket-ztd99sqpap6i/",
      key: function(req, file, cb){
        console.log(file);
        cb(null, file.originalname);
      }

    })
    
  });


app.use(express.json());
/*
app.get("/users/:userId", async function (req, res) {
  const params = {
    TableName: USERS_TABLE,
    Key: {
      userId: req.params.userId,
    },
  };

  try {
    const { Item } = await dynamoDbClient.send(new GetCommand(params));
    if (Item) {
      const { userId, name } = Item;
      res.json({ userId, name });
    } else {
      res
        .status(404)
        .json({ error: 'Could not find user with provided "userId"' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Could not retreive user" });
  }
});

app.post("/users", async function (req, res) {
  const { userId, name } = req.body;
  if (typeof userId !== "string") {
    res.status(400).json({ error: '"userId" must be a string' });
  } else if (typeof name !== "string") {
    res.status(400).json({ error: '"name" must be a string' });
  }

  const params = {
    TableName: USERS_TABLE,
    Item: {
      userId: userId,
      name: name,
    },
  };

  try {
    await dynamoDbClient.send(new PutCommand(params));
    res.json({ userId, name });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Could not create user" });
  }
});
*/

app.post("/createFolder", upload.array('image'), function(req, res){

  var paramsBucket = {
    Bucket: 'apiprojectaws-dev-serverlessdeploymentbucket-ztd99sqpap6i',
    Key: "folder-asdfghjkl/",
    ACL: "public-read",
    Body: "body does not matter"
  }
  
  s3Client.upload(paramsBucket, function(err, data){
    if(err){
      console.log(err);
    }
    else{
      console.log("Successfully created folder in S3");
      //res.status(500).json({ success: "Successfully created folder in S3" });

      res.send({
        message: "Uploaded",
        urls: req.files.map(function(file){
          return {url: file.location, name: file.key, type: file.mimetype}
        })
      })
     
    }
  })

})

app.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found",
  });
});


module.exports.handler = serverless(app);

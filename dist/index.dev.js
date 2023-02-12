"use strict";

var AWS = require('aws-sdk');

var _require = require("@aws-sdk/client-dynamodb"),
    DynamoDBClient = _require.DynamoDBClient;

var _require2 = require("@aws-sdk/lib-dynamodb"),
    DynamoDBDocumentClient = _require2.DynamoDBDocumentClient,
    GetCommand = _require2.GetCommand,
    PutCommand = _require2.PutCommand;

var express = require("express");

var serverless = require("serverless-http");

AWS.config.region = "us-east-1";
var s3Client = new AWS.S3();
var app = express();
var USERS_TABLE = process.env.USERS_TABLE;
var client = new DynamoDBClient();
var dynamoDbClient = DynamoDBDocumentClient.from(client);
app.use(express.json());
app.get("/users/:userId", function _callee(req, res) {
  var params, _ref, Item, userId, name;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          params = {
            TableName: USERS_TABLE,
            Key: {
              userId: req.params.userId
            }
          };
          _context.prev = 1;
          _context.next = 4;
          return regeneratorRuntime.awrap(dynamoDbClient.send(new GetCommand(params)));

        case 4:
          _ref = _context.sent;
          Item = _ref.Item;

          if (Item) {
            userId = Item.userId, name = Item.name;
            res.json({
              userId: userId,
              name: name
            });
          } else {
            res.status(404).json({
              error: 'Could not find user with provided "userId"'
            });
          }

          _context.next = 13;
          break;

        case 9:
          _context.prev = 9;
          _context.t0 = _context["catch"](1);
          console.log(_context.t0);
          res.status(500).json({
            error: "Could not retreive user"
          });

        case 13:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[1, 9]]);
});
app.post("/users", function _callee2(req, res) {
  var _req$body, userId, name, params;

  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _req$body = req.body, userId = _req$body.userId, name = _req$body.name;

          if (typeof userId !== "string") {
            res.status(400).json({
              error: '"userId" must be a string'
            });
          } else if (typeof name !== "string") {
            res.status(400).json({
              error: '"name" must be a string'
            });
          }

          params = {
            TableName: USERS_TABLE,
            Item: {
              userId: userId,
              name: name
            }
          };
          _context2.prev = 3;
          _context2.next = 6;
          return regeneratorRuntime.awrap(dynamoDbClient.send(new PutCommand(params)));

        case 6:
          res.json({
            userId: userId,
            name: name
          });
          _context2.next = 13;
          break;

        case 9:
          _context2.prev = 9;
          _context2.t0 = _context2["catch"](3);
          console.log(_context2.t0);
          res.status(500).json({
            error: "Could not create user"
          });

        case 13:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[3, 9]]);
});
app.post("/createFolder", function (req, res) {
  var paramsBucket = {
    Bucket: 'apiprojectaws-dev-serverlessdeploymentbucket-ztd99sqpap6i',
    Key: "folder-asdfghjkl/",
    ACL: "public-read",
    Body: "body does not matter"
  };
  s3Client.upload(paramsBucket, function (err, data) {
    if (err) {
      console.log(err);
    } else {
      console.log("Successfully created folder in S3");
      console.log(data);
    }
  });
});
app.use(function (req, res, next) {
  return res.status(404).json({
    error: "Not Found"
  });
});
module.exports.handler = serverless(app);
//# sourceMappingURL=index.dev.js.map

"use strict";

var AWS = require("aws-sdk");

var multer = require("multer");

var multerS3 = require("multer-s3"); //---------------AWS CONFIG----------------------------


AWS.config.update({
  accessKeyId: process.env.aws_access_key_id,
  secretAccessKey: process.env.aws_secret_access_key,
  region: "us-east-1"
});
var s3Client = new AWS.S3();

var fileFilter = function fileFilter(req, file, cb) {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type, only JPEG/JPG/PNG'), false);
  }
};

var upload = multer({
  fileFilter: fileFilter,
  storage: multerS3({
    acl: 'public-read',
    s3: s3,
    bucket: 'apiprojectaws-dev-serverlessdeploymentbucket-ztd99sqpap6i',
    key: function key(req, file, cb) {
      cb(null, Date.now().toString());
    }
  })
});
module.exports = upload;
//# sourceMappingURL=image-uplod.dev.js.map

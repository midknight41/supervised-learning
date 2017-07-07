/* eslint-disable no-sync */
const fs = require("fs");

const loadData = function (fileName) {

  const contents = fs.readFileSync(`${fileName}`).toString();
  const analysis = JSON.parse(contents);

  return analysis;

};

const getFiles = function (dir) {

  return fs.readdirSync(dir);

};

exports.loadData = loadData;
exports.getFiles = getFiles;

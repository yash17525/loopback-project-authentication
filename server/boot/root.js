// Copyright IBM Corp. 2014,2016. All Rights Reserved.
// Node module: loopback-example-passport
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

'use strict';
var config = require('../../providers.json');
module.exports = function (app) {
  const router = app.loopback.Router();
  var model;
  for (var s in config) {
    var c = config[s];
    if (c.authScheme == "otp") {
      var model = c.modelToSaveGeneratedKeys;
      if (!app.models[model]) {
        console.log('model \'' + model +'\' doesn\'t exist');
        process.exit();
      }
      break;
    }
  }
}
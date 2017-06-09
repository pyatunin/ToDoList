var config = require('../config');

var mongoose = require('mongoose');
mongoose.connect(config.get("mongoose:uri"), config.get("mongoose:options"));

module.exports = mongoose;

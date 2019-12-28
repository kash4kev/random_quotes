var http = require('http');
var fs = require('fs');
var del = require('del');
var request = require('request'); 
var NodeHelper = require("node_helper");

module.exports = NodeHelper.create({
	start: function() {
		console.log("Starting node helper: " + this.name);
		this.returnedData = {};
	},

	socketNotificationReceived: function(notification, payload) {
		if (notification === "FETCH_QUOTE") {
			var url = payload.domain + payload.path;
			console.log("Downloading random quote: " + notification + " From URL: " + url);

			var self = this;
			request(url, function(error, response, body) {
				if (error) {
					return console.log(error);
				}
				self.returnedData = body;

				self.sendSocketNotification("QUOTE_FETCHED", self.returnedData);
			});
		}
	},
});

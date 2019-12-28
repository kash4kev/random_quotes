/* Magic Mirror Module: random_quotes
 * v1.0 - June 2016
 *
 * By Ashley M. Kirchner <kirash4@gmail.com>
 * Beer Licensed (meaning, if you like this module, feel free to have a beer on me, or send me one.)
 */

Module.register("random_quotes", {
	defaults: {
		domain: "https://api.quotable.io/",
		path: "random",
		updateInterval: 5 * 60 * 1000, // Every five minutes
		fadeSpeed: 4
	},

	// Define start sequence.
	start: function() {
		Log.info("Starting module: " + this.name);
		this.quote = '{ "content": "", "author": ""}';

		this.updateQuote();

		// Schedule update timer.
		var self = this;
		self.timer = setInterval(function() {
			self.updateQuote();
		}, this.config.updateInterval);
	},

	// Override dom generator.
	getDom: function() {
		var payload = JSON.parse(this.quote);

		var wrapper = document.createElement("div");

		var quoteDiv = document.createElement("div");
		quoteDiv.className = "bright medium light";
		quoteDiv.style.textAlign = 'center';
		quoteDiv.style.margin = '0 auto';
		quoteDiv.style.maxWidth = '50%';
		quoteDiv.innerHTML = payload.content;

		wrapper.appendChild(quoteDiv);

		var authorDiv = document.createElement("div");
		authorDiv.className = "light small dimmed";
		authorDiv.innerHTML = "~ " + payload.author;

		wrapper.appendChild(authorDiv);

		return wrapper;
	},

	updateQuote: function() {
		this.sendSocketNotification("FETCH_QUOTE", {domain: this.config.domain, path: this.config.path });
	},

	socketNotificationReceived: function(notification, payload) {
		if (notification == "QUOTE_FETCHED") {
			this.quote = payload;
			this.updateDom(this.config.fadeSpeed * 1000);
		}
	}
});

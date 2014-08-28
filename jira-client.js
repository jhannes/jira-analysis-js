var request = require('request-json');

var settings = require('./jira-settings');
var client = request.newClient(settings.url);
client.setBasicAuth(settings.username, settings.password);

module.exports = client;

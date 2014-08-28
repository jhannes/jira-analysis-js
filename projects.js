var client = require('./jira-client');
var _ = require('underscore');

client.get('rest/api/2/project', function(err, res, body) {
  if (err) return console.log(err);

  for (var i = 0; i < body.length; i++) {
    (function(project) {
      var url = 'rest/api/2/search?jql=project=' + project.id + '&maxResults=0';
      client.get(url, function(err, res, body) {
        if (err) return console.log(err);
        console.log(project.key, body.total);
      });
    })(body[i]);
  };
});


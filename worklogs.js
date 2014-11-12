var client = require('./jira-client');
var moment = require('moment');

var projects = require('./jira-settings').projects;
var teams = require('./jira-settings').teams;

for (var i = 0; i < projects.length; i++) {
  (function(project) {
    var url = 'rest/api/2/search?jql=project=' + project + '+ORDER+BY+updatedDate+desc&maxResults=1500&fields=project,parent';
    client.get(url, function(err, res, body) {
      console.error("Getting worklog for " + project + ": " + url);
      if (err) return console.log(err);

      for (var i = 0; i < body.issues.length; i++) {
        (function(issue) {
          client.get(issue.self + "/worklog", function(err, res, body) {
            if (err) return console.log(err);
            for (var i = 0; i < body.worklogs.length; i++) {
              var worklog = body.worklogs[i];
              var parentKey = issue.key;
              if (issue.fields.parent) parentKey = issue.fields.parent.key;

              console.log(worklog.author.name,
                      teams[worklog.author.name],
                      worklog.timeSpentSeconds/3600, 
                      moment(worklog.started).format("YYYY-MM-DD"), 
                      moment(worklog.started).format("GGGG[-w]WW"), 
                      issue.key,
                      issue.fields.project.key,
                      parentKey);
            }
          });
        })(body.issues[i]);
      };
    });
  })(projects[i]);
}


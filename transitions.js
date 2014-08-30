var client = require('./jira-client');
var _ = require('underscore');
var moment = require('moment');

var statuses = require("./jira-settings").statuses;
var projects = require("./jira-settings").projects;


var fields = [  
  "project", "projectKey", "key", "description", "issuetype", "version", "status", "statusName", 'lastChange',
  "resolutiondate"];

var statusCodes = _.uniq(_.values(statuses));
statusCodes.sort();

for (var key = 0; key < statusCodes.length; key++) {
  fields.push(statusCodes[key]);
}


console.log(fields.join(';'));

for (var i = 0; i < projects.length; i++) {

  (function(project) {
    var url = 'rest/api/2/search?jql=project=' + project + '&maxResults=1500&expand=changelog';
    client.get(url, function(err, res, body) {
      console.error("Getting transitions for " + project + ": " + url);
      if (err) return console.log(err);

      for (var i = 0; i < body.issues.length; i++) {
        var issueJson = body.issues[i];
        var issue = {
          project: issueJson.fields.project.name,
          projectKey: issueJson.fields.project.key,
          key: issueJson.key,
          resolutiondate: null,
          issuetype: issueJson.fields.issuetype.name,
          version: "'" + _.pluck(issueJson.fields.fixVersions, 'name').join(),
          status: statuses[issueJson.fields.status.name] || ("!!!" + issueJson.fields.status.name),
          statusName: issueJson.fields.status.name,
          lastChange: moment(issueJson.fields.created).format("GGGG[-w]WW"),
          description: issueJson.fields.summary
        };
        if (issue.issuetype.indexOf('-') === 0) {
          issue.issuetype = "'" + issue.issuetype;
        }
        if (issueJson.fields.resolutiondate) {
          issue.resolutiondate = new Date(issueJson.fields.resolutiondate).toISOString().substring(0, 10);
        }
        for (var key = 0; key < _.values(statuses).length; key++) {
          issue[_.values(statuses)[key]] = null;
        }

        var currentStatus = ""
        for (var j = 0; j < issueJson.changelog.histories.length; j++) {
          var history = issueJson.changelog.histories[j];
          var status = _.find(history.items, function(item) { return item.field === 'status'; });
          if (status) {
            var status = statuses[status.toString] || ("!!!" + status.toString);
            issue.lastChange = moment(history.created).format("GGGG[-w]WW");
            if (status !== currentStatus) {
              issue[status] = moment(history.created).format("GGGG[-w]WW");              
            }
            currentStatus = status;
          }
        };

        console.log(_.collect(fields, function(f) { return issue[f]; }).join(";"));
      }
    });
  })(projects[i]);
}


Jira Analysis
=============

This project contains a collection of scripts used to analyze issues
and hours from Jira. It uses the JIRA REST API to retrieve data.

Usage:
------
Prerequisites: NodeJS

1. Run `npm install` to install all dependencies
2. Copy jira-settings-template.js to jira-settings.js
3. In jira-settings.js update your server, username and password
4. In jira-settings.js set the list of JIRA projects you would
   like to analyze (you can retrieve a list of projects from
   your JIRA installation by running 'node projects.js')
5. Run `node worklogs.js > worklogs.txt` to pull down hours
6. Run `node transitions.js > transitions.txt` to pull down issues
7. Create an Excel spreadsheet. Use the text import wizard to
   import worklogs.txt and transitions.txt
8. Use pivot diagrams to analyze the data


Future work:
------------

I would like to use these scripts to directly create
HTML reports.


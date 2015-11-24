var argv = require('minimist')(process.argv.slice(2));

console.log(argv)

var query = argv._[0];
var _ = require('lodash')
var google = require('google');
var async = require('async');
var cheerio = require('cheerio');
var fetch = require('node-fetch');

google.resultsPerPage = 20


google(query, function(err, next, links) {
	console.log(links);
	if (err) console.error(err)
	/*
	async.each(links, function(link, callback) {
			if (!_.includes(link.href, "pagesjaunes")) {
				console.log(link.href)
				fetch(link.href)
					.then(function(res) {
						return res.text();
					}).then(function(body) {
						parsePage(body, callback)
					});
			}
		}, function() {
			console.log('okok')
		})*/
		/*if (nextCounter < 4) {
			nextCounter += 1
			if (next) next()
		}*/
})

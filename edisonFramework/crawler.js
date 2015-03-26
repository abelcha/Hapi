
module.exports.getOvhSessionId = function(callback) {
	var request = require("request");
	var cookie = require("cookie");
	var loginUrl = 'https://www.ovh.com/managerv3/login.pl';
	var credentialsOld = {session_nic:'te8028-ovh', session_password:'123456789aze', language:'fr'};
	var credentials = 	 {session_nic:'bb71961-ovh', session_password:'123456789aze', language:'fr'};
	request.post({url:loginUrl, form:credentials}, function (err, resp, body) {
		
		if (err)
			return callback(err);
		
		if (!resp || !resp.caseless || !resp.caseless.dict)
			return callback({message:"cannot get cookies"});

			resp.caseless.dict['set-cookie'].forEach(function(e, i) {
			    if (e.substr(0,12) === "OVHSESSIONID") {
			      var sessionId = cookie.parse(e).OVHSESSIONID;
			    	return callback(null, sessionId);
			    }
			});
	});
};

module.exports.getOvhIncomingCalls = function(number, sessionId, callback) {

	var path = require('path');
	var phantomPath = require('phantomjs').path;
	var scriptPath = path.join(__dirname, '../public/phantom/ovh-incoming-calls.js');
	var args = [scriptPath, sessionId, number];
	var logs = [];

	require('child_process').execFile(phantomPath, args , function(err, content) {
	if (err) return callback({status:'err', err:err});			

		require('xml2js').parseString(content, function (err, result) {
		if (err) return callback({status:'err', err:err});

		    result.tbody.tr.forEach(function(e, i) {
		      if (e.td && e.td[1]) {
		        logs[i - 1] = {
		          date: require("moment")(e.td[1]._ + e.td[2]._, "DD/MM/YYh:m:s").toString(),
		          origin: e.td[3]._,
		          duration: e.td[5]._,
		          status: e.td[6]._,                
		        }
		      }    
		    });
		  return callback({status:'ok', logs:logs, sessionId:sessionId});
		});
	});
};


module.exports.getInfosQuartier = function(address, callback) {

	var request = require("request")
	var url = "http://www.kelquartier.com/gmap_ajax/search-point";
	request.post({url: url, json: true, form: address}, function (error, response, body) {
		if (error) return callback(error);
	  request({url: "http://www.kelquartier.com" +  body.link}, function (error2, response2, body2) {
	    if (error2) return callback(err);
	    var cheerio = require('cheerio'),
	    $ = cheerio.load(body2);
	    var rtn = {};
	    rtn.tauxChomage = $('#carteNum_15>.td_A').next().html();
	    rtn.ageMoyen = $('#carteNum_16>.td_B').next().html();
	    rtn.revenuMoyen = $('.legendes_points_cles>strong')[0].children[0].data.split(' ')[0];
	    rtn.typeQuatier = $('.ligne_tab_points_cles.border_bas').last().children().next().html().trim();
	    return callback(rtn);
	  });
})
};


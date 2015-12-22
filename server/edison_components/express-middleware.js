module.exports = function(express) {
	var _ = require('lodash');

	express.response.pdf = function(obj, headers, status) {
		this.header('Content-Type', 'application/pdf');
		return this.send(obj, headers, status);
	};

	express.response.table = function(obj, headers, status) {
		var row = _.map(obj, function(e) {
			return '<td>' + e.join('</td><td>') + '</td>';
		})
		var css = '<style> table, td, th {padding: 1px 10px;border: 1px solid black;}</style>'
		this.send(css + '<table><tr>' + row.join('</tr><tr>') + '</tr></table');
	}

	express.response.xls = function(obj, headers, status) {
		var _this = this;
		var xlsx = require('node-xlsx');

		this.setHeader('Content-disposition', 'attachment; filename=' + obj.name + ".xlsx");

		return this.send(xlsx.build([{
				name: obj.name,
				data: obj.data
			}]))
			// returns a buffer

		//  this.contentType('text/csv');

	};

	express.response.sage = function(obj, headers, status) {
		var _this = this;
		this.contentType('text/csv');
		this.setHeader('Content-disposition', 'attachment; filename=' + "Ecritures.txt");
		var rtn = "";
		_.each(obj, function(e) {
			_this.write(e.join(';') + "\r\n");
		})
		return this.end();
	};



	express.response.jsonStr = function(obj, headers, status) {
		this.header('Content-Type', 'application/json');
		return this.send(obj, headers, status);
	};
}

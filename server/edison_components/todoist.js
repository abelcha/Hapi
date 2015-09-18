var request = require('request-promise');
var _ = require('lodash');
var argumentor = require('argumentor');

var Todoist = function() {
    var _this = this;
    this.loginRequest = request.post('https://todoist.com/API/v6/login', {
        form: {
            email: 'abel@chalier.me',
            password: 'kvx26tEb'
        }
    })
}


Todoist.prototype.applyRequest = function(url, options) {
    var params = {}
    if (typeof url === 'string' && typeof options === 'object') {
        params.url = url;
        params.options = options;
    } else if (typeof url === 'string' && typeof options === 'undefined') {
        params.url = url;
        params.options = {};
    } else if (typeof url === 'object' && typeof options === 'undefined') {
        params.url = options;
        params.options = {};
    }
    console.log(params)
    return request.post('https://todoist.com/API/v6' + params.url).form(params.options)
}

Todoist.prototype.request = function() {
    var _this = this;
    var args = arguments;
    return new Promise(function(resolve, reject) {
        if (!this.token) {
            _this.loginRequest
                .then(function(resp) {
                    _this.token = JSON.parse(resp).token;
                    _this.applyRequest.apply(_this, args).then(resolve, reject)
                })
        } else {
            _this.applyRequest.apply(_this, args).then(resolve, reject)
        }
    })
}


/*Todoist.prototype.request = function(type, arg) {
    arg.type = type;
    request.post('https://todoist.com/API/v6/login', {
            form: arg
        },
        function(error, response, body) {
            console.log(body);
        });
}

*/
//module.exports = Todoist;
/*
request.post({
    url: 'https://todoist.com/API/v6/sync',
    form: {
        token: '0d4c2aaf41f9cd4a62f3a8e4ac0b5ca725cf54b3',
        seq_no: 0,
        seq_no_global: 0,
        resource_types: ['all']
    }
}).then(function(resp) {
    console.log('-->', resp)
}, function(err) {
    console.log('==>', err)
})
*/
/*var todoist = new Todoist()
todoist.request('/sync', {
    seq_no: 0,
    seq_no_global: 0,
    resource_types: ["all"],
}).then(function(resp) {
    console.log('ok=>', (resp))
}, function(err)  {
    console.log('ERRR-->', err)
})
*/

/*todoist.request('sync', {
	lol:'totto'
})



todoist.request('swag');

todoist.request({
	yaya:'only'
})*/

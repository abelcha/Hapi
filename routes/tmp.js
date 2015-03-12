var request = require('request');

module.exports.routes = function(app, _db, _user, memCache) {


 
app.get('/q', function(req, res) {

var cookieJar = request.jar();
 cookieJar.setCookie("JSESSIONID=A24FFCDF3AAB3C98E3C92A76623D4F65", 'http://avis-situation-sirene.insee.fr/avisitu/AvisPdf.do');
 request({
        method: 'GET',
        uri: 'http://avis-situation-sirene.insee.fr/avisitu/AvisPdf.do',
        jar: cookieJar
    },
    function(err, xres, body) {
        if (err) { return console.log(err) };

/*        console.log(cookieJar);
        console.log(res.statusCode);
        console.log(res.headers);*/
      res.json({err:err, xres:xres, body:body});
    });
});


};
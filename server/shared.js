module.exports = function() {

    require('pretty-error').start();

    global.requireLocal = function(pth) {
        return require(process.cwd() + '/' + pth)
    }

    global.__catch = function(e) {
        var prettyError = require('pretty-error');
        console.log((new prettyError().render(e)));
    }

    require('nodeify').extend();
    var key = requireLocal('config/_keys');
    var dep = require(process.cwd() + '/server/loadDependencies');
    global.edison = dep.loadDir(process.cwd() + "/server/edison_components");
    global.envProd = process.env.APP_ENV === "PRODUCTION";
    global.envDev = process.env.APP_ENV === "DEVELOPMENT";
    global.envStaging = process.env.APP_ENV === "STAGING";
    global.redis = edison.redis();
    global.db = edison.db();
    global.sms = new edison.mobyt(key.mobyt.login, key.mobyt.pass);
    global.mail = new edison.mail;
    global.document = new edison.dropbox();
    edison.extendPrototypes();
    edison.users = new edison.users();
}

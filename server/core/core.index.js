module.exports = function(modelName, schema) {
    var core = requireLocal(['server', 'models', modelName, modelName + '.core.js'].join('/'));
    //schema.statics.dump = require('./core.dump')(core);

    /* on save update cachelist + filter (=cacheActualise) */
    schema.statics.uniqueCacheReload = require('./core.unique-cache-reload')(core);
    schema.statics.throttleCacheReload = require('./core.throttle-cache-reload')(core);


    /* reload list of cache:{t:12, ...} for display  (getCache)*/
    schema.statics.cacheListReload = require('./core.reload-cache-list')(core);
    /* getter  (list)*/
    schema.statics.getCacheList = require('./core.get-cache-list')(core);


    /* cache.fltr update mongo (=fltrify)*/
    schema.statics.reloadFilters = require('./core.reload-filters')(core);
    schema.statics.reloadAllFilters = function(req, res) {
        return require('./core.reload-filters')(core)({}, function(err, resp) {
            res.json([err, resp])
        });
    }




    /* full reload on dump end*/
    schema.statics.fullReload = require('./core.full-reload')(core);

    schema.statics.temporarySaving = require('./core.temporary-saving')(core);


    schema.statics.view = require('./core.view')(core);

    schema.statics.__update = require('./core.update')(core);

    schema.statics.__save = require('./core.save')(core);

    schema.statics.iterator = require('./core.document-iterator')(core);


    schema.statics.Core = core;


}

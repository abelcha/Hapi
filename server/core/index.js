module.exports = function(modelName, schema) {
    var core = requireLocal(['server', 'models', modelName, 'core.js'].join('/'));
    schema.statics.dump = require('./__dump')(core);


    /* reload list of cache:{t:12, ...} for display  (getCache)*/
    schema.statics.cacheListReload = require('./__reload-cache-list')(core);
    /* getter  (list)*/
    schema.statics.getCacheList = require('./__get-cache-list')(core);


    /* cache.fltr update mongo (=fltrify)*/ 
    schema.statics.reloadFilters = require('./__reload-filters')(core);
    schema.statics.reloadAllFilters = function(req, res) {
        return require('./__reload-filters')(core)({}, function(err, resp) {
            res.json([err, resp])
        });
    }


    /* on save update cachelist + filter (=cacheActualise) */
    schema.statics.uniqueCacheReload = require('./__unique-cache-reload')(core);


    /* full reload on dump end*/
    schema.statics.fullReload = require('./__full-reload')(core);

    schema.statics.temporarySaving = require('./__temporary-saving')(core);
   

    schema.statics.view = require('./__view')(core);

    schema.statics.__update = require('./__update')(core);

    schema.statics.__save = require('./__save')(core);

    schema.statics.iterator = require('./__document-iterator')(core);


    schema.statics.Core = core;


}

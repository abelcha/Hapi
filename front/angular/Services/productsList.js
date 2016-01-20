angular.module('edison').factory('productsList', function($q, dialog, openPost, edisonAPI) {
    "use strict";
    var Produit = function(produits) {
        this.produits = produits;
        var _this = this
        if (!this.ps) {
            edisonAPI.product.list().then(function(resp) {
                _this.ps = resp.data
            })
        }
        _.each(this.produits, function(e) {
            if (e.desc.toLowerCase() != e.title.toLowerCase()) {
                e.showDesc = true
            }
        })
        this.lastCall = _.now()
    }
    Produit.prototype = {
        remove: function(index) {
            this.produits.splice(index, 1);
        },
        moveTop: function(index) {
            if (index !== 0) {
                var tmp = this.produits[index - 1];
                this.produits[index - 1] = this.produits[index];
                this.produits[index] = tmp;
            }

        },
        moveDown: function(index) {
            if (index !== this.produits.length - 1) {
                var tmp = this.produits[index + 1];
                this.produits[index + 1] = this.produits[index];
                this.produits[index] = tmp;
            }
        },
        edit: function(index) {
            var _this = this;
            dialog.editProduct.open(this.produits[index], function(res) {
                _this.produits[index] = res;
            })
        },
        add: function(prod) {
            if (this.lastCall + 100 > _.now())
                return 0
            this.lastCall = _.now()
            this.searchText = '';
            prod.quantite = 1;
            this.produits.push(prod);
        },
        search: function(text) {
            var rtn = []
            for (var i = 0; i < this.ps.length; ++i) {
                if (text === this.ps[i].title)
                    return [];
                var needle = _.deburr(text).toLowerCase()

                var haystack = _.deburr(this.ps[i].title).toLowerCase();
                var haystack2 = _.deburr(this.ps[i].ref).toLowerCase();
                var haystack3 = _.deburr(this.ps[i].desc).toLowerCase();
                if (_.contains(haystack, needle) ||
                    _.contains(haystack2, needle) ||
                    _.contains(haystack3, needle)) {
                    var x = _.clone(this.ps[i])
                    x.random = _.random();
                    rtn.push(x)
                }
            }
            return rtn
        },
        /*        search: function(text) {
                    var deferred = $q.defer();
                    edisonAPI.searchProduct(text)
                        .success(function(resp) {
                            deferred.resolve(resp)
                        })
                    return deferred.promise;
                },*/
        getDetail: function(elem) {
            if (!elem)
                return 0
            var _this = this;
            dialog.selectSubProduct(elem, function(resp) {
                var rtn = {
                    showDesc: true,
                    quantite: 1,
                    ref: resp.ref,
                    title: elem.nom,
                    desc: resp.nom + '\n' + elem.description.split('-').join('\n'),
                    pu: Number(resp.prix)
                }
                _this.add(rtn)
            })
        },
        flagship: function() {
            return _.mapBy(this.produits, 'pu');
        },
        total: function() {
            var total = _.round(_.sum(this.produits, function(e)  {
                return (e.pu || 0) * (e.quantite || 0);
            }), 2)
            return total;
        },

    }

    return Produit;


});

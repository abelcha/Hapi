angular.module('edison').factory('fourniture', [function() {    
    "use strict";
    return {
        init: function(fourniture) {
            this.fourniture = fourniture;
            if (!this.fourniture)
                this.fourniture = [];
            return this;
        },
        remove: function(index) {
            this.fourniture.splice(index, 1);
        },
        moveTop: function(index) {
            if (index !== 0) {
                var tmp = this.fourniture[index - 1];
                this.fourniture[index - 1] = this.fourniture[index];
                this.fourniture[index] = tmp;
            }

        },
        moveDown: function(index) {
            if (index !== this.fourniture.length - 1) {
                var tmp = this.fourniture[index + 1];
                this.fourniture[index + 1] = this.fourniture[index];
                this.fourniture[index] = tmp;
            }
        },
        add: function() {
            console.log('add')
            this.fourniture.push({
                title: 'Fourniture',
                fournisseur: 'ARTISAN',
                quantite: 1,
                pu: 0
            });
        },
        total: function() {
            var total = 0;
            if (this.fourniture) {
                this.fourniture.forEach(function(e) {
                    total += (e.pu * e.quantite);
                })
            }
            return total
        }
    }

}]);

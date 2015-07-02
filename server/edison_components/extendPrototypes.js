module.exports = function() {
    String.prototype.replaceAll = function(target, replacement) {
        return this.split(target).join(replacement);
    }
    Number.prototype.round = function(number) {
    	number = number || 2;
    	var pow = Math.pow(10, number);
    	return Math.round(this * pow) /  pow;
    }
}

module.exports = function() {

    String.prototype.envify = function(str) {
        return [process.env.APP_ENV, this].join('_')
    }
    
    String.prototype.lsplit = function() {
        return this.match(new RegExp('.{1,' + ((arguments.length == 1) ? (isFinite(String(arguments[0]).trim()) ? arguments[0] : false) : 1) + '}', 'g'));
    }

    String.prototype.replaceAll = function(target, replacement) {
        return this.split(target).join(replacement);
    }
    Number.prototype.round = function(number) {
        number = number || 2;
        var pow = Math.pow(10, number);
        return Math.round(this * pow) / pow;
    }
    Number.prototype.safeAdd = function(number) {
        console.log(this, number, (this + number).round())
        return (this + number).round()
    }
    Array.prototype.swap = function(x, y) {
        var b = this[x];
        this[x] = this[y];
        this[y] = b;
        return this;
    }

}

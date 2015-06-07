module.exports = function() {
    String.prototype.replaceAll = function(target, replacement) {
        return this.split(target).join(replacement);
    }
}

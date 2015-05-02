var Time = function(seconds) {

  this._seconds = seconds || 0;

}

Time.prototype._getSeconds = function() {
  return this._seconds;
}

Time.prototype._extractSeconds = function() {
  return this._getSeconds() % 60 / 1;
}

Time.prototype._extractMinutes = function() {
  return Math.floor((this._getSeconds() - this._extractSeconds()) % 3600 / 60);
}

Time.prototype._extractHours = function() {
  return Math.floor((this._getSeconds() - this._extractSeconds() - this._extractMinutes()) / 3600);
}

Time.prototype.humanify = function() {

  var str = '';
  if (this._extractHours() !== 0)
    str += this._extractHours() + ' Hours ';
  if (this._extractMinutes() !== 0 || this._extractHours() !== 0)
    str += this._extractMinutes() + ' Minutes ';
  str += this._extractSeconds() + ' Seconds ';
  return str;
}

var t = new Time(60);
console.log(t.humanify())

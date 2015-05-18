
module.exports = function(schema) {
  /*schema.virtual('etat').get(function() {
    var _this = this;

    if (_this.annulation && _this.annulation.active)
      return 'ANN';
    if (_this.litige && _this.litige.active)
      return 'LIT';
    if (!_this.date.envoi || !_this.date.intervention)
      return 'APR';
    if (_this.date.verification)
      return 'ATT';
    if ((Date.now() - 7200000) > (new Date(_this.inter.date.intervention)).getTime())
      return 'AVR';
  return 'ENV';
  })*/
}

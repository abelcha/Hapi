function pad(number) {
  return number < 10 ? '0' + number : number
}
angular.module("edison").filter('relativeDate', function() {

  var minute = 60 * 1000;
  var hour = 60 * minute;
  var day = 24 * hour;
  var week = 7 * day;
  var month = 4 * week;
  var year = 12 * month;

  return function(date) {
    var now = Date.now();
    var date = new Date(date);
    var today = (new Date()).setHours(0, 0, 0, 0);

    var diff = now - date.getTime();
    if (diff < minute)
      return ("à l'instant");
    if (diff < hour)
      return Math.round(diff / minute) + ' minutes';
    if (diff < day) {
      if (date > today) {
        return 'Auj. ' + pad(date.getHours()) + "H" + pad(date.getMinutes());
      } else {
        return 'Hier ' + pad(date.getHours()) + "H" + pad(date.getMinutes());
      }
    }
    if (diff < week)
      return Math.round(diff / day) + ' jours';
    if (diff < month)
      return Math.round(diff / week) + ' semaines'
    if (diff < year)
      return Math.round(diff / week) + ' ans'
  }
});

function getValue(path, origin) {
  if (origin === void 0 || origin === null) origin = self ? self : this;
  if (typeof path !== 'string') path = '' + path;
  var c = '',
    pc, i = 0,
    n = path.length,
    name = '';
  if (n)
    while (i <= n)((c = path[i++]) == '.' || c == '[' || c == ']' || c == void 0) ? (name ? (origin = origin[name], name = '') : (pc == '.' || pc == '[' || pc == ']' && c == ']' ? i = n + 2 : void 0), pc = c) : name += c;
  if (i == n + 2) throw "Invalid path: " + path;
  return origin;
}

function cleanString(str) {
  str = str.toString().toLowerCase();
  str = str.replace(/[éèeê]/g, "e");
  str = str.replace(/[àâ]/g, "a");
  return str;
}

angular.module("edison").filter('tableFilter', function() {
  return function(data, fltr, c) {
    console.time("lol");
    var rtn = [];
    for (x in fltr) {
      fltr[x] = cleanString(fltr[x]);
    }

    for (k in data) {
      if (data[k].id) {
        var psh = true;
        for (x in fltr) {
          var str = data[k][x];
          if (!str || str.length === 0 || cleanString(str).indexOf(fltr[x]) < 0) {
            psh = false;
            break;
          }
        }
        if (psh)
          rtn.push(data[k]);
      }
    }
    console.timeEnd("lol")
    return rtn;
  }
});

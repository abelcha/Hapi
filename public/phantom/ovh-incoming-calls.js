var page = require('webpage').create(),
    system = require('system'),
    address, output, size;



var cpt = 0;

function parsePage() {
      window.setTimeout(function(){
        if (++cpt === 30) {
          console.log("fail");
          phantom.exit(0);
        }
        if (page.content.indexOf('ovhuniqname="all_incoming"') < 0)
          return (parsePage());
        var ua = page.evaluate(function() {
            return document.getElementById("table_all_incoming").outerHTML;
          });
         console.log(ua);
       phantom.exit(0);
      }, 1000)
}

var url =   "https://www.ovh.com/managerv3/telephony2-main.pl?" +
                "session_id=" + system.args[1] + 
                "#rdm/44720/menu/number/grp/all/num/" +
                system.args[2] + "/page/" + 
                "number_consumption_incoming_calls"
    page.open(url, function (status) {
	    if (status !== 'success') {
		console.log('fail');
		phantom.exit(1);
	    } else {
			parsePage();
	    }
	});
var Prince = require("prince");
 
Prince()
    .inputs("facturePreview.html")
    .output("test.pdf")
    .execute()
    .then(function () {
        console.log("OK: done");
    }, function (error) {
        console.log("ERROR: ", util.inspect(error));
    })
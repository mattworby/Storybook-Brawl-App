const request = require("requests");

let url = "http://badguyty.com/images/sbb/sbb-cards.json";

request(url,true).on('data', function (chunk) {
    let jsonOut = JSON.parse(chunk);

    //document.getElementById("jsonText").innerHTML = JSON.stringify(jsonOut);
}).on('end', function (err) {
    if (err) return console.log('connection closed due to errors', err);
});
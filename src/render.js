const request = require("requests");
const {ipcRenderer} = require('electron');

let url = "http://badguyty.com/images/sbb/sbb-cards.json";
let jsonOut;

request(url,true).on('data', function (chunk) {
    jsonOut = JSON.parse(chunk);

}).on('end', function (err) {
    if (err) return console.log('connection closed due to errors', err);
});

function changeWindow(id) {
    ipcRenderer.send('resize-window');

    if (document.getElementById(`level${id}Tooltip`).style.visibility === 'visible'){
        document.getElementById(`level${id}Tooltip`).style.visibility = "hidden";
        document.getElementById(`level${id}Tooltip`).style.opacity = "1";
    } else if (document.getElementById(`level${id}Tooltip`).style.visibility === 'hidden' || document.getElementById(`level${id}Tooltip`).style.visibility === ''){
        document.getElementById(`level${id}Tooltip`).style.visibility = "visible";
        document.getElementById(`level${id}Tooltip`).style.opacity = "1";
    }
}
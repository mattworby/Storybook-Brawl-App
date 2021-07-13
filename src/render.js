const request = require("requests");
const {ipcRenderer} = require('electron');

let url = "http://badguyty.com/images/sbb/sbb-cards.json";
let jsonOut;

request(url,true).on('data', function (chunk) {
    jsonOut = JSON.parse(chunk);

    for(let i = 0; i < jsonOut.length; i++){

        switch (JSON.stringify(jsonOut[i].Cost)){
            case "\"2\"":
                generateChild(i, 2);
                break;
            case "\"3\"":
                generateChild(i, 3);
                break;
            case "\"4\"":
                generateChild(i, 4);
                break;
            case "\"5\"":
                generateChild(i, 5);
                break;
            case "\"6\"":
                generateChild(i, 6);
                break;
            case "\"7\"":
                generateChild(i, 7);
                break;
            default:
                break;
        }
    };

}).on('end', function (err) {
    if (err) return console.log('connection closed due to errors', err);
});

function generateChild(iterator, cost){
    let element = document.getElementById(`level${cost}${jsonOut[iterator]['Card Type']}Category`);
    let idName = `level${cost}${jsonOut[iterator]['Card Type']}Category`;
    let node;

    //generate node
    node = document.createElement("div");
    node.style.width = '98%';
    node.style.height = '35px';
    node.style.border = '1px solid white';
    node.style.margin = '5px auto';
    node.id = jsonOut[iterator].Name;
    node.innerHTML = jsonOut[iterator].Name;

    if (typeof(element) == 'undefined' || element == null){
        let cardCat = document.createElement("div");                  
        cardCat.id = idName;
        document.getElementById(`level${cost}Tooltip`).appendChild(cardCat);

        let cardType = document.createElement("div");
        cardType.style.width = '98%';
        cardType.style.border = '1px solid white';
        cardType.style.margin = '5px auto';
        cardType.innerHTML = jsonOut[iterator]['Card Type'];

        document.getElementById(idName).appendChild(cardType);
    }
    document.getElementById(idName).appendChild(node);

    createInnerNode(iterator, node.id);
}

function createInnerNode(innerIt, parentID){
    let innerNode;

    //generate node
    innerNode = document.createElement("div");
    innerNode.style.width = '400px';
    innerNode.style.height = '500px';
    innerNode.style.backgroundImage = `url(${jsonOut[innerIt].url})`;
    innerNode.style.backgroundSize = 'contain';
    innerNode.style.backgroundRepeat = 'no-repeat';
    innerNode.style.position = 'fixed';
    innerNode.style.left = '440px';
    innerNode.style.top = '0px';
    innerNode.style.visibility = 'hidden';
    innerNode.style.border = "5px solid black !important";
    innerNode.id = `${parentID}Img`;

    document.getElementById(parentID).setAttribute("onmouseover","makeVisible(this.id, 1)");
    document.getElementById(parentID).setAttribute("onmouseout","makeVisible(this.id, 0)");

    document.getElementById(parentID).appendChild(innerNode);
}

function makeVisible(id, vis){
    if(vis){
        document.getElementById(`${id}Img`).style.visibility = 'visible';
    } else {
        document.getElementById(`${id}Img`).style.visibility = 'hidden';
    }
    
}

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
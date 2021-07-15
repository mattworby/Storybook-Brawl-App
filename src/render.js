const request = require("requests");
const {ipcRenderer} = require('electron');
const fs = require('fs');

let url = "http://badguyty.com/images/sbb/sbb-cards.json";
let jsonOut;

//grab json data
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

//sort cards into categories
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
    node.style.display = 'none';

    if (typeof(element) == 'undefined' || element == null){
        let cardCat = document.createElement("div");                  
        cardCat.id = idName;
        document.getElementById(`level${cost}Tooltip`).appendChild(cardCat);

        let cardType = document.createElement("div");
        cardType.style.width = '98%';
        cardType.style.border = '1px solid white';
        cardType.style.margin = '5px auto';
        cardType.innerHTML = jsonOut[iterator]['Card Type'];
        cardType.id = `level${cost}${jsonOut[iterator]['Card Type']}`;
        cardType.setAttribute("onclick",`makeTypeVisible("${node.id}",this.id)`);

        document.getElementById(idName).appendChild(cardType);
    }
    
    document.getElementById(`level${cost}${jsonOut[iterator]['Card Type']}`).appendChild(node);

    createInnerNode(iterator, node.id);
}

//further breakdown
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

function makeTypeVisible(typeNodeId,parentId){
    const parent = document.getElementById(parentId).childNodes;

    for(let i = 0; i < parent.length; i++){
        if (parent[i].id != undefined){
            if (document.getElementById(parent[i].id).style.display == 'block'){
                document.getElementById(parent[i].id).style.display = 'none';
            } else {
                document.getElementById(parent[i].id).style.display = 'block';
            }
        }
    }
}

function changeWindow(id) {
    //ipcRenderer.send('resize-window');

    if (document.getElementById(`level${id}Tooltip`).style.visibility === 'visible'){
        for (let i = 2; i < 8; i++){
            if(i != id){
                document.getElementById(`${i}`).setAttribute("onclick","changeWindow(this.id)");
            }
        }

        document.getElementById(`level${id}Tooltip`).style.visibility = "hidden";
        document.getElementById(`level${id}Tooltip`).style.opacity = "1";
    } else if (document.getElementById(`level${id}Tooltip`).style.visibility === 'hidden' || document.getElementById(`level${id}Tooltip`).style.visibility === ''){
        for (let i = 2; i < 8; i++){
            if(i != id){
                document.getElementById(`${i}`).setAttribute("onclick","");
            }
        }

        document.getElementById(`level${id}Tooltip`).style.visibility = "visible";
        document.getElementById(`level${id}Tooltip`).style.opacity = "1";
    }
}

//read in files from
fs.readFile('./notes/Player.log', 'utf8', (err, data) =>{
    let playerArr;
    let players = [
        {"player": "2", "id": "", "hero": "", "cards":{"1":"","2":"","3":"","4":"","5":"","6":"","7":""}},
        {"player": "3", "id": "", "hero": "", "cards":{"1":"","2":"","3":"","4":"","5":"","6":"","7":""}},
        {"player": "4", "id": "", "hero": "", "cards":{"1":"","2":"","3":"","4":"","5":"","6":"","7":""}},
        {"player": "5", "id": "", "hero": "", "cards":{"1":"","2":"","3":"","4":"","5":"","6":"","7":""}},
        {"player": "6", "id": "", "hero": "", "cards":{"1":"","2":"","3":"","4":"","5":"","6":"","7":""}},
        {"player": "7", "id": "", "hero": "", "cards":{"1":"","2":"","3":"","4":"","5":"","6":"","7":""}},
        {"player": "8", "id": "", "hero": "", "cards":{"1":"","2":"","3":"","4":"","5":"","6":"","7":""}}
    ];
    
    if(err){
        console.log(err);
        return;
    }

    playerArr = data.split(/\r?\n/);

    for(let i = playerArr.length - 1; i >= 0; i--){
        if((playerArr[i].includes('---- NEW GAME STARTED --------'))){
            playerArr.splice(0,i);
            break;
        }
    }

    //generate other players
   for(let i = 0; i < playerArr.length; i++){
        if((playerArr[i].includes('ActionEnterBrawlPhase'))){
            let newPlayer = playerArr[i].slice(playerArr[i].indexOf('SecondPlayerId: ') + 'SecondPlayerId: '.length,playerArr[i].length).trim(); //get other player id

            for(let j = 0; j < players.length; j++){
                if(players[j].id === ""){ 
                    players[j].id = newPlayer;
                    break;
                }
            }
        } else if((playerArr[i].includes('ActionCreateCard'))){

            //if action create card not original player
            let preIndex = playerArr[i].indexOf('PlayerId: ');
            let searchIndex = preIndex + playerArr[i].substring(preIndex).indexOf('|');
            let insert = playerArr[i].slice(preIndex + 'PlayerId: '.length,searchIndex).trim();

            //loop through other players hero and creatures and set their current values to the creatures
            for(let j = 0; j < player.length; j++){
                if(insert === players[j].id){
                    //hero or creature sets
                    preIndex = playerArr[i].indexOf('DisplayName: ');
                    searchIndex = preIndex + playerArr[i].substring(preIndex).indexOf('|');
                    insert = playerArr[i].slice(preIndex + 'PlayerId: '.length,searchIndex).trim();

                    if(players[j].hero === ""){
                        //if hero
                        for(let k = 0; k < hero.length; k++){
                            if(insert === hero[i]){
                                players[j].hero = insert;
                            }
                        }
                    } else {
                        //else if creature
                        for(let k = 0; k < creature.length; k++){
                            if(insert === creature[i]){
                                players[j].card = insert;
                            }
                        }
                    }
                }
            }
        }
    }

});
const request = require("requests");
const {ipcRenderer} = require('electron');
const profile = process.env.USERPROFILE;
const fs = require('fs');

let url = "http://badguyty.com/images/sbb/sbb-cards.json";
let jsonOut;

let creature = [];
let hero = [];

//grab json data
request(url,true).on('data', function (chunk) {
    jsonOut = JSON.parse(chunk);

    for(let i = 0; i < jsonOut.length; i++){
        if (jsonOut[i]["Card Type"] === "Hero"){
            hero.push([jsonOut[i].Name, jsonOut[i].url]);
        } else if (jsonOut[i]["Card Type"] === "Character"){
            creature.push([jsonOut[i].Name, jsonOut[i].url]);
        }

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

//read in files from
function readFileIn(callback){
    let playerArr;
    let BreakException = {};
    let players = [
            {"player": "1", "id": "", "hero":{"name":"","img":""}, "cards":{"one":{"name":"","img":"","zone":"","slot":""},"two":{"name":"","img":"","zone":"","slot":""},"three":{"name":"","img":"","zone":"","slot":""},"four":{"name":"","img":"","zone":"","slot":""},"five":{"name":"","img":"","zone":"","slot":""},"six":{"name":"","img":"","zone":"","slot":""},"seven":{"name":"","img":"","zone":"","slot":""}}},
            {"player": "2", "id": "", "hero":{"name":"","img":""}, "cards":{"one":{"name":"","img":"","zone":"","slot":""},"two":{"name":"","img":"","zone":"","slot":""},"three":{"name":"","img":"","zone":"","slot":""},"four":{"name":"","img":"","zone":"","slot":""},"five":{"name":"","img":"","zone":"","slot":""},"six":{"name":"","img":"","zone":"","slot":""},"seven":{"name":"","img":"","zone":"","slot":""}}},
            {"player": "3", "id": "", "hero":{"name":"","img":""}, "cards":{"one":{"name":"","img":"","zone":"","slot":""},"two":{"name":"","img":"","zone":"","slot":""},"three":{"name":"","img":"","zone":"","slot":""},"four":{"name":"","img":"","zone":"","slot":""},"five":{"name":"","img":"","zone":"","slot":""},"six":{"name":"","img":"","zone":"","slot":""},"seven":{"name":"","img":"","zone":"","slot":""}}},
            {"player": "4", "id": "", "hero":{"name":"","img":""}, "cards":{"one":{"name":"","img":"","zone":"","slot":""},"two":{"name":"","img":"","zone":"","slot":""},"three":{"name":"","img":"","zone":"","slot":""},"four":{"name":"","img":"","zone":"","slot":""},"five":{"name":"","img":"","zone":"","slot":""},"six":{"name":"","img":"","zone":"","slot":""},"seven":{"name":"","img":"","zone":"","slot":""}}},
            {"player": "5", "id": "", "hero":{"name":"","img":""}, "cards":{"one":{"name":"","img":"","zone":"","slot":""},"two":{"name":"","img":"","zone":"","slot":""},"three":{"name":"","img":"","zone":"","slot":""},"four":{"name":"","img":"","zone":"","slot":""},"five":{"name":"","img":"","zone":"","slot":""},"six":{"name":"","img":"","zone":"","slot":""},"seven":{"name":"","img":"","zone":"","slot":""}}},
            {"player": "6", "id": "", "hero":{"name":"","img":""}, "cards":{"one":{"name":"","img":"","zone":"","slot":""},"two":{"name":"","img":"","zone":"","slot":""},"three":{"name":"","img":"","zone":"","slot":""},"four":{"name":"","img":"","zone":"","slot":""},"five":{"name":"","img":"","zone":"","slot":""},"six":{"name":"","img":"","zone":"","slot":""},"seven":{"name":"","img":"","zone":"","slot":""}}},
            {"player": "7", "id": "", "hero":{"name":"","img":""}, "cards":{"one":{"name":"","img":"","zone":"","slot":""},"two":{"name":"","img":"","zone":"","slot":""},"three":{"name":"","img":"","zone":"","slot":""},"four":{"name":"","img":"","zone":"","slot":""},"five":{"name":"","img":"","zone":"","slot":""},"six":{"name":"","img":"","zone":"","slot":""},"seven":{"name":"","img":"","zone":"","slot":""}}},
    ];

    fs.readFile(`${profile}\\AppData\\LocalLow\\Good Luck Games\\Storybook Brawl\\Player.log`, 'utf8', (err, data) =>{
        
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

                if (newPlayer.length < 36){
                    newPlayer = playerArr[i].slice(playerArr[i].indexOf('FirstPlayerId: ') + 'FirstPlayerId: '.length,playerArr[i].indexOf(' | SecondPlayerId: ')).trim(); //get other player id
                }
    
                for(let j = 0; j < players.length; j++){
                    if(players[j].id === ""){ 
                        players[j].id = newPlayer;
                        break;
                    }
                    if(players[j].id === newPlayer){
                        players[j].hero = {"name":"","img":""};
                        players[j].cards = {"one":{"name":"","img":"","zone":"","slot":""},"two":{"name":"","img":"","zone":"","slot":""},"three":{"name":"","img":"","zone":"","slot":""},"four":{"name":"","img":"","zone":"","slot":""},"five":{"name":"","img":"","zone":"","slot":""},"six":{"name":"","img":"","zone":"","slot":""},"seven":{"name":"","img":"","zone":"","slot":""}};
                        break;
                    }
                }
            } else if((playerArr[i].includes('ActionCreateCard'))){
    
                //if action create card not original player
                let preIndex = playerArr[i].indexOf('PlayerId: ');
                let searchIndex = preIndex + playerArr[i].substring(preIndex).indexOf('|');
                let insert = playerArr[i].slice(preIndex + 'PlayerId: '.length,searchIndex).trim();

                preIndex = playerArr[i].indexOf('Zone: ');
                searchIndex = preIndex + playerArr[i].substring(preIndex).indexOf('|');
                let zone = playerArr[i].slice(preIndex + 'Zone: '.length,searchIndex).trim();

                preIndex = playerArr[i].indexOf('Slot: ');
                searchIndex = preIndex + playerArr[i].substring(preIndex).indexOf('|');
                let slot = playerArr[i].slice(preIndex + 'Slot: '.length,searchIndex).trim();
    
                //loop through other players hero and creatures and set their current values to the creatures
                for(let j = 0; j < players.length; j++){
                    if(insert === players[j].id){
                        //hero or creature sets
                        preIndex = playerArr[i].indexOf('DisplayName: ');
                        searchIndex = preIndex + playerArr[i].substring(preIndex).indexOf('|');
                        insert = playerArr[i].slice(preIndex + 'DisplayName: '.length,searchIndex).trim();
    
                        if(players[j].hero.name == ""){
                            //if hero
                            for(let k = 0; k < hero.length; k++){
                                if(insert == hero[k][0]){
                                    players[j].hero.name = insert;
                                    players[j].hero.img = hero[k][1];
                                }
                            }
                        } else {
                            //else if creature
                            for(let k = 0; k < creature.length; k++){
                                if(insert === creature[k][0]){
                                    try{
                                        Object.keys(players[j].cards).forEach(function(key){
                                            if(players[j].cards[key].name === ""){
                                                if(zone === "Character"){
                                                    players[j].cards[key].name = insert;
                                                    players[j].cards[key].img = creature[k][1];
                                                    players[j].cards[key].zone = zone;
                                                    players[j].cards[key].slot = slot;
                                                    throw BreakException;
                                                }
                                            }
                                        });
                                    } catch (e){
                                        if (e !== BreakException) throw e;
                                    };
                                    
                                }
                            }
                        }
                    }
                }
            }
        }
    });
    return callback(players);
}

function changeWindow(id) {
    ipcRenderer.send('resize-window');

    if (document.getElementById(`level${id}Tooltip`).style.visibility === 'visible'){
        for (let i = 2; i < 8; i++){
            if(i != id){
                document.getElementById(`${i}`).setAttribute("onclick","changeWindow(this.id)");
            }
        }

        document.getElementById(`pBrawlButton`).setAttribute("onclick","changePBrawl()");

        document.getElementById(`level${id}Tooltip`).style.visibility = "hidden";
        document.getElementById(`level${id}Tooltip`).style.opacity = "1";
    } else if (document.getElementById(`level${id}Tooltip`).style.visibility === 'hidden' || document.getElementById(`level${id}Tooltip`).style.visibility === ''){
        for (let i = 2; i < 8; i++){
            if(i != id){
                document.getElementById(`${i}`).setAttribute("onclick","");
            }
        }

        document.getElementById(`pBrawlButton`).setAttribute("onclick","");

        document.getElementById(`level${id}Tooltip`).style.visibility = "visible";
        document.getElementById(`level${id}Tooltip`).style.opacity = "1";
    }
}

async function changePBrawl(){

    ipcRenderer.send('resize-window');

    if (document.getElementById(`pBrawlTooltip`).style.visibility === 'visible'){
        for (let i = 2; i < 8; i++){
            document.getElementById(`${i}`).setAttribute("onclick","changeWindow(this.id)");
        }

        document.getElementById(`pBrawlTooltip`).style.visibility = "hidden";
        document.getElementById(`pBrawlTooltip`).style.opacity = "1";
    } else if (document.getElementById(`pBrawlTooltip`).style.visibility === 'hidden' || document.getElementById(`pBrawlTooltip`).style.visibility === ''){
        let result;

        let promise = new Promise((resolve,reject) =>{
		    readFileIn(function(r){
			    setTimeout(() => resolve(r), 10);
		    });
	    });

        result = await promise;

        removeAllChildNodes(document.getElementById("pBrawlTooltip"));

        for(let i = 0; i < result.length; i++){
            if(result[i].hero.img != ""){
                generateBrawlDiv(i, result);
            }
        }
        
        
        
        for (let i = 2; i < 8; i++){
            document.getElementById(`${i}`).setAttribute("onclick","");
        }

        document.getElementById(`pBrawlTooltip`).style.visibility = "visible";
        document.getElementById(`pBrawlTooltip`).style.opacity = "1";
    }
}

function generateBrawlDiv(iterator,jsonData){
    let idName = `brawl${jsonData[iterator].player}`;
    let node;

    //generate node
    node = document.createElement("div");
    node.style.height = '100%';
    node.id = idName;
    
    document.getElementById(`pBrawlTooltip`).appendChild(node);

    document.getElementById(idName).style.backgroundImage = `url("${jsonData[iterator].hero.img}")`;
    document.getElementById(idName).style.flex = "auto";
    document.getElementById(idName).style.backgroundRepeat = "no-repeat";
    document.getElementById(idName).style.backgroundSize = "contain";

    document.getElementById(idName).setAttribute("onmouseover",`openBoard(${JSON.stringify(jsonData[iterator].cards)})`);
    document.getElementById(idName).setAttribute("onmouseout","closeBoard()");
}

function openBoard(cards){
    document.getElementById(`pBrawlPosition0`).style.backgroundImage = "";
    document.getElementById(`pBrawlPosition1`).style.backgroundImage = ""
    document.getElementById(`pBrawlPosition2`).style.backgroundImage = "";
    document.getElementById(`pBrawlPosition3`).style.backgroundImage = "";
    document.getElementById(`pBrawlPosition4`).style.backgroundImage = "";
    document.getElementById(`pBrawlPosition5`).style.backgroundImage = "";
    document.getElementById(`pBrawlPosition6`).style.backgroundImage = "";


    if(cards.one.slot !== "") document.getElementById(`pBrawlPosition${cards.one.slot}`).style.backgroundImage = `url(${cards.one.img})`;
    if(cards.two.slot !== "") document.getElementById(`pBrawlPosition${cards.two.slot}`).style.backgroundImage = `url(${cards.two.img})`;
    if(cards.three.slot !== "") document.getElementById(`pBrawlPosition${cards.three.slot}`).style.backgroundImage = `url(${cards.three.img})`;
    if(cards.four.slot !== "") document.getElementById(`pBrawlPosition${cards.four.slot}`).style.backgroundImage = `url(${cards.four.img})`;
    if(cards.five.slot !== "") document.getElementById(`pBrawlPosition${cards.five.slot}`).style.backgroundImage = `url(${cards.five.img})`;
    if(cards.six.slot !== "") document.getElementById(`pBrawlPosition${cards.six.slot}`).style.backgroundImage = `url(${cards.six.img})`;
    if(cards.seven.slot !== "") document.getElementById(`pBrawlPosition${cards.seven.slot}`).style.backgroundImage = `url(${cards.seven.img})`;

    document.getElementById("pBrawlBoard").style.visibility = "visible";
    document.getElementById("pBrawlBoard").style.opacity = "1";
}

function closeBoard(){
    document.getElementById("pBrawlBoard").style.visibility = "hidden";
    document.getElementById("pBrawlBoard").style.opacity = "0";
}

function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

function closeBrawl(){
    ipcRenderer.send('resize-window');

    for (let i = 2; i < 8; i++){
        document.getElementById(`${i}`).setAttribute("onclick","changeWindow(this.id)");
    }

    document.getElementById(`pBrawlTooltip`).style.visibility = "hidden";
    document.getElementById(`pBrawlTooltip`).style.opacity = "1";
}


var canvas = document.getElementById("canvas");
canvas.style = "border: 3px solid #000000;"
var ctx = canvas.getContext("2d");

const grid={
    nRows: 15,
    nCols: 15,
    cell:{
        width: 30,
        height: 30
    }
};
let gRows = grid.nRows, gCols = grid.nCols, gridLineWidth = 3;
let startNode = 112, finishNode = 8, closedNodes = [194,193,192,191,190,189,188,
    187,186,185,184,183,182,90,91,92,93,94,95,96,97,98,99,100,101,102,103,118,133,148,163]; //***Changeable
let cWidth = grid.cell.width, cHeight = grid.cell.height, 
cHalfWidth = cWidth/2, cHalfHeight = cHeight/2;
let nodesToEvaluate = [], EvaluatedNodes = [], shortestPathNodes = [];
let nodes = [];
for(let i = 1, cellNum = 0; i <= grid.nRows; i++){
    for(let j = 1; j <= grid.nCols; j++, cellNum++){  
        let thisNode = new node(checkWalkable(cellNum), checkSurroundingNodes(cellNum, false)
        , checkCoordinates(cellNum), gValue(cellNum), hValue(cellNum), fValue(cellNum));
        nodes.push(thisNode);
        
    }
}

drawGrid();
updateDrawing();
let i = startNode, distance = 0, path = [];
while(i != finishNode){
    let sNodes = checkSurroundingNodes(i,false);
    for(let j = 0; j < sNodes.length; j++){
        if(!closedNodes.includes(sNodes[j]) && !nodesToEvaluate.includes(sNodes[j]) && sNodes[j] !== startNode){
            nodesToEvaluate.push(sNodes[j]);
        }
    }
    let minF = getSurroundingMinFValue(i);
    path.push(minF);
    nodes[minF].setWalkable(false);
    updateSurroundingGValues(i);
    if(!EvaluatedNodes.includes(minF))
        EvaluatedNodes.push(minF);
    updateDrawing();
    i = minF;
    if(i === finishNode){
        console.log("~~~~~~Finished~~~~~~");
    }   
}
findShortestRoute();
updateDrawing();
// writeValue(); //If you need to check the G-values
// DrawPathLine(path); //If you need to check the path

//retraces the path from the finishNode to the startNode using the smallest G-values
function findShortestRoute(){
    let i = finishNode;
    while(i != startNode){
        let sNodes = checkSurroundingNodes(i, true), temp = [], temp1 = [];
        for(let j = 0; j < sNodes.length; j++){
            if(startNode === sNodes[j] || EvaluatedNodes.includes(sNodes[j])){
                temp.push(nodes[sNodes[j]].getGvalue());
                temp1.push(sNodes[j]);
            }
        }
        i = temp1[temp.indexOf(Math.min(...temp))];
        shortestPathNodes.push(i);
    }
}
function updateSurroundingGValues(i){
    let sNodes = checkSurroundingNodes(i,false);

    for(let j = 0; j < sNodes.length; j++){
        if(nodes[sNodes[j]].getGvalue() == null 
            || nodes[sNodes[j]].getGvalue() > nodes[i].getGvalue() + 10){
            if(checkCoordinates(i)[0] === checkCoordinates(sNodes[j])[0] 
                || checkCoordinates(i)[1] === checkCoordinates(sNodes[j])[1]){
                nodes[sNodes[j]].setGvalue(nodes[i].getGvalue() + 10);
            }
            else{
                nodes[sNodes[j]].setGvalue(nodes[i].getGvalue() + 14);
            }          
        }
        //update F value
        nodes[sNodes[j]].setFvalue(hValue(sNodes[j]) + nodes[sNodes[j]].getGvalue());
    }
}
//only used in the beggining; it isn't used in the loop
function gValue(i){
    if(i === startNode){
        return 0;
    }
    let sNodes = checkSurroundingNodes(i,false);
    for(let j = 0; j < sNodes.length; j++){
        if(sNodes[j] === startNode){
            if(checkCoordinates(i)[0] - checkCoordinates(startNode)[0] == 0 
                || checkCoordinates(i)[1] - checkCoordinates(startNode)[1] == 0){
                return 10;
            }
            else{
                return 14;
            }
        }
    }
        return null;
}
function fValue(i){
    return hValue(i) + gValue(i);
}
function hValue(i){
    if(cHeight === cWidth){
        return Math.round(pythagorean(checkCoordinates(i)[0] - checkCoordinates(finishNode)[0], 
    checkCoordinates(i)[1] - checkCoordinates(finishNode)[1])/(cHeight/10));
    }
}
function checkWalkable(i){
    if(closedNodes.includes(i)){return false;}
    return true;
}
//returns an array with the numbers of the nodes surrounding the i'th node. It excludes the startNode if the bool is false.
function checkSurroundingNodes(i, bool){
    let surroundingNodes = [];
    //left edge nodes
    if(i % gCols == 0){
        //if top left node
        if(i == 0){
            surroundingNodes.push(i+1, gCols, gCols+1);
        }
        //if bottom left node
        else if(i == (gCols*gRows) - gCols){
            surroundingNodes.push(i-gCols, i-gCols+1, i+1);
        }
        else{
            surroundingNodes.push(i-gCols, i-gCols+1, i+1, i+gCols, i+gCols+1);
        }
    }
    //right edge nodes
    else if(i % gCols == gCols-1){
        //if top right node
        if(i == gCols-1){
            surroundingNodes.push(i-1, i+gCols-1, i+gCols);
        }
        //if bottom right node
        else if(i == (gCols*gRows) - 1){
            surroundingNodes.push(i-gCols-1, i-gCols, i-1);
        }
        else{
            surroundingNodes.push(i-gCols-1, i-gCols, i-1, i+gCols-1, i+gCols);
        }
    }
    //top edge nodes excluding top left & right
    else if(i != 0 && i != gCols-1 && i < gCols){
        surroundingNodes.push(i-1, i+1, i+gCols-1, i+gCols, i+gCols+1);
    }
    //bottom edge nodes excluding bottom left & right
    else if(i != (gCols*gRows - gCols) && i != (gCols*gRows - 1) && i > (gCols*gRows - gCols)){
        surroundingNodes.push(i-gCols-1, i-gCols, i-gCols+1, i-1, i+1);
    }
    else{
        surroundingNodes.push(i-gCols-1, i-gCols, i-gCols+1, i-1, i+1, i+gCols-1, i+gCols, i+gCols+1);
    }
    let surroundingNodesWithoutClosed = [];
    if(bool === false){
        //remove the closed nodes and the start node
        for(let j = 0; j < surroundingNodes.length; j++){
            if(!closedNodes.includes(surroundingNodes[j]) && surroundingNodes[j] !== startNode){
                surroundingNodesWithoutClosed.push(surroundingNodes[j]);
            }
        }
        return surroundingNodesWithoutClosed;
    }
    else{
        //remove the closed nodes but keep the start node
        for(let j = 0; j < surroundingNodes.length; j++){
            if(!closedNodes.includes(surroundingNodes[j])){
                surroundingNodesWithoutClosed.push(surroundingNodes[j]);
            }
        }
        return surroundingNodesWithoutClosed;
    }
    
}
function checkCoordinates(i){
    let row = Math.floor(i/gCols), col = i%gCols;
    return [cHalfWidth + col*cWidth, cHalfHeight + row*cHeight];
}
function getSurroundingMinFValue(i){
    let sNodes = checkSurroundingNodes(i,false);
    let temp = [], tempIndex = [];
    //get only the surrounding Walkable/Green nodes
    for(let j = 0; j < sNodes.length; j++){
        if(!nodes[sNodes[j]].getWalkable() === false){
            temp.push((nodes[sNodes[j]].getFvalue()));
            tempIndex.push(sNodes[j]);
        }   
    }
    //check if there are multiple surrounding nodes with the F value equal to the minimum F value
    let repetition = 0, repeatedMinFValueNodes = [];
    for(let j = 0; j < temp.length; j++){
        if(temp[j] === Math.min(...temp)){
            repetition++;
            repeatedMinFValueNodes.push(tempIndex[j]);
        }  
    }
    //if the minimum F is repeated, get the minimum H  
    if(repetition > 1){
        let hValues = [];
        for(let j = 0; j < repeatedMinFValueNodes.length; j++){
            hValues.push((nodes[repeatedMinFValueNodes[j]].getHvalue()));
        }
        let minHIndex = hValues.indexOf(Math.min(...hValues));
        return repeatedMinFValueNodes[minHIndex];
    }
    let toReturn = tempIndex[temp.indexOf(Math.min(...temp))];
    //if the algorithm is stuck somewhere, return the node with the least F value(and H if needed)
    //but is neighbour to an Evaluated node (red node), and isn't a closed node.
    if(toReturn === undefined){
        console.log("used teleportation on node "+i +" after getting stuck");
        let availableNodes = [];
        for(let j = 0; j < EvaluatedNodes.length; j++){
            sNodes1 = checkSurroundingNodes(EvaluatedNodes[j],false);
            for(let k = 0; k < sNodes1.length; k++){
                if(!EvaluatedNodes.includes(sNodes1[k]) && !availableNodes.includes(sNodes1[k])){
                    availableNodes.push(sNodes1[k]);
                }
            }
        }
        let tempFvalues = [], tempFvaluesIndex = [], repeatedFvalue = 0, repeatedFvalueIndex = [];
        for(let j = 0; j < availableNodes.length; j++){
            let min
            tempFvalues.push(nodes[availableNodes[j]].getFvalue());
            tempFvaluesIndex.push(availableNodes[j]);
        }
        for(let j = 0; j < tempFvalues.length; j++){
            if(Math.min(...tempFvalues) === tempFvalues[j]){
                repeatedFvalue++;
                repeatedFvalueIndex.push(tempFvaluesIndex[j]);
            }
        }
        let tempHvalues = [], tempHvaluesIndex = [];
        if(repeatedFvalue > 1){
            for(let j = 0; j < repeatedFvalueIndex.length; j++){
                tempHvalues.push(nodes[repeatedFvalueIndex[j]].getHvalue());
                tempHvaluesIndex.push(repeatedFvalueIndex[j]);
            }
            return tempHvaluesIndex[tempHvalues.indexOf(Math.min(...tempHvalues))];
        }
        return tempFvaluesIndex[tempFvalues.indexOf(Math.min(...tempFvalues))];
    }
    return toReturn;
}
function updateDrawing(){
    for(let i = 0; i < nodes.length; i++){
        if(i == startNode || i == finishNode || shortestPathNodes.includes(i)){
            drawBlueNode(i);
        }
        else if(closedNodes.includes(i)){
            drawDimgreyNode(i);
        }
        else if(EvaluatedNodes.includes(i)){
            drawRedNode(i);
        }
        else if(nodesToEvaluate.includes(i)){
            drawGreenNode(i);
        }
    }
    
}
function pythagorean(side1, side2){
    return Math.sqrt(Math.pow(side1, 2) + Math.pow(side2, 2));
}
function drawGreenNode(nodeNum){
    let x = checkCoordinates(nodeNum)[0], y = checkCoordinates(nodeNum)[1];
    ctx.beginPath();
    ctx.strokeStyle = "green";
    ctx.lineWidth = 1.5;
    ctx.moveTo(x - cHalfWidth + gridLineWidth - 1, y - cHalfHeight + gridLineWidth);
    ctx.lineTo(x + cHalfWidth - gridLineWidth, y - cHalfHeight + gridLineWidth);
    ctx.lineTo(x + cHalfWidth - gridLineWidth, y + cHalfHeight - gridLineWidth);
    ctx.lineTo(x - cHalfWidth + gridLineWidth, y + cHalfHeight - gridLineWidth);
    ctx.lineTo(x - cHalfWidth + gridLineWidth, y - cHalfHeight + gridLineWidth);
    ctx.stroke();
    ctx.fillStyle = "green";
    ctx.fill();
}
function drawRedNode(nodeNum){
    let x = checkCoordinates(nodeNum)[0], y = checkCoordinates(nodeNum)[1];
    ctx.beginPath();
    ctx.strokeStyle = "red";
    ctx.lineWidth = 1.5;
    ctx.moveTo(x - cHalfWidth + gridLineWidth - 1, y - cHalfHeight + gridLineWidth);
    ctx.lineTo(x + cHalfWidth - gridLineWidth, y - cHalfHeight + gridLineWidth);
    ctx.lineTo(x + cHalfWidth - gridLineWidth, y + cHalfHeight - gridLineWidth);
    ctx.lineTo(x - cHalfWidth + gridLineWidth, y + cHalfHeight - gridLineWidth);
    ctx.lineTo(x - cHalfWidth + gridLineWidth, y - cHalfHeight + gridLineWidth);
    ctx.stroke();
    ctx.fillStyle = "red";
    ctx.fill();
}
function drawBlueNode(nodeNum){
    let x = checkCoordinates(nodeNum)[0], y = checkCoordinates(nodeNum)[1];
    ctx.beginPath();
    ctx.strokeStyle = "lightblue";
    ctx.lineWidth = 1.5;
    ctx.moveTo(x - cHalfWidth + gridLineWidth - 1, y - cHalfHeight + gridLineWidth);
    ctx.lineTo(x + cHalfWidth - gridLineWidth, y - cHalfHeight + gridLineWidth);
    ctx.lineTo(x + cHalfWidth - gridLineWidth, y + cHalfHeight - gridLineWidth);
    ctx.lineTo(x - cHalfWidth + gridLineWidth, y + cHalfHeight - gridLineWidth);
    ctx.lineTo(x - cHalfWidth + gridLineWidth, y - cHalfHeight + gridLineWidth);
    ctx.stroke();
    ctx.fillStyle = "lightblue";
    ctx.fill();
}
function drawDimgreyNode(nodeNum){
    let x = checkCoordinates(nodeNum)[0], y = checkCoordinates(nodeNum)[1];
    ctx.beginPath();
    ctx.strokeStyle = "dimgray";
    ctx.lineWidth = 1.5;
    ctx.moveTo(x - cHalfWidth + gridLineWidth - 1, y - cHalfHeight + gridLineWidth);
    ctx.lineTo(x + cHalfWidth - gridLineWidth, y - cHalfHeight + gridLineWidth);
    ctx.lineTo(x + cHalfWidth - gridLineWidth, y + cHalfHeight - gridLineWidth);
    ctx.lineTo(x - cHalfWidth + gridLineWidth, y + cHalfHeight - gridLineWidth);
    ctx.lineTo(x - cHalfWidth + gridLineWidth, y - cHalfHeight + gridLineWidth);
    ctx.stroke();
    ctx.fillStyle = "dimgray";
    ctx.fill();
}
function drawGrid() {
    canvas.width = grid.nCols * grid.cell.width;
    canvas.height = grid.nRows * grid.cell.height;
    let cHeight = grid.cell.height;
    let cWidth = grid.cell.width;

    ctx.beginPath();
    ctx.strokeStyle = 'lightgray';
    ctx.lineWidth = gridLineWidth;
    for (let iRows = 0; iRows <= grid.nRows; iRows++) {
        let y = iRows*cHeight;
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
         ctx.stroke();
    }
    for (let iCols = 0; iCols <= grid.nCols; iCols++) {
        let x = iCols*cWidth;
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }
}
//If you need to check a value (change to F, H, or the node numbers if needed)
function writeValue(){
    for(let i = 0; i < nodes.length; i++){
        let x = nodes[i].getCoordinates()[0];
        let y = nodes[i].getCoordinates()[1];
        ctx.font = "bold 14px Arial";
        ctx.fillStyle = "black";
        ctx.textAlign = "center";
        ctx.fillText(nodes[i].getGvalue(), x, y);
    }
}
//If you need to check the path
function DrawPathLine(path){
    ctx.beginPath();
    ctx.strokeStyle = "blue";
    ctx.lineWidth = 3;
    ctx.moveTo(nodes[startNode].getCoordinates()[0], nodes[startNode].getCoordinates()[1]);
    ctx.lineTo(nodes[path[0]].getCoordinates()[0],nodes[path[0]].getCoordinates()[1]);
    ctx.stroke();
    for(let j = 1; j < path.length; j++){
        ctx.moveTo(nodes[path[j-1]].getCoordinates()[0],nodes[path[j-1]].getCoordinates()[1]);
        ctx.lineTo(nodes[path[j]].getCoordinates()[0],nodes[path[j]].getCoordinates()[1]);
        ctx.stroke();
    }
}

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
let startNode = 113, finishNode = 8, closedNodes = [194,193,192,191,190,189,188,
    187,186,185,184,183,182,90,91,92,93,94,95,96,97,98,99,100,101,102,103,118,133,148,163]; //***Changeable
let cWidth = grid.cell.width, cHeight = grid.cell.height, 
cHalfWidth = cWidth/2, cHalfHeight = cHeight/2;
let nodesToEvaluate = [], EvaluatedNodes = [], shortestPathNodes = [];
let nodes = [];
for(let i = 1, cellNum = 0; i <= grid.nRows; i++){
    for(let j = 1; j <= grid.nCols; j++, cellNum++){  
        let thisNode = new node(checkSurroundingNodes(cellNum, false)
        , checkCoordinates(cellNum), gValue(cellNum), hValue(cellNum), fValue(cellNum));
        nodes.push(thisNode);
    }
}

drawGrid();
updateDrawing();
let i = startNode, distance = 0, path = [];
let hmm = 0;
while(i !== finishNode){
    let minFList = [], minFListFValues = [], minF;
    let sNodes = checkSurroundingNodes(i, false);
    //set the nodes neighbouring the i'th node to nodesToEvaluate if appropriate
    for(let k = 0; k < sNodes.length; k++){
        if(!nodesToEvaluate.includes(sNodes[k]) && !closedNodes.includes(sNodes[k]) && !EvaluatedNodes.includes(sNodes[k])){
            nodesToEvaluate.push(sNodes[k]);
        }
    }
    //getting the F-values of the nodes from nodesToEvaluate
    let fValues = [], fValuesIndex = [], nodesToEvaluateLength = nodesToEvaluate.length;
    for(let j = 0; j < nodesToEvaluateLength; j++){
        fValues.push(nodes[nodesToEvaluate[j]].getFvalue());
        fValuesIndex.push(nodesToEvaluate[j]);
    }
    //checking if the minimum F-value is repeated
    let tempMinF = Math.min(...fValues), repeatedMinF = 0, repeatedMinFIndex = [];
    for(let k = 0; k < fValues.length; k++){
        if(fValues[k] === tempMinF){
            repeatedMinF++;
            repeatedMinFIndex.push(fValuesIndex[fValues.indexOf(fValues[k])]);
        }
    }
    //if the minimum F-value is repeated, compare the nodes and get the node that has the minimum H-value 
    let tempMinH = [], tempMinHIndex = [];
    if(repeatedMinF > 1){
        for(let j = 0; j < repeatedMinFIndex.length; j++){
            tempMinH.push(nodes[repeatedMinFIndex[j]].getHvalue());
            tempMinHIndex.push(repeatedMinFIndex[j]);
        }
        minF = tempMinHIndex[tempMinH.indexOf(Math.min(...tempMinH))];
    }
    //If the minimum F-value isn't repeated, just take the node.
    minF = fValuesIndex[fValues.indexOf(tempMinF)];
    updateSurroundingGValues(i);
    i = minF;
    nodesToEvaluate.splice(nodesToEvaluate.indexOf(i), 1);  
    EvaluatedNodes.push(minF);
}

findShortestRoute();
updateDrawing();
// writeValue(); //If you need to check any of the values
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
//returns an array with the numbers of the nodes surrounding the i'th node
//It excludes the startNode if the bool is false.
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
//If you need to check a value 
function writeValue(){
    for(let i = 0; i < nodes.length; i++){
        let x = nodes[i].getCoordinates()[0];
        let y = nodes[i].getCoordinates()[1];
        ctx.font = "bold 14px Arial";
        ctx.fillStyle = "black";
        ctx.textAlign = "center";
        //change to G or H if needed
        ctx.fillText(nodes[i].getFvalue(), x, y);
        // ctx.fillText(i, x, y);
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

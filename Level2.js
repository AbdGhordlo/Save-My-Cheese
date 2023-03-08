var canvas = document.getElementById("canvas");
canvas.style = "border: 3px solid #000000;"
var ctx = canvas.getContext("2d");
const cheeseImg = new Image(), mouseImg = new Image();;
cheeseImg.src = "Cheese.png", mouseImg.src = "Mouse.png";

const grid={
    nRows: 40,
    nCols: 40,
    lineWidth: 3,
    cell:{
        width: 15,
        height: 15
    }
};

let gRows = grid.nRows, gCols = grid.nCols; //Number of columns & Rows
let gWidth = grid.cell.width * grid.nCols, gHeight = grid.cell.height * grid.nRows; //Grid's width & Height
let cWidth = grid.cell.width, cHeight = grid.cell.height, cHalfWidth = cWidth/2, cHalfHeight = cHeight/2; //Cell's width, height, half-width, half-height
let nodes = [], shortestPathNodes = [], closedNodes = [], nodesToEvaluate = [], EvaluatedNodes = [];
canvas.width = gCols * cWidth;
canvas.height = gRows * cHeight;

//For choosing the nodes where the cheese and the mouse are located.
let mouseStartNode = 1599, cheeseNode = Math.abs(1558/2);

//The following variables will be used in the animation of the mouse.   
let shortestPathLen = 0, nextX = 0, nextY = 0;
let animationID;
let addendX, addendY, rotation;
let cHeightThird = cHeight/3, cWidthThird = cWidth/3;
let shiftValX, shiftValY;
let direcOfAddendX, diredOfAddendY;
let mouseIsDown = false;
let previous_shortPathNodes = [];


//To choose the range of pixels around the snap locations where if the mouse is up and the shape that's being dragged is within the range of the its snap location, the shape will snap.
let snapRangeX = 10, snapRangeY = 5;

//The nodes are initialised 
for(let i = 1, nodeNum = 0; i <= grid.nRows; i++){
    for(let j = 1; j <= grid.nCols; j++, nodeNum++){  
        let thisNode = new node(nodeNum, checkSurroundingNodes(nodeNum, false)
            , checkCoordinates(nodeNum), gValue(nodeNum), hValue(nodeNum), fValue(nodeNum));
        nodes.push(thisNode);
    }
}

let nodesLength = nodes.length;
class Mouse{
    constructor(mouseStartNode, speed){
        this.nodeNum = mouseStartNode;
        this.speed = speed;
        this.width = 2* cWidth;
        this.height = 2* cHeight;
        this.x = nodes[mouseStartNode].getCoordinates()[0];
        this.y = nodes[mouseStartNode].getCoordinates()[1];
    }
    draw(){
        //The /3 was added so the photo of the mouse is closer to the center of the node
        ctx.drawImage(mouseImg, this.x - this.width/2, this.y - this.height/3, this.width, this.height);
    }
}

class Cheese{
    constructor(nodeNum){
        this.nodeNum = nodeNum;
        this.x = nodes[nodeNum].getCoordinates()[0];
        this.y = nodes[nodeNum].getCoordinates()[1];
        this.width = 2* cWidth;
        this.height = 2* cHeight;
    }
    draw(){
        ctx.drawImage(cheeseImg, this.x - this.width/2, this.y - this.height/2, this.width, this.height);
    }
}

//----------------------------------------------The puzzle pieces (Different for each level) ----------------------------------------------
let numOfShapes = 8;
let numOfShapeBeingDragged = -1;
let shapes_Stroke_Style = 'black';
let shapes_Line_Width = 3;
let shapes_fillStyle = 'blue';
let cheese_Location = nodes[cheeseNode].getCoordinates(); //To set the shapes snap location relative to the cheese

const shape1 = {
    snapped: false,
    shape_Coordinates: [0, 0],
    snap_Coordinates: [cheese_Location[0], cheese_Location[1] - (6 * cHeight)],
    numOfVertices: 13,
    vertices: [[-35, -30],[0, -35],[35, -30],[35, -15],[25, -15],[25, 15],[35, 15],[35, 30],[-35,  30],[-35, 15]
        ,[-25, 15],[-25, -15],[-35, -15]],
    vertices_Coor: []
};
const shape2 = {
    snapped: false,
    shape_Coordinates: [0, 0],
    snap_Coordinates: [cheese_Location[0], cheese_Location[1] + (6 * cHeight)],
    numOfVertices: 13,
    vertices: [[-35, -30],[35, -30],[35, -15],[25, -15],[25, 15],[35, 15],[35, 30],[0, 35],[-35,  30],[-35, 15]
        ,[-25, 15],[-25, -15],[-35, -15]],
    vertices_Coor: []
};
const shape3 ={
    snapped: false,
    shape_Coordinates: [0, 0],
    snap_Coordinates: [cheese_Location[0] + (6 * cWidth), cheese_Location[1]],
    numOfVertices: 13,
    vertices: [[-30, -35],[-15, -35],[-15, -25],[15, -25],[15, -35],[30, -35],[35,0],[30, 35],[15, 35],[15, 25]
        ,[-15, 25],[-15, 35],[-30, 35]],
    vertices_Coor: []
};
const shape4 ={
    snapped: false,
    shape_Coordinates: [0, 0],
    snap_Coordinates: [cheese_Location[0] - (6 * cWidth), cheese_Location[1]],
    numOfVertices: 13,
    vertices: [[-30, -35],[-15, -35],[-15, -25],[15, -25],[15, -35],[30, -35],[30, 35],[15, 35],[15, 25]
        ,[-15, 25],[-15, 35],[-30, 35],[-35,0]],
    vertices_Coor: []
};
const shape5 = {
    snapped: false,
    shape_Coordinates: [0, 0],
    snap_Coordinates: [cheese_Location[0] + (6 * cWidth) -15, cheese_Location[1] - (6 * cHeight) + 15],
    shape_Coordinates: [0, 0],
    numOfVertices: 6,
    vertices: [[-50, -30],[30, -30],[30, 50],[0, 50],[0, 0],[-50, 0]],
    vertices_Coor: []
};
const shape6 ={
    snapped: false,
    shape_Coordinates: [0, 0],
    snap_Coordinates: [cheese_Location[0] + (6 * cWidth) - 15, cheese_Location[1] + (6 * cHeight) - 15],
    numOfVertices: 6,
    vertices: [[0, -50],[30, -50],[30, 30],[-50, 30],[-50, 0],[0, 0]],
    vertices_Coor: []
};
const shape7 ={
    snapped: false,
    shape_Coordinates: [0, 0],
    snap_Coordinates: [cheese_Location[0] - (6 * cWidth) + 15, cheese_Location[1] + (6 * cHeight) - 15],
    numOfVertices: 6,
    vertices: [[-30, -50],[0, -50],[0, 0],[50, 0],[50, 30],[-30, 30]],
    vertices_Coor: []
};
const shape8 ={
    snapped: false,
    shape_Coordinates: [0, 0],
    snap_Coordinates: [cheese_Location[0] - (6 * cWidth) + 15, cheese_Location[1] - (6 * cHeight) + 15],
    numOfVertices: 6,
    vertices: [[-30, -30],[50, -30],[50, 0],[0, 0],[0, 50],[-30, 50]],
    vertices_Coor: []
};

let shapes = [shape1, shape2, shape3, shape4, shape5, shape6, shape7, shape8];

//Setting the starting locations of the shapes
for(let k = 0, x = 0.5, y = 1, HalfNumOfShapes_Ceiling = Math.ceil(numOfShapes/2); k < numOfShapes; k++){
    shapes[k].shape_Coordinates = [gWidth*(x++/HalfNumOfShapes_Ceiling), gHeight*(y/10)];
    if(k+1 == HalfNumOfShapes_Ceiling){
        y += 1.5;
        x = 0.5;
    } 
}
for(let k = 0; k < numOfShapes; k++)
    update_Vertices_Coordinates(k);

//-----------------------------------------------------------------------------------------------------------------------
const cheese1 = new Cheese(cheeseNode);
const mouse1 = new Mouse(mouseStartNode, 1);
cheeseImg.onload=function(){
    cheese1.draw();
};
mouseImg.onload=function(){
    mouse1.draw();
};

updateDrawing();
checkClosedNodes();
findPath(cheese1);

// i is used to iterate through the shortest path nodes in the animation part.
let i = 0;
traversalAnimationSpecifics(i);
animate();

canvas.addEventListener("mousedown", mouseDown);
canvas.addEventListener("mouseup", mouseUp);
canvas.addEventListener("mousemove", mouseMove);

//-------------------------------------------------------Functions-------------------------------------------------------

function mouseDown(e){
    mouseIsDown = true;
}   

function mouseMove(e){
    if(mouseIsDown == true){
        let rect = canvas.getBoundingClientRect();
        let mouseLocationX = e.x - rect.x, mouseLocationY = e.y - rect.y;
        let point = [mouseLocationX, mouseLocationY];

        //If a shape isn't already being dragged, then check if the mouse is inside a shape
        if(numOfShapeBeingDragged == -1){
            numOfShapeBeingDragged = insideWhichPolygon(point);}

        if(numOfShapeBeingDragged !== -1){
            updateShapeCoordinates(numOfShapeBeingDragged, point);
            updateDrawing();
        }
    }
}

function mouseUp(e){
    mouseIsDown = false;
    if(numOfShapeBeingDragged !== -1 && snap(numOfShapeBeingDragged)){
        cancelAnimationFrame(animationID);
        if(check_if_all_shapes_snapped()){
            alert("You win!");
            return; 
        }
        //In case we need to retrace our steps (added because of a bug encountered when a shape snaps on the mouse's node)
        previous_shortPathNodes = shortestPathNodes;
        //remember i iterates through the shortest path nodes during the animation, and because the animation was canceled, i is reset.
        i = 0;
        //If a shape snapped, we might need a new path. To get a new path, the old values are discarded or updated.
        nodesToEvaluate = [], EvaluatedNodes = [], shortestPathNodes = [], mouseStartNode = mouse1.nodeNum;
        updateFGvalues();
        checkClosedNodes();

        findPath(cheese1);
        animate();
    }
    updateDrawing();
    numOfShapeBeingDragged = -1;
}

function animate(){

    //If mouse reached the end
        //***It's (-2) because the mouse should stop not on the cheese, but on the node beside it.
    if(mouse1.x === nodes[shortestPathNodes[shortestPathLen-2]].getCoordinates()[0] 
        && mouse1.y === nodes[shortestPathNodes[shortestPathLen-2]].getCoordinates()[1]){
            cancelAnimationFrame(animationID);
            alert("You Lose");
            return;
    }
    if(nextX == 0 && nextY == 0){
        nextX = nodes[shortestPathNodes[0]].getCoordinates()[0];
        nextY = nodes[shortestPathNodes[0]].getCoordinates()[1];
    }
    if(mouse1.x === nextX && mouse1.y === nextY)
        traversalAnimationSpecifics(++i);

    mouse1.nodeNum = shortestPathNodes[i];
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    updateDrawing(false);
    ctx.save();
    ctx.translate(mouse1.x, mouse1.y);
    ctx.rotate(rotation);
    ctx.drawImage(mouseImg, direcOfAddendX, diredOfAddendY, mouse1.width, mouse1.height);
    ctx.restore();

    mouse1.x += addendX;
    mouse1.y += addendY;
    animationID = requestAnimationFrame(animate);
}

function traversalAnimationSpecifics(i){
    mouse1.x = nodes[shortestPathNodes[i]].getCoordinates()[0], mouse1.y = nodes[shortestPathNodes[i]].getCoordinates()[1];
    nextX = nodes[shortestPathNodes[i+1]].getCoordinates()[0], nextY = nodes[shortestPathNodes[i+1]].getCoordinates()[1];

    //South (Remember the origin is on the top left and y increases downward)
    if(mouse1.x === nextX && mouse1.y < nextY){
        addendX = 0, addendY = mouse1.speed;
        rotation = (Math.PI / 2);
        direcOfAddendX = -(cWidthThird);
        diredOfAddendY = -(cHeightThird);
    }

    //South-east    
    else if(mouse1.x < nextX && mouse1.y < nextY){
        addendX = mouse1.speed, addendY = mouse1.speed;
        rotation = (Math.PI / 4);
        direcOfAddendX = 0;
        diredOfAddendY = -(cHeightThird);
    }  
        
    //East
    else if(mouse1.x < nextX && mouse1.y === nextY){
        addendX = mouse1.speed, addendY = 0;
        rotation = 0;
        direcOfAddendX = -(cWidthThird);
        diredOfAddendY = -(cHeightThird);
    }    
    
    //North-east
    else if(mouse1.x < nextX && mouse1.y > nextY){
        addendX = mouse1.speed, addendY = -mouse1.speed;
        rotation = (7 * Math.PI / 4);
        direcOfAddendX = 0;
        diredOfAddendY = -(cHeightThird);
    } 
        
    //North
    else if(mouse1.x === nextX && mouse1.y > nextY){
        addendX = 0, addendY = -mouse1.speed;
        rotation = (3 * Math.PI / 2);
        direcOfAddendX = -(cWidthThird);
        diredOfAddendY = -(cHeightThird);
    }  

    //North-west
    else if(mouse1.x > nextX && mouse1.y > nextY){
        addendX = -mouse1.speed, addendY = -mouse1.speed;
        rotation = (5 * Math.PI / 4);
        direcOfAddendX = 0;
        diredOfAddendY = -(cHeightThird);
    }    

    //West
    else if(mouse1.x > nextX && mouse1.y === nextY){
        addendX = -mouse1.speed, addendY = 0;
        rotation = (Math.PI);
        direcOfAddendX = -(cWidthThird);
        diredOfAddendY = -(cHeightThird);
    }

    //South-west    
    else if(mouse1.x > nextX && mouse1.y < nextY){
        addendX = -mouse1.speed, addendY = mouse1.speed;
        rotation = (3 * Math.PI / 4);
        direcOfAddendX = 0;
        diredOfAddendY = -(cHeightThird);
    }

    shiftValX = mouse1.x;
    shiftValY = mouse1.y;
}

function findPath(cheese){
    let i = mouse1.nodeNum;

    //If the shape snapped on the mouse's current node and the mouse is completely surrounded by closed nodes, it will retrace its
    //  steps using the previous path it was walking on until it finds a node that isn't completely surrounded by closed nodes.
    while(surroundedByClosedNodes(i)){
        i = previous_shortPathNodes[previous_shortPathNodes.indexOf(i) -1];
    }
    mouse1.nodeNum = mouseStartNode = i;
    updateFGvalues();

    while(i !== cheese.nodeNum){
        let sNodes = nodes[i].getSurroundingNodes();
        let currNodeNum = i;
        //set the nodes neighbouring the i'th node to nodesToEvaluate if appropriate
        for(let k = 0; k < sNodes.length; k++){
            if(!nodesToEvaluate.includes(sNodes[k]) && !closedNodes.includes(sNodes[k]) && !EvaluatedNodes.includes(sNodes[k]))
                nodesToEvaluate.push(sNodes[k]);
        }
        updateSurroundingValues(i);
    
        //getting the F-values of the nodes from nodesToEvaluate
        let fValues = [], fValuesIndex = [], nodesToEvLength = nodesToEvaluate.length;
        for(let j = 0; j < nodesToEvLength; j++){
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
        let hValues = [], hValuesIndex = [];
        if(repeatedMinF > 1){
            for(let j = 0; j < repeatedMinFIndex.length; j++){
                hValues.push(nodes[repeatedMinFIndex[j]].getHvalue());
                hValuesIndex.push(repeatedMinFIndex[j]);
            }
            currNodeNum = hValuesIndex[hValues.indexOf(Math.min(...hValues))];
        }
        
        //If the minimum F-value isn't repeated, just take the node.
        else
            currNodeNum = fValuesIndex[fValues.indexOf(tempMinF)];
            
        i = currNodeNum;
        nodesToEvaluate.splice(nodesToEvaluate.indexOf(i), 1);  
        EvaluatedNodes.push(currNodeNum);
    }
    findShortestRoute();
}

//retraces the path from the finishNode to the mouseStartNode using the smallest G-values
function findShortestRoute(){
    let i = cheese1.nodeNum;
    let tempShortestPath = [];
    tempShortestPath.push(i);
    while(i != mouse1.nodeNum){
        let sNodes = checkSurroundingNodes(i, true), surroundingGvals = [], surroundingGvalsIndex = [];
        //first, the G values surrounding the current node will be added to an array.
        for(let j = 0; j < sNodes.length; j++){
            if((mouse1.nodeNum === sNodes[j] || EvaluatedNodes.includes(sNodes[j]))){
                surroundingGvals.push(nodes[sNodes[j]].getGvalue());
                surroundingGvalsIndex.push(sNodes[j]);
            }
        }
        //Using the "surroundingGvals" array, we take the node with the minimum G value as our next step and add it to the shortest path nodes. 
        i = surroundingGvalsIndex[surroundingGvals.indexOf(Math.min(...surroundingGvals))];
        nodes[i].gValue *= 2;
        if(!tempShortestPath.includes(i))
            tempShortestPath.push(i);
    }

    //In the following part, the nodes will be replaced so that the nodes in the shortest path are in a start to finish order rather than finish to start.
    //This is done because the mouse will traverse from start to finish, with finish being the location of the cheese.
    for(let j = 0, k = tempShortestPath.length-1; j < tempShortestPath.length; j++, k--){
        shortestPathNodes[j] = tempShortestPath[k];}
    
    //Updating the length of the shortest path
    shortestPathLen = shortestPathNodes.length;
}

function updateDrawing(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid();
    drawSnapLocations();
    cheese1.draw();
    
    for(let k = 0; k < numOfShapes; k++)
        drawShape(k);
}

//This function updates the surrounding nodes's G & F values if their G-values were null, or the current node's G-value gives them a smaller total G-value.
function updateSurroundingValues(i){
    let sNodes = nodes[i].getSurroundingNodes();

    for(let j = 0; j < sNodes.length; j++){
        if(nodes[sNodes[j]].getGvalue() == null || nodes[sNodes[j]].getGvalue() > nodes[i].getGvalue() + 10){
            if(checkCoordinates(i)[0] === checkCoordinates(sNodes[j])[0] || checkCoordinates(i)[1] === checkCoordinates(sNodes[j])[1])
                nodes[sNodes[j]].setGvalue(nodes[i].getGvalue() + 10);
            
            else
                nodes[sNodes[j]].setGvalue(nodes[i].getGvalue() + 14);
            
            //update the F value if the G value is updated
            nodes[sNodes[j]].setFvalue(hValue(sNodes[j]) + nodes[sNodes[j]].getGvalue());         
        }    
    }
}

//returns an array with the numbers of the nodes surrounding the i'th node. It excludes the startNode if the bool is false.
function checkSurroundingNodes(i, bool){
    //First, we push the numbers of the node surrounding the i'th node into the array "surroundingNodes" 
    let surroundingNodes = [];

    //left edge nodes
    if(i % gCols == 0){
        //if top left node
        if(i == 0)
            surroundingNodes.push(i+1, gCols, gCols+1);
        
        //if bottom left node
        else if(i == (gCols*gRows) - gCols)
            surroundingNodes.push(i-gCols, i-gCols+1, i+1);
        
        else
            surroundingNodes.push(i-gCols, i-gCols+1, i+1, i+gCols, i+gCols+1);
        
    }
    //right edge nodes
    else if(i % gCols == gCols-1){
        //if top right node
        if(i == gCols-1)
            surroundingNodes.push(i-1, i+gCols-1, i+gCols);

        //if bottom right node
        else if(i == (gCols*gRows) - 1)
            surroundingNodes.push(i-gCols-1, i-gCols, i-1);
        
        else
            surroundingNodes.push(i-gCols-1, i-gCols, i-1, i+gCols-1, i+gCols);
        
    }
    //top edge nodes excluding top left & right
    else if(i < gCols)
        surroundingNodes.push(i-1, i+1, i+gCols-1, i+gCols, i+gCols+1);

    //bottom edge nodes excluding bottom left & right
    else if(i > (gCols*(gRows-1)))
        surroundingNodes.push(i-gCols-1, i-gCols, i-gCols+1, i-1, i+1);

    //else the node has to surrounded by nodes from all directions
    else
        surroundingNodes.push(i-gCols-1, i-gCols, i-gCols+1, i-1, i+1, i+gCols-1, i+gCols, i+gCols+1);
    
    //After getting the numbers of the surrounding nodes, we copy those numbers into a new array but with the closed nodes excluded.    
    let surroundingNodesWithoutClosed = [];

    for(let j = 0; j < surroundingNodes.length; j++){
        //if the bool is true, don't remove the start node
        if(surroundingNodes[j] === mouseStartNode && bool === true)
            surroundingNodesWithoutClosed.push(surroundingNodes[j]);
        
        else if(!closedNodes.includes(surroundingNodes[j]) && surroundingNodes[j] !== mouseStartNode)
            surroundingNodesWithoutClosed.push(surroundingNodes[j]);
    }
    return surroundingNodesWithoutClosed;
}

function inPolygon(point, vertices){
    var verLength = vertices.length;
    var x = point[0], y = point[1];
    var inside = false;
    for(var i = 0, j = verLength - 1; i < verLength; j = i++){
        var xi = vertices[i][0], yi = vertices[i][1];
        var xj = vertices[j][0], yj = vertices[j][1];
        
        var intersect = ((yi > y) != (yj > y))
            &&(x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }
    return inside;
}

function insideWhichPolygon(point){
    let k;
    for(k = 0; k < numOfShapes; k++){
        if(inPolygon(point, shapes[k].vertices_Coor)){
            numOfShapeBeingDragged = k;
            break; //in case of "point inside multiple shapes", the shape with the smaller number will be dragged.
        }
    }

    /*If a shape is being dragged, update the difference between the shape's coordinate and the point (user's mouse coordinate)
        This is done to maintain that difference when dragging the shape. For Example, if you drag the shape from one of its sides,
        you'll keep dragging it from the same side when it's moving.*/
    if(numOfShapeBeingDragged !== -1){
        point_Shape_DiffX = shapes[k].shape_Coordinates[0] - point[0];
        point_Shape_DiffY = shapes[k].shape_Coordinates[1] - point[1];
    }
    return numOfShapeBeingDragged;
}

function updateShapeCoordinates(shapeNum, point){
    shapes[shapeNum].shape_Coordinates = [point[0] + point_Shape_DiffX, point[1] + point_Shape_DiffY];
}

function update_Vertices_Coordinates(shapeNum){
    num_Vertices = shapes[shapeNum].numOfVertices;
    let x = shapes[shapeNum].shape_Coordinates[0], y = shapes[shapeNum].shape_Coordinates[1];
    shapes[shapeNum].vertices_Coor = [];
    for(let k = 0; k < num_Vertices; k++){
        shapes[shapeNum].vertices_Coor.push([x + shapes[shapeNum].vertices[k][0], y + shapes[shapeNum].vertices[k][1]]);
    }
}

function checkClosedNodes(){
    for(let j = 0; j < nodesLength; j++){
        let X = nodes[j].getCoordinates()[0];
        let Y = nodes[j].getCoordinates()[1];
        let UpperLeftPoint = [X-cHalfWidth, Y-cHalfHeight];
        let UpperRightPoint = [X+cHalfWidth, Y-cHalfHeight];
        let BottomLeftPoint = [X-cHalfWidth, Y+cHalfHeight];
        let BottomRightPoint = [X+cHalfWidth, Y+cHalfHeight];
        //The four corners of a node
        let points = [UpperLeftPoint, UpperRightPoint, BottomLeftPoint, BottomRightPoint];

        for(let p = 0; p < points.length; p++){
            for(let k = 0; k < numOfShapes; k++){
                if(shapes[k].snapped && inPolygon(points[p], shapes[k].vertices_Coor) && !closedNodes.includes(j)){
                    closedNodes.push(j);}
            }   
        }
    }
}

function snap(shapeNum){
    let snapped = false;

    if((shapes[shapeNum].shape_Coordinates[0] >= shapes[shapeNum].snap_Coordinates[0] - snapRangeX 
            && shapes[shapeNum].shape_Coordinates[0] <= shapes[shapeNum].snap_Coordinates[0] + snapRangeX)
        && (shapes[shapeNum].shape_Coordinates[1] >= shapes[shapeNum].snap_Coordinates[1] - snapRangeY 
            && shapes[shapeNum].shape_Coordinates[1] <= shapes[shapeNum].snap_Coordinates[1] + snapRangeY)){
        
        shapes[shapeNum].shape_Coordinates = shapes[shapeNum].snap_Coordinates;
        shapes[shapeNum].snapped = true;
        snapped = true;
    }
    update_Vertices_Coordinates(shapeNum);
    updateDrawing();
    closedNodes = [];
    checkClosedNodes();
    return snapped;
}

function check_if_all_shapes_snapped(){
    for(let k = 0; k < numOfShapes; k++){
        if(shapes[k].snapped == false)
            return false;
    }
    return true;
}

function surroundedByClosedNodes(nodeNum){
    let sNodes = nodes[nodeNum].getSurroundingNodes();
    for(let k = 0; k < sNodes.length; k++){
        if(!closedNodes.includes(sNodes[k]))
            return false;
    }
    return true;
}

function checkCoordinates(i){
    let row = Math.floor(i/gCols), col = i%gCols;
    return [cHalfWidth + col*cWidth, cHalfHeight + row*cHeight];
}

function gValue(i){
    if(i === mouseStartNode) return 0;
    
    let sNodes = checkSurroundingNodes(i,false);
    for(let j = 0; j < sNodes.length; j++){
        if(sNodes[j] === mouseStartNode){
            if(checkCoordinates(i)[0] - checkCoordinates(mouseStartNode)[0] == 0 || checkCoordinates(i)[1] - checkCoordinates(mouseStartNode)[1] == 0)
                return 10;
            else
                return 14;
        }
    } 
    return null;
}

function fValue(i){
    if(closedNodes.includes(i))
        return null;
    return hValue(i) + gValue(i);
}

function hValue(i){
    return Math.round(pythagorean(checkCoordinates(i)[0] - checkCoordinates(cheeseNode)[0], 
        checkCoordinates(i)[1] - checkCoordinates(cheeseNode)[1]));
}

function pythagorean(side1, side2){
    return Math.sqrt(Math.pow(side1, 2) + Math.pow(side2, 2));
}

//With every new path, the G values change because the start node changes.
function updateFGvalues(){
    for(let k = 0; k < nodesLength; k++){
        nodes[k].gValue = gValue(k);
        nodes[k].fValue = fValue(k);
    }
}

function drawShape(shapeNum){
    ctx.beginPath();
    ctx.strokeStyle = shapes_Stroke_Style;
    ctx.lineWidth = shapes_Line_Width;

    let num_Vertices = shapes[shapeNum].numOfVertices;
    let shape_CoorX = shapes[shapeNum].shape_Coordinates[0];
    let shape_CoorY = shapes[shapeNum].shape_Coordinates[1];

    for(let j = 0; j < num_Vertices; j++){
        if(j == 0)
            ctx.moveTo(shape_CoorX + shapes[shapeNum].vertices[j][0], shape_CoorY + shapes[shapeNum].vertices[j][1]);

        ctx.lineTo(shape_CoorX + shapes[shapeNum].vertices[j][0], shape_CoorY + shapes[shapeNum].vertices[j][1]);

        //If this is the last vertex, then draw a line to the first vertex to complete the shape
        if(j+1 == num_Vertices)
            ctx.lineTo(shape_CoorX + shapes[shapeNum].vertices[0][0], shape_CoorY + shapes[shapeNum].vertices[0][1]);
    }
    ctx.stroke();
    ctx.fillStyle = shapes_fillStyle;
    ctx.fill();
}


function drawSnapLocations(){
    ctx.beginPath();
    ctx.strokeStyle = '#A9A9A9';
    ctx.lineWidth = shapes_Line_Width;

    for(let k = 0; k < numOfShapes; k++){
        let num_Vertices = shapes[k].numOfVertices;
        let x = shapes[k].snap_Coordinates[0];
        let y = shapes[k].snap_Coordinates[1];

        for(let j = 0; j < num_Vertices; j++){
            if(j == 0)
                ctx.moveTo(x + shapes[k].vertices[j][0], y + shapes[k].vertices[j][1]);

            ctx.lineTo(x + shapes[k].vertices[j][0], y + shapes[k].vertices[j][1]);
            
            //If this is the last vertex, then draw a line to the first vertex to complete the shape
            if(j+1 == num_Vertices)
                ctx.lineTo(x + shapes[k].vertices[0][0], y + shapes[k].vertices[0][1]);
        }
    }
    ctx.stroke();
}

function drawGrid() {
    ctx.beginPath();
    ctx.strokeStyle = 'lightgray';
    ctx.lineWidth = 1;
    for (let iRows = 0; iRows <= gRows; iRows++) {
        let y = iRows*cHeight;
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }
    for (let iCols = 0; iCols <= gCols; iCols++) {
        let x = iCols*cWidth;
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }
}

var canvas = document.getElementById("canvas");
canvas.style = "border: 3px solid #000000;"
var ctx = canvas.getContext("2d");

const grid={
    nRows: 30,
    nCols: 30,
    cell:{
        width: 15,
        height: 15
    }
};
let cWidth = grid.cell.width * grid.nCols, cHeight = grid.cell.height * grid.nRows;
let cHalfWidth = grid.cell.width * grid.nCols / 2, cHalfHeight = grid.cell.height * grid.nRows / 2;

let shapeLocations = [[50,50],[50,120],[50,200],[50,300]];
let vertices1 = [0,0], vertices2 = [0,0], vertices3 = [0,0], vertices4 = [0,0];
let snapLocations = [[cHalfWidth, cHalfHeight - 65], [cHalfWidth, cHalfHeight + 65],
 [cHalfWidth - 90, cHalfHeight], [cHalfWidth + 90, cHalfHeight]];
let numOfDraggingShape = 0;

updateDrawing();
canvas.addEventListener("mousedown", mouseDown);
canvas.addEventListener("mouseup", mouseUp);
canvas.addEventListener("mousemove", mouseMove);

let mouseIsDown = false;
function mouseDown(e){
    mouseIsDown = true;
}   
function mouseUp(e){
    mouseIsDown = false;
    if (snap(snapLocations[0], shapeLocations[0], 1)){
        drawShape1(snapLocations[0][0], snapLocations[0][1]);
    }
    if(snap(snapLocations[1], shapeLocations[1], 2)){
        drawShape2(snapLocations[1][0], snapLocations[1][1]);
    }
    if(snap(snapLocations[2], shapeLocations[2], 3)){
        drawShape3(snapLocations[2][0], snapLocations[2][1]);
    }
    if(snap(snapLocations[3], shapeLocations[3], 4)){
        drawShape4(snapLocations[3][0], snapLocations[3][1]);
    }
    numOfDraggingShape = 0;
}
function mouseMove(e){
    if(mouseIsDown == true){
        let rect = canvas.getBoundingClientRect();
        let mouseLocationX = e.x - rect.x;
        let mouseLocationY = e.y - rect.y;
        updateDrawing();
        updateVertices();
        let point = [mouseLocationX, mouseLocationY];
        let shapeNum = insideWhichPolygon(point);
        switch(shapeNum){
            case 1:
                drawShape1(mouseLocationX, mouseLocationY);
                break;
            case 2: 
                drawShape2(mouseLocationX, mouseLocationY);
                break;   
            case 3: 
                drawShape3(mouseLocationX, mouseLocationY);
                break;   
            case 4: 
                drawShape4(mouseLocationX, mouseLocationY);
                break;
        }
    }
}
function snap(snapLocation, shapeLocation, shapeNum){
    if(shapeLocation[0] >= snapLocation[0] - 20 && shapeLocation[0] <= snapLocation[0] + 20){
        if(shapeLocation[1] >= snapLocation[1] - 10 && shapeLocation[1] <= snapLocation[1] + 10){
            drawGrid();
            drawSnapLocations();
            drawCheese();
            switch(shapeNum){
                case 1:
                    drawShape2(shapeLocations[1][0], shapeLocations[1][1]);
                    drawShape3(shapeLocations[2][0], shapeLocations[2][1]);
                    drawShape4(shapeLocations[3][0], shapeLocations[3][1]);
                    shape1Snapped = true;
                    return true;
                case 2: 
                    drawShape1(shapeLocations[0][0], shapeLocations[0][1]);
                    drawShape3(shapeLocations[2][0], shapeLocations[2][1]);
                    drawShape4(shapeLocations[3][0], shapeLocations[3][1]);
                    shape2Snapped = true;
                    return true;   
                case 3: 
                    drawShape1(shapeLocations[0][0], shapeLocations[0][1]);
                    drawShape2(shapeLocations[1][0], shapeLocations[1][1]);
                    drawShape4(shapeLocations[3][0], shapeLocations[3][1]);
                    shape3Snapped = true;
                    return true;   
                case 4: 
                    drawShape1(shapeLocations[0][0], shapeLocations[0][1]);
                    drawShape2(shapeLocations[1][0], shapeLocations[1][1]);
                    drawShape3(shapeLocations[2][0], shapeLocations[2][1]);
                    shape4Snapped = true;
                    return true;
                default:
                    drawShape1(shapeLocations[0][0], shapeLocations[0][1]);
                    drawShape2(shapeLocations[1][0], shapeLocations[1][1]);
                    drawShape3(shapeLocations[2][0], shapeLocations[2][1]);
                    drawShape4(shapeLocations[3][0], shapeLocations[3][1]);
                    return true;  
            }
        }    
    }
}
function updateDrawing(){
    drawGrid();
    drawCheese();
    drawSnapLocations();
    drawShape1(shapeLocations[0][0], shapeLocations[0][1]);
    drawShape2(shapeLocations[1][0], shapeLocations[1][1]);
    drawShape3(shapeLocations[2][0], shapeLocations[2][1]);
    drawShape4(shapeLocations[3][0], shapeLocations[3][1]);
}
function updateVertices(){
    vertices1[0] = [shapeLocations[0][0] - 95, shapeLocations[0][1] + 25];
    vertices1[1] = [shapeLocations[0][0] - 55, shapeLocations[0][1] - 25];
    vertices1[2] = [shapeLocations[0][0] + 55, shapeLocations[0][1] - 25];
    vertices1[3] = [shapeLocations[0][0] + 95, shapeLocations[0][1] + 25];

    vertices2[0] = [shapeLocations[1][0] - 95, shapeLocations[1][1] - 25];
    vertices2[1] = [shapeLocations[1][0] - 55, shapeLocations[1][1] + 25];
    vertices2[2] = [shapeLocations[1][0] + 55, shapeLocations[1][1] + 25];
    vertices2[3] = [shapeLocations[1][0] + 95, shapeLocations[1][1] - 25];

    vertices3[0] = [shapeLocations[2][0] - 5, shapeLocations[2][1] - 40];
    vertices3[1] = [shapeLocations[2][0] + 45, shapeLocations[2][1] - 40];
    vertices3[2] = [shapeLocations[2][0] + 25, shapeLocations[2][1]];
    vertices3[3] = [shapeLocations[2][0] + 45, shapeLocations[2][1] + 40];
    vertices3[4] = [shapeLocations[2][0] - 5, shapeLocations[2][1] + 40];
    vertices3[5] = [shapeLocations[2][0] - 25, shapeLocations[2][1]];

    vertices4[0] = [shapeLocations[3][0] + 5, shapeLocations[3][1] - 40];
    vertices4[1] = [shapeLocations[3][0] - 45, shapeLocations[3][1] - 40];
    vertices4[2] = [shapeLocations[3][0] - 25, shapeLocations[3][1]];
    vertices4[3] = [shapeLocations[3][0] - 45, shapeLocations[3][1] + 40];
    vertices4[4] = [shapeLocations[3][0] + 5, shapeLocations[3][1] + 40];
    vertices4[5] = [shapeLocations[3][0] + 25, shapeLocations[3][1]];
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
    if(numOfDraggingShape != 0){return numOfDraggingShape};
    if(inPolygon(point, vertices1)){
        numOfDraggingShape = 1;
    }
    if(inPolygon(point, vertices2)){
        numOfDraggingShape = 2;
    }
    if(inPolygon(point, vertices3)){
        numOfDraggingShape = 3;
    }
    if(inPolygon(point, vertices4)){
        numOfDraggingShape = 4;
    }
    return numOfDraggingShape;
}

function drawGrid() {
    canvas.width = grid.nCols * grid.cell.width;
    canvas.height = grid.nRows * grid.cell.height;
    let cHeight = grid.cell.height;
    let cWidth = grid.cell.width;

    ctx.beginPath();
    ctx.strokeStyle = 'lightgray';
    ctx.lineWidth = 1;
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
function drawCheese(){
    ctx.beginPath();
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 1;
    ctx.moveTo(cHalfWidth - 5, cHalfHeight - 5);
    ctx.lineTo(cHalfWidth + 5, cHalfHeight - 5);
    ctx.lineTo(cHalfWidth + 5, cHalfHeight + 5);
    ctx.lineTo(cHalfWidth - 5, cHalfHeight + 5);
    ctx.lineTo(cHalfWidth - 5, cHalfHeight - 5);
    ctx.stroke();
    ctx.fillStyle = "yellow";
    ctx.fill();
}
function drawShape1(x, y){
    ctx.beginPath();
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 3;
    ctx.moveTo(x - 95, y + 25);
    ctx.lineTo(x - 55, y - 25);
    ctx.lineTo(x + 55, y - 25);
    ctx.lineTo(x + 95, y + 25);
    ctx.lineTo(x - 95, y + 25);
    ctx.stroke();
    ctx.fillStyle = "blue";
    ctx.fill();
    shapeLocations[0][0] = x;
    shapeLocations[0][1] = y;
}
function drawShape2(x, y){
    ctx.beginPath();
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 3;
    ctx.moveTo(x - 95, y - 25);
    ctx.lineTo(x - 55, y + 25);
    ctx.lineTo(x + 55, y + 25);
    ctx.lineTo(x + 95, y - 25);
    ctx.lineTo(x - 95, y - 25);
    ctx.stroke();
    ctx.fillStyle = "blue";
    ctx.fill();
    shapeLocations[1][0] = x;
    shapeLocations[1][1] = y;
}
function drawShape3(x, y){
    ctx.beginPath();
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 3;
    ctx.moveTo(x - 5, y - 40);
    ctx.lineTo(x + 45, y - 40);
    ctx.lineTo(x + 25, y);
    ctx.lineTo(x + 45, y + 40);
    ctx.lineTo(x - 5, y + 40);
    ctx.lineTo(x - 25, y);
    ctx.lineTo(x - 5, y - 40);
    ctx.stroke();
    ctx.fillStyle = "blue";
    ctx.fill();
    shapeLocations[2][0] = x;
    shapeLocations[2][1] = y;
}
function drawShape4(x, y){
    ctx.beginPath();
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 3;
    ctx.moveTo(x + 5, y - 40);
    ctx.lineTo(x - 45, y - 40);
    ctx.lineTo(x - 25, y);
    ctx.lineTo(x - 45, y + 40);
    ctx.lineTo(x + 5, y + 40);
    ctx.lineTo(x + 25, y);
    ctx.lineTo(x + 5, y - 40);
    ctx.stroke();
    ctx.fillStyle = "blue";
    ctx.fill();
    shapeLocations[3][0] = x;
    shapeLocations[3][1] = y;
}
function drawSnapLocations(){
    ctx.beginPath();
    ctx.strokeStyle = '#A9A9A9';
    ctx.lineWidth = 3;
    ctx.moveTo(cHalfWidth - 95, cHalfHeight - 40);
    ctx.lineTo(cHalfWidth - 55, cHalfHeight - 90);
    ctx.lineTo(cHalfWidth + 55, cHalfHeight - 90);
    ctx.lineTo(cHalfWidth + 95, cHalfHeight - 40);
    ctx.lineTo(cHalfWidth - 95, cHalfHeight - 40);
    
    ctx.moveTo(cHalfWidth - 95, cHalfHeight + 40);
    ctx.lineTo(cHalfWidth - 55, cHalfHeight + 90);
    ctx.lineTo(cHalfWidth + 55, cHalfHeight + 90);
    ctx.lineTo(cHalfWidth + 95, cHalfHeight + 40);
    ctx.lineTo(cHalfWidth - 95, cHalfHeight + 40);

    ctx.moveTo(cHalfWidth - 95, cHalfHeight - 40);
    ctx.lineTo(cHalfWidth - 45, cHalfHeight - 40);
    ctx.lineTo(cHalfWidth - 65, cHalfHeight);
    ctx.lineTo(cHalfWidth - 45, cHalfHeight + 40);
    ctx.lineTo(cHalfWidth - 95, cHalfHeight + 40);
    ctx.lineTo(cHalfWidth - 115, cHalfHeight);
    ctx.lineTo(cHalfWidth - 95, cHalfHeight - 40);

    ctx.moveTo(cHalfWidth + 95, cHalfHeight - 40);
    ctx.lineTo(cHalfWidth + 45, cHalfHeight - 40);
    ctx.lineTo(cHalfWidth + 65, cHalfHeight);
    ctx.lineTo(cHalfWidth + 45, cHalfHeight + 40);
    ctx.lineTo(cHalfWidth + 95, cHalfHeight + 40);
    ctx.lineTo(cHalfWidth + 115, cHalfHeight);
    ctx.lineTo(cHalfWidth + 95, cHalfHeight - 40);
    ctx.stroke();
}

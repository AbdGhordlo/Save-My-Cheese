var canvas = document.getElementById("canvas");
canvas.style ="border: 3px solid #000000;"
var ctx = canvas.getContext("2d");

const grid={
    nRows: 29,
    //Assumning the cells are 15X15, columns should remain in odd numbers. (at least for my screen)
    //because even numbers give a -0.5 answer for "e.x - rect.x" instead of 0 on the left edge.
    nCols: 29,
    cell:{
        width: 15,
        height: 15
    }
};
//The following code gives the coordinates of every x and y intersection on the grid
var coordinates = [0,0];
let counter = 0;
for (let iRows = 0; iRows <= grid.nRows; iRows++) {
    for(let iCols = 0; iCols <= grid.nCols; iCols++){
        coordinates[counter] = [iCols*grid.cell.width, iRows * grid.cell.height];
        counter++;
    }
}
let coordinatesLength = coordinates.length;

drawGrid();
drawPuzzlePiece1((grid.nCols * grid.cell.width)/2, (grid.nRows * grid.cell.height)/2);
canvas.addEventListener("mousemove", updateGrid);
canvas.addEventListener("mousemove", updateDrawing);

function updateDrawing(e) {
    var rect = canvas.getBoundingClientRect();
    drawPuzzlePiece1(e.x - rect.x, e.y - rect.y);
}

function drawPuzzlePiece1(x, y){
    ctx.beginPath();
    ctx.strokeStyle="black";
    ctx.lineWidth = 6;
    ctx.moveTo(x + 15, y);
    ctx.lineTo(x + 65, y + 80);
    ctx.lineTo(x + 35, y + 80);
    ctx.lineTo(x - 15, y);
    ctx.lineTo(x + 35, y - 80);
    ctx.lineTo(x + 65, y - 80);
    ctx.lineTo(x + 15, y+3);
    ctx.stroke();  
}

//The following function gets the vertices of the polygon according to the mouse's location, then checks whether the coordinates
//within the boundaries of the polygon are inside by calling another function 
function updateGrid(e){
    drawGrid();
    var rect = canvas.getBoundingClientRect();
    //***Vertices should be updated according to the polygon
    const vertices=[[e.x + 15, e.y],[e.x + 65, e.y + 80],[e.x + 35, e.y + 80],[e.x - 15, e.y],
    [e.x + 35, e.y - 80],[e.x + 65, e.y - 80],[e.x + 15, e.y]];
    //Updating vertices so they become with respect to the canvas rather than the screen.
    for(let i = 0; i < vertices.length; i++){
        vertices[i][0] = vertices[i][0] - rect.x;
        vertices[i][1] = vertices[i][1] - rect.y;
    }
    //Taking the boundaries. If the coordinate isn't within the boundaries of a polygon, it won't enter the loop
    //I'm hoping this makes the function more efficient, but I'm not sure if there's actually a difference.
    var xNumbers = [], yNumbers = [];
    for(let i = 0; i < vertices.length; i++){
        xNumbers.push(vertices[i][0]);
        yNumbers.push(vertices[i][1]);
    }
    var xMax = Math.max(...xNumbers), xMin = Math.min(...xNumbers);
    var yMax = Math.max(...yNumbers), yMin = Math.min(...yNumbers);

    for(let i = 0; i < coordinatesLength; i++){
        if(coordinates[i][0] >= xMin && coordinates[i][0] <= xMax){
            if(coordinates[i][1] >= yMin && coordinates[i][1] <= yMax){
                var point = [coordinates[i][0], coordinates[i][1]];
                var inside = inPolygon(point, vertices);
                if(inside == true){
                    drawBlueCells(coordinates[i][0], coordinates[i][1]);
                }
            }
        }
    }
}

//This function will check whether the point is inside the polygon
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
//this function will draw blue cells on the given coordinate and the cells to it's left, upper left, and above
function drawBlueCells(x, y){
    let cHeight = grid.cell.height, cWidth = grid.cell.width;
    ctx.beginPath();
    ctx.strokeStyle = "blue";
    ctx.lineWidth = 1;
    //bottom right (given coordinate's cell)
    ctx.moveTo(x, y);
    ctx.lineTo(x + cWidth, y);
    ctx.lineTo(x + cWidth, y + cHeight);
    ctx.lineTo(x, y + cHeight);
    ctx.lineTo(x, y);
    ctx.stroke();
    //bottom left
    x = x - cWidth;
    ctx.moveTo(x, y);
    ctx.lineTo(x + cWidth, y);
    ctx.lineTo(x + cWidth, y + cHeight);
    ctx.lineTo(x, y + cHeight);
    ctx.lineTo(x, y);
    ctx.stroke();
    //top left
    y = y - cHeight;
    ctx.moveTo(x, y);
    ctx.lineTo(x + cWidth, y);
    ctx.lineTo(x + cWidth, y + cHeight);
    ctx.lineTo(x, y + cHeight);
    ctx.lineTo(x, y);
    ctx.stroke();
    //top
    x = x + cWidth;
    ctx.moveTo(x, y);
    ctx.lineTo(x + cWidth, y);
    ctx.lineTo(x + cWidth, y + cHeight);
    ctx.lineTo(x, y + cHeight);
    ctx.lineTo(x, y);
    ctx.stroke();
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

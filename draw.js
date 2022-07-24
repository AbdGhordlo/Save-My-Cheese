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
drawPolygon((grid.nCols * grid.cell.width)/2, (grid.nRows * grid.cell.height)/2);
canvas.addEventListener("mousemove", updateGrid);
canvas.addEventListener("mousemove", updateDrawing);

function updateDrawing(e) {
    var rect = canvas.getBoundingClientRect();
    drawPolygon(e.x - rect.x, e.y - rect.y);
}

function drawPolygon(x, y){
    ctx.beginPath();
    ctx.strokeStyle="black";
    ctx.lineWidth = 6;
    ctx.moveTo(x - 50, y + 50);
    ctx.lineTo(x + 50, y + 50);
    ctx.lineTo(x + 50, y - 50);
    ctx.lineTo(x - 50, y - 50);
    ctx.lineTo(x - 50, y + 50);
    ctx.stroke();
}

//The following code will set parameters around the polygon, from xMin to xMax, and from yMin to yMax
//any coordinate within those parameters will go through a loop that checks wether it's inside the polygon
function updateGrid(e){
    drawGrid();
    var rect = canvas.getBoundingClientRect();
    //polygon vertices are updated. *This should be changed according to the polygon
    const vertices=[[e.x - 50, e.y + 50],[e.x + 50, e.y + 50],[e.x + 50, e.y - 50],[e.x - 50, e.y - 50]];
    //getting only the x coordinates of the vertices (without repeating numbers)
    const xVertices = [];
    for(let i = 0; i < vertices.length; i++){
        if(xVertices.includes(vertices[i][0] - rect.x) == false){
            //- rect.x so it can give the coordinates with respect to the grid, not the screen.
            xVertices.push(vertices[i][0] - rect.x);
        }
    }
    //getting the biggest and smallest x coordsinates of the vertices
    let xVerticesMin = Math.min(...xVertices), xVerticesMax = Math.max(...xVertices);
    //same for y
    const yVertices = [];
    for(let i = 0; i < vertices.length; i++){
        if(yVertices.includes(vertices[i][1]) == false){
            yVertices.push(vertices[i][1] - rect.y);
        }
    }
    let yVerticesMin = Math.min(...yVertices) - 0.125, yVerticesMax = Math.max(...yVertices)- 0.125;
    //You don't really need to check if it crosses lines, just check if it crosses vertices
    for(let i = 0; i < coordinatesLength; i++){
        //+1 so it doesn't check itself, this is to avoid a blue cell not being drawn
        //when a vertex is exactly on the coordinate
        let xIntersectCounter = 0;
        let xLine = coordinates[i][0] +1;
        if(coordinates[i][0] >= xVerticesMin && coordinates[i][0] <= xVerticesMax ){
            if(coordinates[i][1] >= yVerticesMin && coordinates[i][1] <= yVerticesMax){
                //The following loop draws a line from the coordinate till xMax.
                //The line is actually just a pixel that iterates within the mentioned range, checking how many times it equals a vertex's x coordinate. 
                //Based on that number, we can deduce whether the coordinate is inside the polygon. 
                for(let j = 0; j <= xVerticesMax - coordinates[i][0]; j++){
                    for(let xVert = 0; xVert < xVertices.length; xVert++){
                        if(xLine == xVertices[xVert]){
                            xIntersectCounter++;
                        }
                    }
                    xLine++;
                }
                if(xIntersectCounter%2 == 1){
                    drawBlueCells(coordinates[i][0], coordinates[i][1]);
                }
            }
            
        }
    }
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

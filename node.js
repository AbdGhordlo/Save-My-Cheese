class node{
    constructor(nodeNum, surroundingNodes, coordinates, gValue, hValue, fValue){
        this.nodeNum = nodeNum;
        this.surroundingNodes = surroundingNodes;
        this.coordinates = coordinates;
        this.gValue = gValue;
        this.hValue = hValue;
        this.fValue = fValue;
    }
    getSurroundingNodes(){
        return this.surroundingNodes;
    }
    getCoordinates() {
        return this.coordinates;
    }
    setHvalue(value){
        this.hValue = value;
    }
    setGvalue(value){
        this.gValue = value;
    }
    setFvalue(value){
        this.fValue = value;
    }
    getFvalue(){
        return this.fValue;
    }
    getGvalue(){
        return this.gValue;
    }
    getHvalue(){
        return this.hValue;
    }
}
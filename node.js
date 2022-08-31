class node{
    constructor(walkable, surroundingNodes, coordinates,gValue, hValue, fValue){
        this.walkable = walkable;
        this.surroundingNodes = surroundingNodes;
        this.coordinates = coordinates;
        this.gValue = gValue;
        this.hValue = hValue;
        this.fValue = fValue;
    }
    getCoordinates() {
        return this.coordinates;
    }
    getWalkable() {
        return this.walkable;
    }
    setWalkable(value){
        this.walkable = value;
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

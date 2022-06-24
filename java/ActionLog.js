class ActionLog{
    data = [];

    constructor(){

    }

    getLastAction(){
        if(this.data.length > 0){
            return this.data.pop();
        }
    }

    addAction(action){
        this.data.push(action);
    }
}
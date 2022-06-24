class CarButton{
    wrapper
    btnAdd
    btnSub
    trackNumber

    constructor(trackNumber){
        this.trackNumber = trackNumber;

        // wrapper init
        this.wrapper = document.createElement("div");
        this.wrapper.setAttribute("class", "car-button-wrapper");
        this.wrapper.setAttribute("id", "car-button-wrapper-" + trackNumber);


        // minus
        this.btnSub = document.createElement("button");
        this.btnSub.setAttribute("class", "car-button");
        this.btnSub.setAttribute("id", "car-button-sub-"+trackNumber);
        this.btnSub.innerHTML = "-";

        // add
        this.btnAdd = document.createElement("button");
        this.btnAdd.setAttribute("class", "car-button");
        this.btnAdd.setAttribute("id", "car-button-add-"+trackNumber);
        this.btnAdd.innerHTML = "+";

        // append into wrapper
        this.wrapper.appendChild(this.btnSub);
        this.wrapper.appendChild(this.btnAdd);
    }

    clickPlus(config, isShifted, isCtrl){
        // Add cars if there is space in the track

        // get number of cars in track
        let parentNode = document.getElementById("track-" + this.trackNumber);
        let limit = parentNode.childNodes.length;
        let carCount = 0;
        parentNode.childNodes.forEach((node) =>{
            if(node.hasChildNodes()){
                carCount++;
            }
        });

        function addCar(index){
            let carDiv = document.createElement("div");
            carDiv.className = "car loaded";
            carDiv.setAttribute("draggable", "false");
            parentNode.childNodes[index].appendChild(carDiv);
        }

        function isNextSpaceAvailable(index){
            if(index + 1 < limit){
                if(!parentNode.childNodes[index + 1].hasChildNodes()){
                    return true;
                }
                else{
                    return false;
                }
            }
        }
        
        if(!isShifted && !isCtrl){
            if(carCount < limit){
                // add in loaded car at end of track
                // look at first open car spot
                for(let i = parentNode.childNodes.length - 1; i >= 0; i--){
                    if(!parentNode.childNodes[i].hasChildNodes()){
                        // add in car
                        addCar(i);
                        break;
                    }
                }
               
            }
        }
        else if(isShifted){
            // look if there is space to add 5 cars
            let count = 0;
            if(!parentNode.childNodes[0].hasChildNodes()){
                count++;
                while(isNextSpaceAvailable(count-1)){
                    count++;
                }
                if(count >= 5){
                    // add in cars find first space 
                    for(let j = count; j > count-5; j--){
                        addCar(j-1);
                    }
                }
            }
            

        }
        else if(isCtrl){
            // look if there is space to add 10 cars
            let count = 0;
            if(!parentNode.childNodes[0].hasChildNodes()){
                count++;
                while(isNextSpaceAvailable(count-1)){
                    count++;
                }
                if(count >= 10){
                    // add in cars find first space 
                    for(let j = count; j > count-10; j--){
                        addCar(j-1);
                    }
                }
            }
        }
        config.updateTrackConfigurations();
        

    }

    clickSub(config, isShifted, isCtrl){
        // Add cars if there is space in the track
        // get number of cars in track
        let parentNode = document.getElementById("track-" + this.trackNumber);
        let index = -1;

        for(let i = 0; i < parentNode.childElementCount; i++){
            if(parentNode.childNodes[i].hasChildNodes()){
                index = i;
                break;
            }
        }

        if(index == -1){
            return;
        }

        function delCar(index){

            parentNode.childNodes[index].firstChild.remove();
        }

        if( !isShifted && !isCtrl){
            delCar(index);
        }
        else if(isShifted){
            for(let i = index; i < index + 5; i++){
                if(i >= parentNode.childNodes.length){
                    break;
                }
                delCar(i);
            }
        }
        else if(isCtrl){
            for(let i = index; i < index + 10; i++){
                if(i >= parentNode.childNodes.length){
                    break;
                }
                delCar(i);
            }
        }

        
        config.updateTrackConfigurations()

    }
    
}
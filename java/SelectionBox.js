class SelectionBox {
  // this element will be the div box
  element;
  orgX;
  orgY;
  x1;
  x2;
  y1;
  y2;
  isVisible;
  selections;
  autopush;
  currentSelectionCount = 0;
  dragInfo = {
    selectionLength: null,
    selectionTrack: null,

    targetTrack: null,
    targetSpaceStart: null,
    targetSpaceEnd: null,
    validDrop: false,
  };
  history = [];

  constructor(element) {
    this.element = element;
    this.orgX = 0;
    this.orgY = 0;
    this.x1 = 0;
    this.x2 = 0;
    this.y1 = 0;
    this.y2 = 0;
    this.isVisible = false;
    this.selections = null;
    this.autopush = true;
  }

  // pass in users mouse coridnates and update size of selection box
  updatetDimensions(x, y) {
    this.x1 = Math.min(this.orgX, x);
    this.y1 = Math.min(this.orgY, y);
    this.x2 = Math.max(this.orgX, x);
    this.y2 = Math.max(this.orgY, y);

    // changing dimensions of selection box
    this.element.style.left = `${this.x1}px`;
    this.element.style.top = `${this.y1}px`;
    this.element.style.width = `${this.x2 - this.x1}px`;
    this.element.style.height = `${this.y2 - this.y1}px`;
  }

  show() {
    this.isVisible = true;
    this.element.style.display = "inline";
    this.element.style.opacity = 1;
  }
  hide() {
    // this.left = 0;
    // this.right = 0;
    // this.top = 0;
    // this.bottom = 0;
    this.isVisible = false;
    this.element.style.display = "none";
    this.element.style.opacity = 0;
  }

  reset() {
    this.element.style.opacity = 0;
    this.isVisible = false;
    this.orgX = 0;
    this.orgY = 0;
    this.x1 = 0;
    this.x2 = 0;
    this.y1 = 0;
    this.y2 = 0;
    this.element.style.left = "0px";
    this.element.style.top = "0px";
    this.element.style.width = "0px";
    this.element.style.height = "0px";
    this.element.style.display = "none";
  }


  /**
   * Method used when after mouse is released looks if any cars are in the selection box area and makes them selected items
   */
  select(elements) {
    let selectedElements = [];
    let firstParent = null;
    // add in validation to only do 1 track at a time
    function isOverLapping(box1, box2) {
      return !(box2.x1 > box1.right || box2.x2 < box1.left || box2.y1 > box1.bottom || box2.y2 < box1.top);
    }

    elements.forEach((element) => {
      let box = element.getBoundingClientRect();
      if (isOverLapping(box, this)) {
        let currentParent = element.parentElement.parentElement;
        firstParent = firstParent === null ? element.parentElement.parentElement : firstParent;

        // updating class
        // this makes it so only 1 track elements can be selected at a time
        if (firstParent == currentParent) {
          element.classList.add("selected");
          element.setAttribute("draggable", "true");
          selectedElements.push(element);
        }
      }
    });
    this.selections = selectedElements;
  }


  updateSelectionCount(elements){
    function isOverLapping(box1, box2) {
      return !(box2.x1 > box1.right || box2.x2 < box1.left || box2.y1 > box1.bottom || box2.y2 < box1.top);
    }

    let count = 0;

    elements.forEach((element) => {
      let box = element.getBoundingClientRect();
      if (isOverLapping(box, this)) {
        // updating class
          count++;
      }
    });

    return count;
  }

  unselect(elements) {
    elements.forEach((e) => {
      e.setAttribute("draggable", "false");
      e.classList.remove("selected");
    });
    this.selections = null;
  }

  #hasNextSpace(arry, index) {
    if (index + 1 >= arry.length) {
      return false;
    }

    if (arry[index + 1].hasChildNodes()) {
      return false;
    } else {
      return true;
    }
  }

  #hasPreviousSpace(arry, index) {
    if (index - 1 < 0) {
      return false;
    }

    if (arry[index - 1].hasChildNodes()) {
      return false;
    } else {
      return true;
    }
  }

  mouseDown(e) {
    // check to see if there are selections are clicking on draggable element if true dont do anything
    if (this.selections != null && e.target.classList.contains("selected")) {
      // do nothing this will try to move it
    } else {
      if (this.selections != null) {
        this.unselect(this.selections);
      }

      this.orgX = e.clientX;
      this.orgY = e.clientY;
    }
  }

  mouseMove(e, isMouseDown) {
    if (isMouseDown && this.selections == null) {
      this.updatetDimensions(e.clientX, e.clientY);
      if (!this.isVisible) {
        this.show();
      }

      // get selection count
      let elements = document.querySelectorAll(".car");
      this.currentSelectionCount = this.updateSelectionCount(elements);

    }
    
  }

  mouseUp(e) {
    if (this.selections == null) {
      this.select(document.querySelectorAll(".car"));
      this.reset();
    }

    this.isMouseDown = false;
    this.currentSelectionCount = 0;
  }

  dragStart(e) {
    //look at how many items are moving and how much space we will need
    e.dataTransfer.setData("text", "");
    this.dragInfo.selectionLength = this.selections.length;
    this.dragInfo.selectionTrack = e.target.parentElement.parentElement.id;
  }

  dragEnter(e) {
    // maybe update track effects or something here if it is a valid drop location
    // or color of selected cars to validate drop target

    // get track
    this.dragInfo.targetTrack = e.target.parentElement.id;

    // get space avalaible
    // looking to the right

    // look at space
    if (this.dragInfo.targetTrack != this.dragInfo.selectionTrack && e.target.classList[0] != "car") {
      let nodes = Array.from(e.srcElement.parentElement.childNodes);
      let index = nodes.indexOf(e.srcElement);
      let rCount = 0;
      let lCount = 0;
      while (this.#hasNextSpace(nodes, index + rCount)) {
        rCount++;
      }
      while (this.#hasPreviousSpace(nodes, index - lCount)) {
        lCount++;
      }

      this.dragInfo.targetSpaceStart = this.autopush
        ? index + rCount + 1 - this.dragInfo.selectionLength
        : index - lCount;
      this.dragInfo.targetSpaceEnd = this.autopush ? index + rCount : index + this.dragInfo.selectionLength;

      if (this.dragInfo.targetSpaceEnd - this.dragInfo.targetSpaceStart + 1 >= this.dragInfo.selectionLength) {
        this.dragInfo.validDrop = true;
      } else {
        this.dragInfo.validDrop = false;
      }

      //console.log(this.dragInfo);
    }
  }

  dragOver(e) {
    // update selection box info

    // getting the boxes 
    e.preventDefault();
  }

  dragEnd(e, actionLog) {

    // getting start and end spots for the selection for the action log
    let selectionNodes = Array.from(this.selections[0].parentElement.parentElement.childNodes);
    let selectionIndex = selectionNodes.indexOf(this.selections[0].parentElement);

    let counter = 0;
    if (this.dragInfo.validDrop) {
      let spotNodes = document.getElementById(this.dragInfo.targetTrack).childNodes;
      this.selections.forEach((car) => {
        spotNodes[this.dragInfo.targetSpaceStart + counter].appendChild(car);
        counter++;
      });
    }

    // update history stuff here
    //TODO
    this.history.push(`${this.dragInfo.selectionLength} From Track: ${this.dragInfo.selectionTrack[6]} -> Track: ${this.dragInfo.targetTrack[6]}`);
    actionLog.addAction( {
      type: "Move",
      fromTrack: this.dragInfo.selectionTrack[6],
      fromTrackStartSpace: selectionIndex,
      fromTrackEndSpace: selectionIndex + this.dragInfo.selectionLength -1,
      toTrack: this.dragInfo.targetTrack[6],
      toTrackStartSpace: this.dragInfo.targetSpaceStart,
      toTrackEndSpace: this.dragInfo.targetSpaceEnd,
      cars: this.dragInfo.selectionLength
     })
  }

  keydown(e) {
    // moving the selection left
    if(this.selections == null){
      return;
    }
    if (this.selections.length == 0) {
      return;
    }

    // deleting the cars
    if(e.key == "Backspace"){
      this.selections.forEach((ele) => {
        ele.remove();
      })
    }

    if (e.key == "ArrowLeft") {
      let nodes = Array.from(this.selections[0].parentElement.parentElement.childNodes);
      let index = nodes.indexOf(this.selections[0].parentElement);
      if (this.#hasPreviousSpace(nodes, index)) {
        // move all selections one to the left
        let counter = 0;
        this.selections.forEach((e) => {
          nodes[index + counter - 1].appendChild(e);
          counter++;
        });
      }
    }

    // moving selection right
    if (e.key == "ArrowRight") {
      let nodes = Array.from(this.selections[0].parentElement.parentElement.childNodes);
      let index = nodes.indexOf(this.selections[this.selections.length - 1].parentElement);
      if (this.#hasNextSpace(nodes, index)) {
        // move all selections one to the right
        let counter = 0;
        for (let i = this.selections.length - 1; i >= 0; i--) {
          nodes[index + 1 - counter].appendChild(this.selections[i]);
          counter++;
        }
      }
    }

    // making the cars empty
    if (e.code == "KeyE") {
      this.selections.forEach((e) => {
        // remove loaded and bo
        if (e.classList.contains("loaded")) {
          e.classList.remove("loaded");
        } else if (e.classList.contains("bo")) {
          e.classList.remove("bo");
        }

        if (!e.classList.contains("empty")) {
          e.classList.add("empty");
        }
      });

      // unselect everything
      this.unselect(this.selections);
    }

    // making the cars loaded
    if (e.code == "KeyL") {
      this.selections.forEach((e) => {
        // remove empty and bo
        if (e.classList.contains("empty")) {
          e.classList.remove("empty");
        } else if (e.classList.contains("bo")) {
          e.classList.remove("bo");
        }

        if (!e.classList.contains("loaded")) {
          e.classList.add("loaded");
        }
      });

      // unselect everything
      this.unselect(this.selections);
    }

    // making the cars bo
    if (e.code == "KeyB") {
      this.selections.forEach((e) => {
        // remove empty and loaded
        if (e.classList.contains("empty")) {
          e.classList.remove("empty");
        } else if (e.classList.contains("loaded")) {
          e.classList.remove("loaded");
        }

        if (!e.classList.contains("bo")) {
          e.classList.add("bo");
        }
      });

      // unselect everything
      this.unselect(this.selections);
    }
  }
}

class SelectionCountBox{



constructor(element){
  this.element = element;
  this.element.innerHTML = "";
  this.hide();
}

updatePosition(e){
  this.element.style.left = `calc(${e.clientX}px + 2rem)`;
  this.element.style.top  = `calc(${e.clientY}px - 2rem)`;
}

updateCount(count){
  this.element.innerHTML = (count > 0) ? count : "";
}

show(){
  this.element.style.display = "inline";
  this.element.style.opacity = 1;
}

hide(){
  this.element.display = "none";
  this.element.style.opacity = 0;
  this.element.innerHTML = "";
}


// event handlers
mouseDown(e){
  this.updatePosition(e);
  this.show();
}

mouseMove(e, isMouseDown, count){
  if(isMouseDown){
    selectionCountBox.updatePosition(e);
    selectionCountBox.updateCount(count);
  }
}


mouseUp(){
  this.hide();
}

}

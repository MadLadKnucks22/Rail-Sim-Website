class StatBox {
  element;
  loaded = 0;
  empty = 0;
  bo = 0;
  cars = 0;
  track;
  /**
   * Class used to keep track of all the cars in the track
   * @param {element} the stat box
   */
  constructor(element) {
    this.element = element;
    this.track = element.previousElementSibling;
    this.#initTextNodes();
    //this.loaded = this.empty = this.bo = 0;
    this.updateCarCounts();
  }

  updateCarCounts() {
    this.loaded = 0;
    this.empty = 0;
    this.bo = 0;
    this.track.childNodes.forEach((element) => {
      if (element.hasChildNodes()) {
        let carClass = element.children[0].className;
        if (carClass.includes("loaded")) {
          this.loaded++;
        } else if (carClass.includes("empty")) {
          this.empty++;
        } else if (carClass.includes("bo")) {
          this.bo++;
        }
      }
    });
    this.cars = this.loaded + this.empty + this.bo;
    this.element.childNodes[0].innerText = "L: " + this.loaded;
    this.element.childNodes[1].innerText = "E: " + this.empty;
    this.element.childNodes[2].innerText = "BO: " + this.bo;
  }

  #initTextNodes() {
    let textNodeLoaded = document.createElement("P");
    let textNodeEmpty = document.createElement("P");
    let textNodeBO = document.createElement("P");
    textNodeLoaded.innerText = "L: " + this.loaded;
    textNodeEmpty.innerText = "E: " + this.empty;
    textNodeBO.innerText = "BO: " + this.bo;
    // textNode.style.fontSize = "15px";
    //textNode.className = "stat-box-text";
    this.element.appendChild(textNodeLoaded);
    this.element.appendChild(textNodeEmpty);
    this.element.appendChild(textNodeBO);
  }
}

/**
 * Pretty much outdated now, the only thing that it is used for is to keep track of the current track configuration from the local storage
 */
class ConfigBox {
  // class variables
  element;
  trackConfigs = ["0", "0", "0", "0", "0"];
  currentTrackSelection = null;
  trackIndex = -1;
  currentlySavedTrack = null

  constructor() {
    //this.element = element;
    //this.#genHTML();

    // load in local storage if it exists
    if (localStorage.getItem("track-config") != null) {
      this.trackConfigs = JSON.parse(localStorage.getItem("track-config"));
    }

    // load in local storage to currently saved track if it exists
    if (localStorage.getItem("currently-saved-track-config") != null) {
      this.currentlySavedTrack = JSON.parse(localStorage.getItem("currently-saved-track-config"));
    }
  }

  saveTrack(){
    this.currentlySavedTrack = Array.from(this.trackConfigs);
    localStorage.setItem("currently-saved-track-config", JSON.stringify(this.currentlySavedTrack));
  }

  updateTextInput() {
    // updating track input if the track is selected
    if (this.trackIndex != -1) {
      document.getElementById("track-config-text").value = this.config2displayString(
        this.trackConfigs[this.trackIndex]
      );
    }
  }

  updateTrackConfigurations() {
    // after user has moved stuff around update trackConfig var
    let tc = this.getTrackConfigurations();
    this.trackConfigs[0] = tc[6];
    this.trackConfigs[1] = tc[5];
    this.trackConfigs[2] = tc[4];
    this.trackConfigs[3] = tc[3];
    this.trackConfigs[4] = tc[2];
    this.trackConfigs[5] = tc[1];
    this.trackConfigs[6] = tc[0];

    // update local storage
    localStorage.setItem("track-config", JSON.stringify(this.trackConfigs));
  }

  getTrackConfigurations() {
    // return array of strings containing what is in each track
    let tracks = document.getElementsByClassName("track");
    let tc = [];
    // when looking at config
    // 0 is blank
    // 1 is loaded
    // 2 is empty
    // 3 is BO

    // tracks are backwards right now
    for (let i = 0; i < tracks.length; i++) {
      let track = tracks[i];
      let str = "";
      let spots = track.childNodes;

      for (let j = 0; j < spots.length; j++) {
        let spot = spots[j];
        if (spot.hasChildNodes()) {
          let className = spot.childNodes[0].className;
          if (className == "car loaded" || className == "car loaded selected") {
            str += "1";
          } else if (className == "car empty" || className == "car empty selected") {
            str += "2";
          } else if (className == "car bo" || className == "car bo selected") {
            str += "3";
          }
        } else {
          str += "0";
        }
      }
      tc[i] = str;
    }
    return tc;
  }

  getSingleTrackConig(trackID) {
    let track = document.getElementById(trackID);
    let str = "";
    let spots = track.childNodes;

    for (let j = 0; j < spots.length; j++) {
      let spot = spots[j];
      if (spot.hasChildNodes()) {
        let className = spot.childNodes[0].className;
        if (className == "car loaded") {
          str += "1";
        } else if (className == "car empty") {
          str += "2";
        } else if (className == "car bo") {
          str += "3";
        }
      } else {
        str += "0";
      }
    }
    return str;
  }

  // takes the string given by getTrackConfigurations and makes it into a
  // just downt display the blank spots
  config2displayString(str) {
    let nextChar = "";
    let counter = 1;
    let r = "";

    for (let i = 0; i < str.length; i++) {
      let c = str[i];
      if (i != str.length - 1) {
        nextChar = str[i + 1];
      } else {
        nextChar = null;
      }

      if (c != nextChar || i == str.length - 1) {
        if (c == "1") {
          r += `${counter}L`;
        } else if (c == "2") {
          r += `${counter}E`;
        } else if (c == "3") {
          r += `${counter}BO`;
        }
        // else if (c == "0") {
        //   r += `${counter}W`;
        // }
        counter = 0;
      }
      counter++;
    }
    return r;
  }

  // event handler for list
  click(e) {
    let target = e.target;

    // do stuff
    // display current track arrangement
    this.updateTrackConfigurations();
    let t = target.innerHTML;
    let reg = /(\d)/g;
    let trackID = null;
    if (reg.test(t)) {
      // trackID = "track-" + t.match(reg)[0];
      // console.log(trackID);
      trackID = parseInt(t.match(reg)[0]) - 1;
      this.trackIndex = trackID;
      this.currentTrackSelection = "track-" + (trackID + 1);
    }
    let text = document.getElementById("track-config-text");
    text.value = this.config2displayString(this.trackConfigs[trackID]);

    // change list to selection to current track
    document.getElementById("track-selection-list-text").children[0].innerHTML = "Track " + (trackID + 1);
  }

  #isInputValid(trackID, str) {
    // validation to make sure it can fit in the track
    if (str != null && str != "" && trackID != null) {
      let numreg = /(\d+)/g;
      let numMatch = str.match(numreg);
      let trackLength = document.getElementById(trackID).childNodes.length;
      let givenNumber = numMatch.map(Number).reduce((a, b) => {
        return a + b;
      }, 0);

      if (givenNumber > trackLength) {
        // console.log("to many cars");
        return false;
      }

      // check if L, E or BO is on the end but not together
      // let reg = /(\dL|\dE|\dBO)$/i;
      // reg.test("7L");

      // look for instances of where it would fail
      // so pretty much any time there is 2 letters together other then bo
      // let reg = /([lebo][bo][lebo])|([lebo][le][lebo])|((?<!L)\d+(?!L|E|BO))/i;
      let reg = /([lebo][bo][lebo])|([lebo][le][lebo])/i;
      if (reg.test(str)) {
        return false;
      }

      // then just make sure there is a number and a letter
      return true;
    } else {
      return false;
    }
  }

  // event handler for text area
  input(e) {
    //look to see if string is valid then update track
    // updating track
    //initCars()
    let str = e.target.value;
    if (this.#isInputValid(this.currentTrackSelection, str)) {
      //console.log("is valid");
      initCars(str, this.currentTrackSelection);
      this.updateTrackConfigurations();
    }
  }

  // disables certain keys in the input text
  keyDown(e) {
    // return "0123456789LEBO".indexOf(String.fromCharCode(e.which)) >= 0;
    if (
      ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "L", "l", "E", "e", "B", "b", "O", "o"].indexOf(e.key) != -1 ||
      e.keyCode == 8
    ) {
      //
    } else {
      e.preventDefault();
    }
  }
}

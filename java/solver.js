var startState = [];
var endState = [];

function initStartState() {
  startState[0] = Array(36).fill(1);
  startState[1] = Array(34).fill(1);
  startState[2] = Array(26).fill(1);
  startState[3] = Array(22).fill(0);
  startState[4] = Array(21).fill(0);
  startState[5] = Array(10).fill(0);
  startState[6] = Array(10).fill(0);
}

function initEndState() {
  endState[0] = Array(36).fill(2);
  endState[1] = Array(34).fill(2);
  endState[2] = Array(26).fill(2);
  endState[3] = Array(22).fill(0);
  endState[4] = Array(21).fill(0);
  endState[5] = Array(10).fill(0);
  endState[6] = Array(10).fill(0);
}

function isEmpty(arr) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] == 1 || arr[i] == 2) {
      return false;
    }
  }
  return true;
}

function findStartingCarIndex(arr) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] == 1 || arr[i] == 2) {
      return i;
    }
  }
}

function spaceBeforeFirstCar(arr) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] == 1 || arr[i] == 2) {
      if (i > 0) {
        return i - 1;
      } else {
        return 0;
      }
    }
  }

  return arr.length;
}

class Move {
  fromTrack = null;
  toTrack = null;
  cars = 0;

  constructor(fromTrack, toTrack, cars) {
    this.fromTrack = fromTrack;
    this.toTrack = toTrack;
    this.cars = cars;
  }
}

function getPossibleMoves() {
  let moves = [];

  // look at each track
  for (let i = 0; i < startState.length; i++) {
    // look to see if cars are in that track
    if (!isEmpty(startState[i])) {
      // look at up to 10 cars to be moved in that track
      for (let j = 0; j < 10; j++) {
        let startingIndex = findStartingCarIndex(startState[i]);
        if (startState[i][startingIndex + j] != 0) {
          // get possible moves to other tracks not including current track
          for (let k = 0; k < startState.length; k++) {
            if (k != i) {
              // look at space to see if move is avaialbe
              if (spaceBeforeFirstCar(startState[k]) >= j + 1) {
                moves.push(new Move(i, k, j + 1));
              }
            }
          }
        }
      }
    }
  }

  return moves;
}

function isAtEndState(state, endState) {
  for (let i = 0; i < endState.length; i++) {
    for (let j = 0; j < endState[i].length; j++) {
      if (state[i][j] != endState[i][j]) {
        return false;
      }
    }
  }

  return true;
}

initStartState();
var state = [];
function solve(move, ply) {
  if (ply == 0 || isAtEndState(state, endState)) {
  }
}

const randomRoll = (max = 6, min = 1) => { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min)
}

const getScoreMultiplier = (arr) => {
  let dupeVal = new Set(arr.filter((item, index) => arr.indexOf(item) != index))
  dupeVal = Array.from(dupeVal);
  if (dupeVal.length > 0) {
    let mult = 0;
    for (let i = 0; i < arr.length; i++) {
      if (dupeVal[0] === arr[i]) {
        mult++;
      }
    }
    return { dice: dupeVal[0], mult: mult };
  }
  return null;
}

const returnScore = (stack) => {
  let totalBuffer = 0;
  for (let column = 0; column < 3; column++) {
    let mult = getScoreMultiplier(stack[column]);
    if (mult) {
      //handle duplicate case
      if (mult.mult === 2) {
        totalBuffer += mult.dice * 4;
      } else if (mult.mult === 3) {
        totalBuffer += mult.dice * 9;
      }
    } else {
      stack[column].forEach((e) => {
        totalBuffer += e
      })
    }
  }
  return totalBuffer;
}

function getKeyByValue(object, value) {
  return Object.keys(object).find(key => object[key] === value);
}

/**
* @param stack - The dice stack to remove dupes from
* @param {Number} col - Target column
* @param {Number} val - Value to remove if any
*/
const removeDupes = (stack, col, val) => {
  let newPlayerState = structuredClone(stack);
  let newCol = columnMap[col];
  newPlayerState[newCol] = newPlayerState[newCol].filter(e => e !== val);
  return newPlayerState;
}

const computeMove = (opponentStack, yourStack) => {

}

const columnMap = {
  0: 2,
  1: 1,
  2: 0
}

export {
  randomRoll,
  getScoreMultiplier,
  columnMap,
  returnScore,
  getKeyByValue,
  removeDupes,
  computeMove
}
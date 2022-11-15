const randomRoll = (max=6, min=1) => { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min)
}

const getScoreMultiplier = (arr) => {
  let dupeVal = new Set(arr.filter((item, index) => arr.indexOf(item) != index))
  dupeVal = Array.from(dupeVal);
  if (dupeVal.length > 0){
    let mult = 0;
    for (let i = 0; i < arr.length; i++){
      if (dupeVal[0] === arr[i]){
        mult++;
      }
    }    
    return {dice: dupeVal[0], mult: mult};
  }    
  return null;
}

const columnMap = {
  0: 2,
  1: 1,
  2: 0
}

export {
  randomRoll,
  getScoreMultiplier,
  columnMap
}
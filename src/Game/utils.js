const randomRoll = () => { // min and max included 
  return Math.floor(Math.random() * (6 - 1 + 1) + 1)
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

const playerMap = {
  player: "PLAYER",
  bot: "BOT"
}

export {
  randomRoll,
  getScoreMultiplier,
  playerMap
}
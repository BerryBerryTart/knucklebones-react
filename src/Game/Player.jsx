import './Player.css'
import { useState, useEffect } from 'react';
import Dice from './Dice';
import { randomRoll, getScoreMultiplier } from './utils';

const Player = ({getRollState, diceStack, name, isBot, isYourTurn}) => {
  const [roll, setRoll] = useState(null);
  const [total, setTotal] = useState(0);

  const rollDice = () => {
    let roll = randomRoll();
    setRoll(roll);
    getRollState(roll)
  }

  useEffect(() => {
    if(!roll){
      rollDice();
    }
  },[isYourTurn])

  useEffect(() => {
      let totalBuffer = 0;
      for (let column = 0; column < 3; column++){
        let mult = getScoreMultiplier(diceStack[column]);      
        if (mult){
          //handle duplicate case
          if (mult.mult === 2){
            totalBuffer += mult.dice * 4;
          } else if (mult.mult === 3){
            totalBuffer += mult.dice * 9;
          }
        } else {
          diceStack[column].forEach((e) => {
            totalBuffer += e
          })
        }
      }
      setTotal(totalBuffer)
    }, [diceStack])

  if (isBot){
  return(
    <div id="player-bot" className="player-base">
      <h1>{name}</h1>
      <p className="score-total">{total}</p>
      <div className="roll-box">
        { roll &&
          <Dice value={roll}/>
        }
      </div>
    </div>
  )
  }
  return (
    <div id="player-you" className="player-base">
      <h1>{name}</h1>
      <p className="score-total">{total}</p>
      <div className="roll-box">
        { roll &&
          <Dice value={roll}/>
        }
      </div>
    </div>
  )
}

export default Player;
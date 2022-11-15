import React, { useEffect, useState } from 'react';
import './Col.css'
import Dice from './Dice';
import { getScoreMultiplier } from './utils';


const Col = ({diceStack, youOrThem, handleClick, enableHover}) => {
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (diceStack){
      let totalBuffer = 0;
      let mult = getScoreMultiplier(diceStack);
      if (mult){
        //handle duplicate case
        if (mult.mult === 2){
          totalBuffer += mult.dice * 4;
        } else if (mult.mult === 3){
          totalBuffer += mult.dice * 9;
        }
        diceStack.forEach((e) => {
          if (e !== mult.dice){
            totalBuffer += e
          }
        })
      } else {
        //no multiplier case
        diceStack.forEach((e) => {
          totalBuffer += e
        })
      }      
      setTotal(totalBuffer);
    }
  }, [diceStack])

  const renderDiceStack = (diceStack) => {
    let mult = getScoreMultiplier(diceStack);
    let stack = [];
    diceStack.forEach((e) => {
      if (mult && mult.dice === e){
        stack.push(<Dice value={e} scoreBG={mult.mult}/>)
      } else {
        stack.push(<Dice value={e}/>)
      }      
    })
    if (stack.length < 3){
      for(let i = stack.length; i < 3; i++){
        stack.push(<Dice emptySlot={true}/>)
      }      
    }
    //REVERSE FOR OPPONENT
    if (!youOrThem){
      stack = stack.reverse()
    }
    return stack.map((item, key) => React.cloneElement(item, {key: key}));
  }

  const ableToHover = () => {
    if (enableHover && diceStack.length < 3){
      return "able-to-hover";
    }
    return "";
  }

  return (
    <div onClick={handleClick} className={"dice-col " + ableToHover()}>
      {youOrThem && <p>{total}</p>}
      {renderDiceStack(diceStack)}
      {!youOrThem && <p>{total}</p>}
    </div>
  )
}

export default Col;

import React, { useState } from 'react'
import './Game.css'
import Col from './Col';
import Player from './Player';

const Game = () => {
  const [yourDiceStack, setYourDiceStack] = useState({ 0: [], 1: [], 2: [] });
  const [opponentDiceStack, setOpponentDiceStack] = useState({ 0: [], 1: [], 2: [] });
  const [yourMove, setYourMove] = useState(null);
  const [yourTurn, setYourTurn] = useState(true);

  const handleColumnClick = (col) => {
    if (yourMove && yourDiceStack[col].length < 3){
      let newState = structuredClone(yourDiceStack);
      newState[col] = [...newState[col], yourMove]
      setYourDiceStack(newState);
    }
  }  

  const getAndSetRoll = (v) => {
    setYourMove(v);
  }

  return (
    <div id="game">
      <Player 
        getRollState={getAndSetRoll}
        diceStack={yourDiceStack}
        name={"BOT"}
        isBot={true}
        isYourTurn={yourTurn}
      />
      <div id="game-top">
        <p>them</p>
      </div>
      <Player 
        getRollState={getAndSetRoll}
        diceStack={yourDiceStack}
        name={"YOU"}
        isBot={false}
        isYourTurn={yourTurn}
      />
      <div id="game-bottom">        
        <Col 
          handleClick={() => handleColumnClick(0)} 
          diceStack={yourDiceStack[0]}
        />
        <Col 
          handleClick={() => handleColumnClick(1)} 
          diceStack={yourDiceStack[1]}
        />
        <Col 
          handleClick={() => handleColumnClick(2)} 
          diceStack={yourDiceStack[2]}
        />
      </div>
    </div>
  )
}

export default Game

import React, { useState, useEffect } from 'react';
import './Game.css';
import Col from './Col';
import Player from './Player';
import { getScoreMultiplier, randomRoll, columnMap } from './utils';

const Game = () => {
  const [yourDiceStack, setYourDiceStack] = useState({ 0: [], 1: [], 2: [] });
  const [opponentDiceStack, setOpponentDiceStack] = useState({ 0: [], 1: [], 2: [] });
  const [playerRoll, setPlayerRoll] = useState(null);
  const [botRoll, setBotRoll] = useState(null);
  const [yourTurn, setYourTurn] = useState(true);
  const [yourScore, setYourScore] = useState(0);
  const [botScore, setBotScore] = useState(0);
  const [whoWon, setWhoWon] = useState(null);

  //CALCULATES YOUR SCORE
  useEffect(() => {
    let totalBuffer = 0;
    for (let column = 0; column < 3; column++){
      let mult = getScoreMultiplier(yourDiceStack[column]);      
      if (mult){
        //handle duplicate case
        if (mult.mult === 2){
          totalBuffer += mult.dice * 4;
        } else if (mult.mult === 3){
          totalBuffer += mult.dice * 9;
        }
      } else {
        yourDiceStack[column].forEach((e) => {
          totalBuffer += e
        })
      }
    }
    setYourScore(totalBuffer);
  }, [yourDiceStack]);

  //CALCULATES BOT SCORE
  useEffect(() => {
    let totalBuffer = 0;
    for (let column = 0; column < 3; column++){
      let mult = getScoreMultiplier(opponentDiceStack[column]);      
      if (mult){
        //handle duplicate case
        if (mult.mult === 2){
          totalBuffer += mult.dice * 4;
        } else if (mult.mult === 3){
          totalBuffer += mult.dice * 9;
        }
      } else {
        opponentDiceStack[column].forEach((e) => {
          totalBuffer += e
        })
      }
    }
    setBotScore(totalBuffer);
  }, [opponentDiceStack]);

  useEffect(() => {
    //WIN CHECK
    winCheck();

    let diceRoll = randomRoll();
    if (!whoWon && yourTurn){
      setPlayerRoll(diceRoll);
    } else if (!yourTurn) {
      setBotRoll(diceRoll);
    }    
  }, [yourTurn]);

  //Bot has a go :3c
  useEffect(() => {    
    if (botRoll && !yourTurn){
      setTimeout(() => {    
        tryBotMove();          
      }, 1500);
    }
  }, [botRoll])

  const tryBotMove = () => {  
    if (!whoWon){  
      let columnIndexChoices = [];
      for (let i = 0; i < 3; i++){
        if (opponentDiceStack[i].length < 3){
          columnIndexChoices.push(i)
        }
      }
      let pickRandomCol = randomRoll(columnIndexChoices.length - 1, 0);    
      let randomCol = columnIndexChoices[pickRandomCol]
      let newState = structuredClone(opponentDiceStack);
      newState[randomCol] = [...newState[randomCol], botRoll]
      setOpponentDiceStack(newState);
      setYourTurn(!yourTurn);

      //ELIMINATE DUPES :3c
      let newPlayerState = structuredClone(yourDiceStack);
      let newCol = columnMap[randomCol];
      newPlayerState[newCol] = newPlayerState[newCol].filter(e => e !== botRoll);
      setYourDiceStack(newPlayerState);
      setBotRoll(null);  
    }  
  }

  //handles player input
  const handleColumnClick = (col) => {
    if (!whoWon && playerRoll && yourDiceStack[col].length < 3){
      let newState = structuredClone(yourDiceStack);
      newState[col] = [...newState[col], playerRoll]
      setYourDiceStack(newState);
      setYourTurn(!yourTurn);

      //ELIMINATE DUPES :3c
      let newOpponentState = structuredClone(opponentDiceStack);
      let newCol = columnMap[col];
      newOpponentState[newCol] = newOpponentState[newCol].filter(e => e !== playerRoll);
      setOpponentDiceStack(newOpponentState);
      setPlayerRoll(null);
    }
  }

  //WIN CHECK
  const winCheck = () => {
    //player
    if (yourDiceStack[0].length === 3 && yourDiceStack[1].length === 3 && yourDiceStack[2].length === 3){
      compareScores();
    }
    //bot
    if (opponentDiceStack[0].length === 3 && opponentDiceStack[1].length === 3 && opponentDiceStack[2].length === 3){
      compareScores();
    }
  };

  const compareScores = () => {
    if (yourScore > botScore){
      setWhoWon("YOU WON!!!");
    } else if (yourScore < botScore){
      setWhoWon("BOT WON!!!");
    } else {
      setWhoWon("TIE lol");
    }
  }

  return (
    <div id="game">
      <Player
        name={"BOT"}
        isBot={true}
        total={botScore}
        rollState={botRoll}
      />
      <div id="game-top">
        <Col 
          diceStack={opponentDiceStack[2]}
          youOrThem={false}
          enableHover={false}
        />
        <Col 
          diceStack={opponentDiceStack[1]}
          youOrThem={false}
          enableHover={false}
        />
        <Col 
          diceStack={opponentDiceStack[0]}
          youOrThem={false}
          enableHover={false}
        />
      </div>
     { whoWon &&
     <div id="win-result">
       <h1>{whoWon}</h1>
     </div> 
     }
      <Player 
        name={"YOU"}
        isBot={false}
        total={yourScore}
        rollState={playerRoll}
      />
      <div id="game-bottom">        
        <Col 
          handleClick={() => handleColumnClick(0)} 
          diceStack={yourDiceStack[0]}
          youOrThem={true}
          enableHover={yourTurn && !whoWon}
        />
        <Col 
          handleClick={() => handleColumnClick(1)} 
          diceStack={yourDiceStack[1]}
          youOrThem={true}
          enableHover={yourTurn && !whoWon}
        />
        <Col 
          handleClick={() => handleColumnClick(2)} 
          diceStack={yourDiceStack[2]}
          youOrThem={true}
          enableHover={yourTurn && !whoWon}
        />
      </div>
    </div>
  )
}

export default Game

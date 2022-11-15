import React, { useState, useEffect } from 'react';
import './Game.css';
import './toggle.css';
import Col from './Col';
import Player from './Player';
import { randomRoll, columnMap, returnScore, getKeyByValue, removeDupes } from './utils';

const Game = () => {
  const [yourDiceStack, setYourDiceStack] = useState({ 0: [], 1: [], 2: [] });
  const [opponentDiceStack, setOpponentDiceStack] = useState({ 0: [], 1: [], 2: [] });
  const [playerRoll, setPlayerRoll] = useState(null);
  const [botRoll, setBotRoll] = useState(null);
  const [yourTurn, setYourTurn] = useState(true);
  const [yourScore, setYourScore] = useState(0);
  const [botScore, setBotScore] = useState(0);
  const [whoWon, setWhoWon] = useState(null);
  const [hardmode, setHardmode] = useState(false);

  //CALCULATES YOUR SCORE
  useEffect(() => {
    let totalBuffer = returnScore(yourDiceStack);
    setYourScore(totalBuffer);
  }, [yourDiceStack]);

  //CALCULATES BOT SCORE
  useEffect(() => {
    let totalBuffer = returnScore(opponentDiceStack);
    setBotScore(totalBuffer);
  }, [opponentDiceStack]);

  useEffect(() => {
    //WIN CHECK
    winCheck();

    let diceRoll = randomRoll();
    if (!whoWon && yourTurn) {
      setPlayerRoll(diceRoll);
    } else if (!yourTurn) {
      setBotRoll(diceRoll);
    }
  }, [yourTurn]);

  //Bot has a go :3c
  useEffect(() => {
    if (botRoll && !yourTurn) {
      setTimeout(() => {
        tryBotMove();
      }, 1000);
    }
  }, [botRoll])

  const tryBotMove = () => {
    if (!whoWon) {
      let valid_move = false;
      let randomCol;

      //GENERATE COLUMNS TO CHOSE
      let columnIndexChoices = [];
      let potentialMoves = { 0: 0, 1: 0, 2: 0 };
      let potentialRemovals = { 0: 0, 1: 0, 2: 0 };
      for (let i = 0; i < 3; i++) {
        if (opponentDiceStack[i].length < 3) {
          columnIndexChoices.push(i);

          //Generate potential moves to compare to
          let tmpDiceStack = structuredClone(opponentDiceStack);
          tmpDiceStack[i].push(botRoll);
          potentialMoves[i] = returnScore(tmpDiceStack);
        }
        potentialRemovals[i] = returnScore(removeDupes(yourDiceStack, i, botRoll));
      }   
      
      if (hardmode) {
        let comparisonArray = [];
        for (let i = 0; i < 3; i++){
          if (columnIndexChoices.includes(i)){
            let botPotMove = potentialMoves[i];
            let playerRemovalResult = potentialRemovals[columnMap[i]];
            comparisonArray.push(botPotMove - playerRemovalResult);
          } else{
            comparisonArray.push(-Infinity);
          }        
        }
        randomCol = comparisonArray.indexOf(Math.max(...comparisonArray));
        if (randomCol === -1){
          randomCol = null;
        }
      }
      if (!hardmode) { 
        let pickRandomCol
        if (!randomCol){
          pickRandomCol = randomRoll(columnIndexChoices.length - 1, 0);
        }         
        randomCol = columnIndexChoices[pickRandomCol]
      }
      let newState = structuredClone(opponentDiceStack);
      newState[randomCol] = [...newState[randomCol], botRoll]
      setOpponentDiceStack(newState);
      setYourTurn(!yourTurn);

      //ELIMINATE DUPES :3c
      let newPlayerState = removeDupes(yourDiceStack, randomCol, botRoll);
      setYourDiceStack(newPlayerState);
      console.log(`BOT PLAYED A: ${botRoll} IN INDEX: ${randomCol}`);
      setBotRoll(null);
    }
  }

  //handles player input
  const handleColumnClick = (col) => {
    if (!whoWon && playerRoll && yourDiceStack[col].length < 3) {
      let newState = structuredClone(yourDiceStack);
      newState[col] = [...newState[col], playerRoll]
      setYourDiceStack(newState);
      setYourTurn(!yourTurn);

      //ELIMINATE DUPES :3c
      let newOpponentState = removeDupes(opponentDiceStack, col, playerRoll);
      setOpponentDiceStack(newOpponentState);
      setPlayerRoll(null);
    }
  }

  //WIN CHECK
  const winCheck = () => {
    //player
    if (yourDiceStack[0].length === 3 && yourDiceStack[1].length === 3 && yourDiceStack[2].length === 3) {
      compareScores();
    }
    //bot
    if (opponentDiceStack[0].length === 3 && opponentDiceStack[1].length === 3 && opponentDiceStack[2].length === 3) {
      compareScores();
    }
  };

  const compareScores = () => {
    if (yourScore > botScore) {
      setWhoWon("YOU WON!!!");
    } else if (yourScore < botScore) {
      setWhoWon("BOT WON!!!");
    } else {
      setWhoWon("TIE lol");
    }
  }

  const resetGame = () => {
    setYourDiceStack({ 0: [], 1: [], 2: [] });
    setOpponentDiceStack({ 0: [], 1: [], 2: [] });
    setWhoWon(null);
    setYourTurn(true);
    setBotRoll(null);
    setPlayerRoll(randomRoll())
  }

  const disableGameButton = () => {
    if (whoWon) {
      return false;
    }
    return false;
  }

  const handleHardMode = (e) => {
    setHardmode(e.target.checked);
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
      {whoWon &&
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
      <div id="hard-mode">
        <p>HARD MODE (he he he):</p>
        <label className="switch">
          <input 
            type="checkbox" 
            disabled={!yourTurn}
            onChange={handleHardMode}
            value={hardmode}
          />
          <span className="slider round"></span>
        </label>
      </div>
      <div id="new-game">
        <button onClick={resetGame} disabled={disableGameButton()}>RESET</button>
      </div>
    </div>
  )
}

export default Game;

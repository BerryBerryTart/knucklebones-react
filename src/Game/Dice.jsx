import './Dice.css';

const Dice = ({value, scoreBG=1, emptySlot=false}) => {
  const valueMap = {
    1: "one-face ",
    2: "two-face ",
    3: "two-face three-face ",
    4: "four-face ",
    5: "four-face five-face ",
    6: "four-face "
  }

  const scoreMap = {
    1: "regular-dice ",
    2: "double-score-dice ",
    3: "triple-score-dice "
  }

  const generateDots = (value) => {
    let dotMatrix = []
    for (let i = 0; i < value; i++){
      dotMatrix.push(<span className="dot"></span>)
    }
    return dotMatrix;
  }

  const getDots = (value) => {
    switch(value) {
      case 1:
        return(
          <>
            {generateDots(1)}
          </>
        )
      case 2:
        return (
          <>
            {generateDots(2)}
          </>
        )
      case 3:
        return (
          <>
            {generateDots(3)}
          </>
        )
      case 4:
        return (
          <>
            <div className="diceColumn">
              {generateDots(2)}
            </div>
            <div className="diceColumn">
              {generateDots(2)}
            </div>
          </>
        )
      case 5:
        return (
          <>
            <div className="diceColumn">
              {generateDots(2)}
            </div>
            <div className="diceColumn">
              {generateDots(1)}
            </div>
            <div className="diceColumn">
              {generateDots(2)}
            </div>
            </>
        )
      case 6:
        return (
          <>
            <div className="diceColumn">
              {generateDots(3)}
            </div>
            <div className="diceColumn">
              {generateDots(3)}
            </div>
          </>
        )
      default:
        return null;
    }
  }

  const getDice = (value) => {
    return (
      <span className={"dice " + valueMap[value] + scoreMap[scoreBG]}>
        {getDots(value)}
      </span>      
    )
  }

  if(emptySlot){
    return(
      <span className="dice empty"></span>
    )
  }

  return (
    <>
      {getDice(value)}
    </>
  )
}

export default Dice;

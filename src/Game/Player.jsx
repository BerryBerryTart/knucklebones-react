import './Player.css'
import Dice from './Dice';

const Player = ({rollState, total, name, isBot}) => {
  if (isBot){
  return(
    <div id="player-bot" className="player-base">
      <h1>{name}</h1>
      <p className="score-total">{total}</p>
      <div className="roll-box">
        { rollState &&
          <Dice value={rollState}/>
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
        { rollState &&
          <Dice value={rollState}/>
        }
      </div>
    </div>
  )
}

export default Player;

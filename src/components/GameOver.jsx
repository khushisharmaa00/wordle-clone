import React, { useContext } from "react";
import { AppContext } from "../App";
import { boardDefault } from "../Words";

function GameOver() {
  const {
    gameOver,
    currAttempt,
    correctWord,
    setBoard,
    setGameOver,
    setCurrAttempt,
  } = useContext(AppContext);

  const handleReplay = () => {
    setBoard(boardDefault);
    setCurrAttempt({ attempt: 0, letterPos: 0 });
    setGameOver({ gameOver: false, guessedWord: false });
    window.location.reload(); // Refresh to load a new word
  };
  const displayWord = correctWord ? correctWord.toUpperCase() : "Loading...";
  return (
    <div className="gameOver">
      <h3>
        {gameOver.guessedWord
          ? "Congratulations You Won!🎈"
          : "You Failed to Guess the Word"}
      </h3>
      <h1>Correct Word: {displayWord}</h1>
      {gameOver.guessedWord && (
        <h3> You Guessed in {currAttempt.attempt} attempts</h3>
      )}
      <button onClick={handleReplay}>Play Again</button>
    </div>
  );
}

export default GameOver;

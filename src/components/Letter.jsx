import React, { useContext, useEffect } from "react";
import { AppContext } from "../App";

function Letter({ letterPos, attemptVal }) {
  const { board, correctWord, currAttempt, setDisabledLetters } =
    useContext(AppContext);
  const letter = board?.[attemptVal]?.[letterPos] || "";
  const correct =
    correctWord?.toUpperCase()[letterPos] === letter.toUpperCase();
  const almost =
    !correct &&
    letter !== "" &&
    correctWord?.toUpperCase().includes(letter.toUpperCase());
  const letterState =
    currAttempt.attempt > attemptVal &&
    (correct ? "correct" : almost ? "almost" : "error");

  useEffect(() => {
    if (letter !== "" && !correct && !almost) {
      setDisabledLetters((prev) => [...prev, letter]);
    }
  }, [currAttempt.attempt, letter, correct, almost, setDisabledLetters]);

  return (
    // <div className="letter" id={letterState}>
    <div className={`letter ${letterState}`} id={letterState}>
      {letter}
    </div>
  );
}

export default Letter;

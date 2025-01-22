import "./App.css";
import { createContext, useEffect, useState } from "react";
import Board from "./components/Board";
import Keyboard from "./components/Keyboard";
import { boardDefault, generateWordSet } from "./Words";
import GameOver from "./components/GameOver";

export const AppContext = createContext();

function App() {
  const [board, setBoard] = useState(boardDefault);
  const [currAttempt, setCurrAttempt] = useState({ attempt: 0, letter: 0 });
  const [wordSet, setWordSet] = useState(new Set());
  const [disabledLetters, setDisabledLetters] = useState([]);
  const [showInstructions, setShowInstructions] = useState(false);
  const [correctWord, setCorrectWord] = useState("");
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [gameOver, setGameOver] = useState({
    gameOver: false,
    guessedWord: false,
  });
  const [gameLink, setGameLink] = useState("");

  const openInviteModal = () => {
    const currentUrl = window.location.origin;
    const uniqueGameId = Math.random().toString(36).substring(2, 10);
    const uniqueGameLink = `${currentUrl}?game=${uniqueGameId}`;
    setGameLink(uniqueGameLink);
    setShowInviteModal(true);
  };

  const copyLinkToClipboard = () => {
    navigator.clipboard.writeText(gameLink).then(() => {
      alert("Link copied to clipboard!");
    });
  };

  useEffect(() => {
    generateWordSet()
      .then((words) => {
        if (words && words.todaysWord) {
          setWordSet(words.wordSet);
          setCorrectWord(words.todaysWord);
        } else {
          console.error("Failed to fetch the correct word.");
        }
      })
      .catch((error) => {
        console.error("Error generating word set:", error);
      });
  }, []);

  const SelectLetter = (key) => {
    if (currAttempt.letter > 4) return;
    const newBoard = [...board];
    newBoard[currAttempt.attempt][currAttempt.letter] = key;
    setBoard(newBoard);
    setCurrAttempt({
      attempt: currAttempt.attempt,
      letter: currAttempt.letter + 1,
    });
  };

  const onDelete = () => {
    if (currAttempt.letter === 0) return;
    const newBoard = [...board];
    const lastLetter = newBoard[currAttempt.attempt][currAttempt.letter - 1];
    newBoard[currAttempt.attempt][currAttempt.letter - 1] = "";
    setBoard(newBoard);
    setCurrAttempt({ ...currAttempt, letter: currAttempt.letter - 1 });
    setDisabledLetters((prev) =>
      prev.filter((letter) => letter !== lastLetter)
    );
  };

  const onEnter = () => {
    if (currAttempt.letter !== 5 || currAttempt.attempt >= 6) return;

    let currWord = "";
    // const newBoard = [...board];
    for (let i = 0; i < 5; i++) {
      currWord += board[currAttempt.attempt][i];
    }

    if (wordSet.has(currWord.toLowerCase())) {
      if (currWord === correctWord) {
        setGameOver({ gameOver: true, guessedWord: true });
        return;
      }
      setCurrAttempt({ attempt: currAttempt.attempt + 1, letter: 0 });
      const newDisabledLetters = [];

      for (let i = 0; i < 5; i++) {
        const letter = currWord[i];

        if (!correctWord.includes(letter)) {
          newDisabledLetters.push(letter);
        }
      }

      setDisabledLetters((prev) => [...prev, ...newDisabledLetters]);
    } else {
      alert("Word Not Found");
    }

    if (currAttempt.attempt === 5) {
      setGameOver({ gameOver: true, guessedWord: true });
      return;
    }
  };

  return (
    <div className="App">
      <nav className="navbar">
        <button onClick={openInviteModal} className="navbar-button">
          Invite Friend
        </button>
        <h1 className="navbar-title">Wordle</h1>
        <div className="navbar-buttons">
          <button
            onClick={() => setShowInstructions(true)}
            className="navbar-button"
          >
            How to Play
          </button>
        </div>
      </nav>
      <AppContext.Provider
        value={{
          board,
          setBoard,
          setDisabledLetters,
          disabledLetters,
          currAttempt,
          setCurrAttempt,
          SelectLetter,
          onDelete,
          onEnter,
          gameOver,
          setGameOver,
          correctWord,
        }}
      >
        <div className="game">
          <Board />
          {gameOver.gameOver ? <GameOver /> : <Keyboard />}
        </div>
      </AppContext.Provider>

      {showInstructions && (
        <div className="modal">
          <div className="modal-content">
            <h2>How to Play</h2>
            <p>
              Guess the hidden word in 6 tries. The color of the letters will
              change to show how close you are to the correct word.
            </p>
            <div className="example">
              <div className="example-row">
                <div className="key correct">E</div>
                <div className="key almost">A</div>
                <div className="key error">T</div>
              </div>
              <p>
                <strong>Green</strong>: Correct letter in the correct spot.
                <br />
                <strong>Yellow</strong>: Correct letter in the wrong spot.
                <br />
                <strong>Gray</strong>: Letter not in the word.
              </p>
            </div>
            <button onClick={() => setShowInstructions(false)}>Got it!</button>
          </div>
        </div>
      )}

      {showInviteModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Invite a Friend</h2>
            <p> Challenge your friend With any word with 5 letters:</p>
            <input
              type="text"
              value={gameLink}
              readOnly
              style={{ width: "100%", marginBottom: "10px" }}
            />
            <button onClick={copyLinkToClipboard}>Copy Link</button>
            <button
              className="inviteModal"
              onClick={() => setShowInviteModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

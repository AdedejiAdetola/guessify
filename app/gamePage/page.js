"use client";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import contractABI from "../../utils/contract"; // Path to your ABI
import styles from "./gamePage.module.css";
import contract from "@/services/contractService"; // Importing contract from services

const players = ["Player 1", "Player 2", "Player 3"]; // List of players

const Page = () => {
  const [selectedWord, setSelectedWord] = useState(
    "ANTIDISESTABLISHMENTARIANISM"
  );
  const [currentWord, setCurrentWord] = useState({
    word: "",
    display: [],
    correctGuesses: [],
    wrongGuesses: [],
  });
  const [guess, setGuess] = useState("");
  const [allGuesses, setAllGuesses] = useState([]);
  const [playerScores, setPlayerScores] = useState({
    "Player 1": 0,
    "Player 2": 0,
    "Player 3": 0,
  });
  const [currentPlayer, setCurrentPlayer] = useState(players[0]);
  const [winner, setWinner] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchWordFromSmartContract = async () => {
      setLoading(true);
      setError("");
      try {
        // Fetch the word from the smart contract
        const word = await contract.getGuessedWord();
        setSelectedWord(word);

        // Initialize the current word state based on the fetched word
        setCurrentWord({
          word: word,
          display: Array(word.length).fill(""),
          correctGuesses: [],
          wrongGuesses: [],
        });
      } catch (error) {
        console.error("Error fetching word from smart contract:", error);
        setError("Failed to fetch the word from the smart contract.");
      } finally {
        setLoading(false);
      }
    };

    fetchWordFromSmartContract();
  }, []);

  useEffect(() => {
    if (selectedWord) {
      setCurrentWord({
        word: selectedWord,
        display: Array(selectedWord.length).fill(""),
        correctGuesses: [],
        wrongGuesses: [],
      });
    }
  }, [selectedWord]);

  const handleLetterGuess = async (e) => {
    e.preventDefault();
    const letter = guess.toUpperCase();
    if (letter.length !== 1 || !/^[A-Z]$/i.test(letter)) return; // Only accept single alphabetic characters

    if (allGuesses.includes(letter)) return; // Prevent duplicate guesses

    let pointsEarned = 0;
    let isGuessCorrect = false;
    const updatedDisplay = [...currentWord.display];

    selectedWord.split("").forEach((char, index) => {
      if (char === letter) {
        updatedDisplay[index] = letter;
        isGuessCorrect = true;
        pointsEarned += 1;
      }
    });

    setPlayerScores((prevScores) => ({
      ...prevScores,
      [currentPlayer]: isGuessCorrect
        ? prevScores[currentPlayer] + pointsEarned
        : prevScores[currentPlayer],
    }));

    setCurrentWord((prev) => ({
      ...prev,
      display: updatedDisplay,
      correctGuesses:
        isGuessCorrect && !prev.correctGuesses.includes(letter)
          ? [...prev.correctGuesses, letter]
          : prev.correctGuesses,
      wrongGuesses:
        !isGuessCorrect && !prev.wrongGuesses.includes(letter)
          ? [...prev.wrongGuesses, letter]
          : prev.wrongGuesses,
    }));

    setAllGuesses([...allGuesses, letter]);
    setGuess("");

    const currentIndex = players.indexOf(currentPlayer);
    const nextIndex = (currentIndex + 1) % players.length;
    setCurrentPlayer(players[nextIndex]);

    if (updatedDisplay.join("") === selectedWord) {
      const winnerName = await contract.getWinnerName();
      setWinner(winnerName);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Hangman Game</h1>

      {loading && <p>Loading word from blockchain...</p>}
      {error && <p className={styles.error}>{error}</p>}

      {winner ? (
        <div className={styles.winnerAnnouncement}>
          <h2>Congratulations!</h2>
          <p>{winner} is the winner!</p>
        </div>
      ) : (
        <>
          <div className={styles.grid}>
            <div className={styles.wordContainer}>
              <div className={styles.inputs}>
                {currentWord.display.map((letter, index) => (
                  <input
                    key={index}
                    type="text"
                    value={letter}
                    className={styles.letterInput}
                    readOnly
                  />
                ))}
              </div>

              <div className={styles.guesses}>
                <div className={styles.correctGuesses}>
                  <h3>Correct Guesses:</h3>
                  {currentWord.correctGuesses.map((correctLetter, index) => (
                    <span key={index} className={styles.guessedLetter}>
                      {correctLetter}
                    </span>
                  ))}
                </div>

                <div className={styles.wrongGuesses}>
                  <h3>Wrong Guesses:</h3>
                  {currentWord.wrongGuesses.map((wrongLetter, index) => (
                    <span key={index} className={styles.guessedLetter}>
                      {wrongLetter}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleLetterGuess} className={styles.guessForm}>
            <input
              type="text"
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              placeholder="Guess a letter"
              className={styles.guessInput}
              maxLength={1}
            />
            <button type="submit" className={styles.guessButton}>
              Guess Letter
            </button>
          </form>

          <div className={styles.allGuesses}>
            <h3>All Guesses:</h3>
            {allGuesses.map((allGuess, index) => (
              <span key={index} className={styles.guessedLetter}>
                {allGuess}
              </span>
            ))}
          </div>

          <div className={styles.scoreTable}>
            <h1 className={styles.scoreH1}>Player Scores</h1>

            <table className={styles.scoreboard}>
              <tbody>
                <tr>
                  {players.map((player) => (
                    <td key={player} className={styles.scoreCell}>
                      <div>{player}</div>
                      <div>{playerScores[player]}</div>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default Page;

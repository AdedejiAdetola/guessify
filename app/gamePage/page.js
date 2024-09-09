"use client";
import { useState, useEffect } from "react";
import initializeContract from "@/utils/contract"; // Import the contract initialization function
import styles from "./gamePage.module.css";

const players = ["Player 1", "Player 2", "Player 3"]; // List of players

const Page = () => {
  const [contract, setContract] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // State to track loading status
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
  const [error, setError] = useState("");

  // Initialize the contract when the component mounts
  useEffect(() => {
    const initContract = async () => {
      try {
        setIsLoading(true); // Start loading
        const { contract, signer } = await initializeContract(); // Initialize the contract
        setContract(contract);
        console.log("Contract initialized:", contract);

        // Example function call to check initial state or setup
        const guessedWord = await contract.new(); // Ensure this matches the correct contract function
        console.log(`New state Word: ${guessedWord}`);
      } catch (error) {
        console.error("Error initializing contract:", error);
        setError("Failed to initialize the smart contract.");
      } finally {
        setIsLoading(false); // End loading
      }
    };

    initContract();
  }, []);

  // Set up the current word state when the selected word changes
  useEffect(() => {
    setCurrentWord({
      word: selectedWord,
      display: Array(selectedWord.length).fill(""),
      correctGuesses: [],
      wrongGuesses: [],
    });
  }, [selectedWord]);

  const handleLetterGuess = async (e) => {
    e.preventDefault();
    const letter = guess.toUpperCase();

    // Validate the guess
    if (letter.length !== 1 || !/^[A-Z]$/i.test(letter)) return; // Only accept single alphabetic characters
    if (allGuesses.includes(letter)) return; // Prevent duplicate guesses

    try {
      if (!contract) {
        alert(
          "Contract is still initializing. Please try again in a few seconds."
        );
        return;
      }

      // Make a guess using the smart contract
      await contract.guessLetter(letter);

      // Update the display and scores locally
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

      // Switch to the next player
      const currentIndex = players.indexOf(currentPlayer);
      const nextIndex = (currentIndex + 1) % players.length;
      setCurrentPlayer(players[nextIndex]);

      // Check if the word is complete from the frontend
      const isComplete = !updatedDisplay.includes(""); // If no empty spaces are left

      if (isComplete) {
        // Determine the winner from the frontend
        setWinner(currentPlayer);
      }
    } catch (error) {
      console.error("Error making guess:", error);
      setError("Failed to make a guess.");
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Hangman Game</h1>

      {isLoading ? (
        <p className={styles.loading}>Initializing contract, please wait...</p>
      ) : error ? (
        <p className={styles.error}>{error}</p>
      ) : winner ? (
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

"use client";
import React, { useState, useEffect } from "react";
import initializeContract from "@/utils/contract"; // Import the contract initialization function
import styles from "./mainPage.module.css";

const Page = () => {
  // const [name, setName] = useState("");
  const [name, setName] = useState("");
  const [wordToGuess, setWordToGuess] = useState("______");
  const [hint, setHint] = useState("Hint will be displayed here...");
  const [letter, setLetter] = useState("");
  const [scores, setScores] = useState({
    Player1: 0,
    Player2: 0,
    Player3: 0,
  });
  const [loading, setLoading] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [contract, setContract] = useState(null);
  const [currentTurn, setCurrentTurn] = useState("");
  const [winner, setWinner] = useState("");

  // Fetch contract and initial data on component mount
  useEffect(() => {
    const fetchContract = async () => {
      setLoading(true);
      try {
        const { contract, signer } = await initializeContract();
        setContract(contract);

        await updateGameState(contract);
        const getHintX = await contract.getHints();
        setHint(getHintX);
      } catch (error) {
        console.error("Error initializing contract:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchContract();
  }, []);

  // Regularly update the scores, guessed word, and turn
  useEffect(() => {
    if (!contract) return;

    const updateGameStatus = async () => {
      try {
        await updateGameState(contract);
      } catch (error) {
        console.error("Error updating game status:", error);
      }
    };

    // Set interval to update game status every 5 seconds
    const interval = setInterval(updateGameStatus, 5000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, [contract]);

  // Function to update guessed word, scores, game over status, and current turn
  const updateGameState = async (contract) => {
    try {
      const currentScores = await contract.getScores();
      setScores(currentScores);

      //   console.log("currentScore", currentScores);

      const updatedWord = await contract.getGuessedWord();
      //   console.log("updatedWord", updatedWord);
      setWordToGuess(updatedWord);

      const isComplete = await contract.isWordComplete();
      setGameOver(isComplete);

      if (isComplete) {
        const getWinner = await contract.getWinnerName();
        setWinner(getWinner);
      }

      const currentTurnPlayer = await contract.getTurn();
      //   console.log("currentTurnPlayer", currentTurnPlayer);
      setCurrentTurn(currentTurnPlayer);
    } catch (error) {
      console.error("Error updating game state:", error);
    }
  };

  // const handleStartGame = async () => {
  //   setLoading(true);
  //   try {
  //     const receipt = await contract.addPlayer(name);
  //     //   await updateGameState(contract);
  //     if (receipt) {
  //       router.push("/mainPage");
  //     } else {
  //       console.error("Transaction failed:", receipt);
  //     }
  //   } catch (error) {
  //     console.error("Error starting the game:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleSubmitLetter = async () => {
    if (!letter.trim()) return; // Prevent empty submissions
    setLoading(true);
    try {
      await contract.guessLetter(letter);
      await updateGameState(contract);
      setLetter(""); // Clear the input after submission
    } catch (error) {
      console.error("Error submitting letter:", error);
    } finally {
      setLoading(false);
    }
  };

  // Function to reset the game by calling contract.new()
  const handleResetGame = async () => {
    setLoading(true);
    try {
      await contract.new(); // Call the contract method to reset the game
      setName(""); // Clear all states to initial values
      setLetter("");
      setWordToGuess("______");
      setHint("Hint will be displayed here...");
      setScores({
        Player1: 0,
        Player2: 0,
        Player3: 0,
      });
      setGameOver(false);
      setCurrentTurn("");
      await updateGameState(contract); // Refresh game state after reset
    } catch (error) {
      console.error("Error resetting the game:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>GUESSIFY</h1>

      <div
        className={`${styles.gridContainer} ${
          gameOver ? styles.gridGameOver : ""
        }`}
      >
        {/* Enter Name Section */}
        {/* <div className={styles.shrinkSection}>
          <label className={styles.label}>Enter your name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={styles.inputSmall}
          />
          <button
            onClick={handleStartGame}
            className={styles.buttonSmall}
            disabled={loading}
          >
            Start Game
          </button>
        </div> */}

        {/* Word Display Section */}

        <div
          className={`${styles.wordSection} ${
            gameOver ? styles.wordGameOver : ""
          }`}
        >
          {/* <div className={styles.wordDisplay}> */}
          <div
            className={`${styles.wordDisplay} ${
              gameOver ? styles.winnerHighlight : ""
            }`}
          >
            {gameOver
              ? `Congratulations ${
                  winner.charAt(0).toUpperCase() + winner.slice(1).toLowerCase()
                } !!!`
              : wordToGuess}
          </div>
          <div className={styles.hintDisplay}>{gameOver ? "" : hint}</div>
        </div>

        {/* Enter Letter Section */}
        {!gameOver && (
          <div className={styles.shrinkSection}>
            <label className={styles.label}>Enter a letter:</label>
            <input
              type="text"
              value={letter}
              onChange={(e) => setLetter(e.target.value)}
              className={styles.inputSmall}
              maxLength={1}
              disabled={gameOver || loading}
            />
            <button
              onClick={handleSubmitLetter}
              className={styles.buttonSmall}
              disabled={loading || gameOver}
            >
              Submit Letter
            </button>
          </div>
        )}

        {/* Score Display Section */}
        <div className={styles.scoreSection}>
          <div className={styles.scoreDisplay}>
            <strong>Scores:</strong>
            <pre>{JSON.stringify(scores, null, 2)}</pre>
          </div>
        </div>

        {/* Current Turn Display */}
        <div
          className={`${styles.turnSection} ${
            gameOver ? styles.turnGameOver : ""
          }`}
        >
          <div className={styles.turnDisplay}>
            <strong>Current Turn:</strong> {currentTurn}
          </div>
        </div>

        {/* Reset Game Button */}
        <div className={styles.resetSection}>
          <button
            onClick={handleResetGame}
            className={styles.buttonReset}
            disabled={loading}
          >
            Reset Game
          </button>
        </div>
      </div>

      {loading && <div className={styles.loader}>Loading...</div>}
      {gameOver && (
        <div className={styles.gameOver}>Game Over! Thank you for playing.</div>
      )}
    </div>
  );
};

export default Page;

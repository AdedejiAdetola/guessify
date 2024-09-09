"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import initializeContract from "../utils/contract";
import styles from "./app.module.css";

export default function Home() {
  const router = useRouter();
  const [playerName, setPlayerName] = useState("");
  const [contract, setContract] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // State to track loading status

  // Initialize the contract when the component mounts
  useEffect(() => {
    const initContract = async () => {
      try {
        setIsLoading(true); // Start loading
        const { contract, signer_ } = await initializeContract();
        setContract(contract);
        console.log("con", contract);

        // Example function calls
        const guessedWord = await contract.new(); // Ensure this method name is correct as per your contract
        console.log(`New state Word: ${guessedWord}`);

        // Uncomment and adjust as needed
        // const isWordComplete = await contract.isWordComplete();
        // console.log(`Is Word Complete: ${isWordComplete}`);
      } catch (error) {
        console.error("Error initializing contract:", error);
      } finally {
        setIsLoading(false); // End loading
      }
    };

    initContract();
  }, []);

  const handleSubmit = async () => {
    console.log("playerName", playerName);
    if (!contract) {
      console.error("Contract not initialized yet");
      alert(
        "Contract is still initializing. Please try again in a few seconds."
      );
      return;
    }

    try {
      // const receipt = await sendTransaction("addPlayer", playerName); // Ensure "addPlayer" matches your contract method

      const receipt = await contract.addPlayer(playerName);
      console.log("Transaction successful:", receipt);

      if (receipt) {
        router.push("/waitingPage");
      } else {
        console.error("Transaction failed:", receipt);
      }
    } catch (error) {
      console.error("Error sending transaction:", error);
    }
  };

  return (
    <div className={styles.body}>
      <div className={styles.box1}>
        <h1 className={styles.h1}>Welcome Gamer!!!</h1>
        <p className={styles.p1}>Input your player name</p>
        {isLoading ? (
          <p className={styles.p1}>Initializing contract, please wait...</p>
        ) : (
          <div>
            <input
              type="text"
              className={styles.username}
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
            />
            <button className={styles.submitBtn} onClick={handleSubmit}>
              Enter Game
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

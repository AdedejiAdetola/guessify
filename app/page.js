// Home.js
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { sendTransaction } from "../services/web3Service";
import styles from "./app.module.css";

export default function Home() {
  const router = useRouter();
  const [playerName, setPlayerName] = useState("");

  const handleSubmit = async () => {
    try {
      // Call the addPlayer method through sendTransaction
      const receipt = await sendTransaction("addPlayer", playerName);
      console.log("Transaction successful:", receipt);

      // Handle navigation based on transaction receipt
      if (receipt.status) {
        router.push("/waitingPage"); // Use Next.js router for navigation
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
        <div>
          <input
            type="text"
            className={styles.username}
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
          />
        </div>
        <button className={styles.submitBtn} onClick={handleSubmit}>
          Enter Game
        </button>
      </div>
    </div>
  );
}

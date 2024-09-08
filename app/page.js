// Home.js
"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import styles from "./app.module.css";
import web3 from "../services/web3Service"; // Import Web3.js service

export default function Home() {
  const router = useRouter();
  const [playerName, setPlayerName] = useState("");

  const handleSubmit = async () => {
    try {
      // Initialize contract interaction
      const contract = await import("../services/contractService").then(
        (module) => module.default
      );

      // Simulate API call to smart contract
      const response = await contract.methods.joinRoom(playerName).call();
      // Assuming joinRoom returns an object with status
      if (response.status === "full") {
        router.push("/waitingPage");
      } else {
        router.push("/waitingPage");
      }
    } catch (error) {
      console.error("Error joining room:", error);
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

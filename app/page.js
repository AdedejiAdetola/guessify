"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import initializeContract from "@/utils/contract";
import styles from "./app.module.css";

export default function Home() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch contract and initial data on component mount
  useEffect(() => {
    const fetchContract = async () => {
      setLoading(true);
      try {
        const { contract, signer } = await initializeContract();
        console.log("con", contract);
        setContract(contract);
      } catch (error) {
        console.error("Error initializing contract:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchContract();
  }, []);

  const handleStartGame = async (e) => {
    e.preventDefault(); // Prevents the form from submitting normally
    setLoading(true);
    try {
      const receipt = await contract.addPlayer(name);
      console.log("rec", receipt);
      //   await updateGameState(contract);
      if (receipt) {
        router.push("/mainPage");
      } else {
        console.error("Transaction failed:", receipt);
      }
    } catch (error) {
      console.error("Error starting the game:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.body}>
      <div className={styles.content}>
        <div className={styles.introLeft}>
          <div className={styles.card}>
            <span className={styles.card__title}>W * * * C O M *</span>
            <p className={styles.card__content}>
              Enter game and Guess the Next letter?.
            </p>
            <form className={styles.card__form} onSubmit={handleStartGame}>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={styles.inputSmall}
              />
              <button className={styles.card__button} type="submit">
                Submit
              </button>
            </form>
            {loading && <div className="text-yellow-500">Loading...</div>}
          </div>
        </div>
      </div>
      <div className={styles.blurBackground}></div>

      <nav className={styles.navbar}>
        <div className={styles.logo}>Guessify</div>
        <button className={styles.button54} role="button">
          Login
        </button>
      </nav>
    </div>
  );
}

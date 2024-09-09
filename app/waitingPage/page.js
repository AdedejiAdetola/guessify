"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import contract from "@/services/contractService"; // Importing contract from services
import styles from "./waitingPage.module.css";

const WaitingPage = () => {
  const router = useRouter();

  // useEffect(() => {
  //   const checkRoomStatus = async () => {
  //     try {
  //       // Call the smart contract function to check if the word is complete
  //       const isWordComplete = await contract.isWordComplete();

  //       if (isWordComplete) {
  //         router.push("/gamePage");
  //       }
  //     } catch (error) {
  //       console.error("Error checking room status:", error);
  //     }
  //   };

  //   checkRoomStatus();
  // }, [router]);

  const handleSubmit = () => {
    router.push("/gamePage");
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <div>
        <h1>Please wait while we set up your game...</h1>
        <button className={styles.submitBtn} onClick={handleSubmit}>
          Manual redirect...
        </button>
      </div>
    </div>
  );
};

export default WaitingPage;

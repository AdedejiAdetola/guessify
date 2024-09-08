// waitingPage.js
"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./waitingPage.module.css";
// import web3 from "@/services/web3service"; // Import Web3.js service

const WaitingPage = () => {
  const router = useRouter();

  useEffect(() => {
    const checkRoomStatus = async () => {
      try {
        // Initialize contract interaction
        const contract = await import("@/services/contractService").then(
          (module) => module.default
        );

        // Simulate API call to smart contract
        const response = await contract.methods.checkRoomStatus().call();
        // Assuming checkRoomStatus returns an object with status
        if (response.status === "full") {
          router.push("/gamePage");
        }
      } catch (error) {
        console.error("Error checking room status:", error);
      }
    };

    checkRoomStatus();
  }, [router]);

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

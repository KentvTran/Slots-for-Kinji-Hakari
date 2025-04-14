import { useEffect, useRef, useState } from "react"
import { onAuthStateChanged } from "firebase/auth"
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore"
import { auth, db } from "../../firebase/firebase"
import { initializeGame } from "./phaserLogic"
import { updateCredits } from "./firebaseLogic"
import { AuthMessage, GameStatus } from "./uiComponents"
import "./Slots.scss"

// Game constants
export const GAME_CONFIG = {
  width: 800,
  height: 600,
  backgroundColor: "#ff69b4",
}

export const REEL_CONFIG = {
  count: 3,
  symbolsPerReel: 3,
  width: 130,
  spacing: 150,
  startX: -150,
  symbolWidth: 110,
  symbolHeight: 60,
}

export const COLORS = {
  machineBody: 0x6a0dad,
  machineStroke: 0xff69b4,
  reelWindow: 0x330066,
  reelWindowStroke: 0xffd700,
  reelBackground: 0x220044,
  reelStroke: 0xff69b4,
  leverBase: 0x333333,
  leverStroke: 0xffd700,
  betButton: 0x6a0dad,
  betButtonStroke: 0xffd700,
}

export const SYMBOLS = {
  names: ["chaewon", "gojo", "nanami", "winter", "todo"],
  labels: {
    chaewon: "CHAEWON",
    gojo: "GOJO",
    nanami: "NANAMI",
    winter: "WINTER",
    todo: "TODO",
  },
  prizes: {
    chaewon: 50,
    gojo: 40,
    nanami: 30,
    winter: 20,
    todo: 10,
  },
}

export const GAME_SETTINGS = {
  initialBet: 50,
  minBet: 10,
  betIncrement: 10,
  winChance: 0.3,
}

const Slots = () => {
  const gameRef = useRef(null)
  const [gameStatus, setGameStatus] = useState("Loading...")
  const [user, setUser] = useState(null)
  const [balance, setBalance] = useState(1000)
  const balanceRef = useRef(balance)
  const gameInitializedRef = useRef(false)

  // Sync balance with ref
  useEffect(() => {
    balanceRef.current = balance

    // Update the balance display in the game if it exists
    if (gameRef.current && gameRef.current.balanceText) {
      gameRef.current.balanceText.setText(`Balance: ${balance}`)
    }
  }, [balance])

  // Auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user)
      if (user) {
        try {
          const userDocRef = doc(db, "users", user.uid)
          const userDoc = await getDoc(userDocRef)
          if (userDoc.exists()) {
            setBalance(Number(userDoc.data().credits))
          } else {
            await setDoc(userDocRef, {
              credits: 1000,
              createdAt: serverTimestamp(),
            })
            setBalance(1000)
          }
        } catch (error) {
          console.error("Error loading user data:", error)
        }
      }
    })
    return () => unsubscribe()
  }, [])

  // Initialize the game only once
  useEffect(() => {
    // Don't initialize if already done or if no user
    if (gameInitializedRef.current || !user) {
      return
    }

    try {
      console.log("Initializing Phaser Game...")
      gameRef.current = initializeGame({
        balance,
        setBalance,
        balanceRef,
        updateCredits: (newBalance) => updateCredits(newBalance, user),
        setGameStatus,
      })
      gameInitializedRef.current = true
      console.log("Phaser Game created:", gameRef.current)
      setGameStatus("Game loaded")

      window.addEventListener("error", (e) => {
        console.error("Game error:", e)
        setGameStatus("Error: " + e.message)
      })
    } catch (error) {
      console.error("Failed to initialize game:", error)
      setGameStatus("Failed to initialize: " + error.message)
    }

    // Clean up on unmount
    return () => {
      gameInitializedRef.current = false
      if (gameRef.current) {
        gameRef.current.destroy(true)
        gameRef.current = null
      }
    }
  }, [user]) // Only depend on user, not balance

  // Update the JSX structure to ensure the gradient background is applied correctly
  return (
    <div className="slots-container">
      {!user ? (
        <AuthMessage />
      ) : (
        <>
          <div id="slots-container" className="slots-game"></div>
          {gameStatus !== "Game ready" && <GameStatus status={gameStatus} />}
        </>
      )}
    </div>
  )
}

export default Slots

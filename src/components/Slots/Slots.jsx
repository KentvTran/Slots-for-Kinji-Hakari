import { useEffect, useRef, useState } from "react";
import { auth, db } from "../../firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import Phaser from "phaser";
import "./Slots.scss";

const Slots = () => {
  const gameRef = useRef(null);
  const [gameStatus, setGameStatus] = useState("Loading...");
  const [user, setUser] = useState(null);
  const [balance, setBalance] = useState(1000);
  const balanceRef = useRef(balance);

  // Sync balance with ref
  useEffect(() => {
    balanceRef.current = balance;
  }, [balance]);

  // Auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        try {
          const userDocRef = doc(db, "users", user.uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            setBalance(Number(userDoc.data().credits));
          } else {
            await setDoc(userDocRef, {
              credits: 1000,
              createdAt: serverTimestamp(),
            });
            setBalance(1000);
          }
        } catch (error) {
          console.error("Error loading user data:", error);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  // Update credits in Firestore
  const updateCredits = async (newBalance) => {
    try {
      if (user) {
        console.log("Updating credits for", user.uid, "to", newBalance);
        await updateDoc(doc(db, "users", user.uid), {
          credits: newBalance,
        });
      }
    } catch (error) {
      console.error("Error updating credits:", error);
    }
  };
  

  useEffect(() => {
    // Game constants, configurations, and variables are as before.
    const GAME_CONFIG = {
      width: 800,
      height: 600,
      backgroundColor: "#ff69b4",
    };

    const REEL_CONFIG = {
      count: 3,
      symbolsPerReel: 3,
      width: 130,
      spacing: 150,
      startX: -150,
      symbolWidth: 110,
      symbolHeight: 60,
    };

    const COLORS = {
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
    };

    const SYMBOLS = {
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
    };

    const GAME_SETTINGS = {
      initialBalance: balanceRef.current,
      initialBet: 50,
      minBet: 10,
      betIncrement: 10,
      winChance: 0.3,
    };

    // Game variables
    let isSpinning = false;
    const reels = [];
    let resultText = null;
    let balanceText = null;
    let betInput = null;
    let currentBet = GAME_SETTINGS.initialBet;
    let winAmount = 0;
    let leverHandle = null;
    let betUpButton = null;
    let betDownButton = null;

    // Function to get a random symbol
    function getRandomSymbol() {
      return SYMBOLS.names[Math.floor(Math.random() * SYMBOLS.names.length)];
    }

    // Clear any existing game instance
    if (gameRef.current) {
      gameRef.current.destroy(true);
      gameRef.current = null;
    }

    // Create a new game configuration
    const config = {
      type: Phaser.AUTO,
      parent: "slots-container",
      width: GAME_CONFIG.width,
      height: GAME_CONFIG.height,
      backgroundColor: GAME_CONFIG.backgroundColor,
      dom: {
        createContainer: true,
      },
      scene: {
        preload: preload,
        create: create,
        update: update,
      },
    };

    try {
      console.log("Initializing Phaser Game...");
      gameRef.current = new Phaser.Game(config);
      console.log("Phaser Game created:", gameRef.current);
      setGameStatus("Game loaded");
    
      window.addEventListener("error", (e) => {
        console.error("Game error:", e);
        setGameStatus("Error: " + e.message);
      });
    } catch (error) {
      console.error("Failed to initialize game:", error);
      setGameStatus("Failed to initialize: " + error.message);
    }
    

    function preload() {
      try {
        console.log("Preloading assets...");
        SYMBOLS.names.forEach((symbol) => {
          console.log(`Loading asset: ${symbol}`);
          this.load.image(symbol, `/src/assets/${symbol}.png`);
        });
    
        this.load.on("loaderror", (fileObj) => {
          console.error("Error loading asset:", fileObj.src);
          setGameStatus(`Error loading: ${fileObj.key}`);
        });
    
        this.load.on("complete", () => {
          console.log("All assets loaded successfully.");
        });
    
        setGameStatus("Assets loaded");
      } catch (error) {
        console.error("Error in preload:", error);
        setGameStatus("Preload error: " + error.message);
      }
    }    

    function create() {
      try {
        console.log("Creating game scene...");
        createMachineBody.call(this);
        createReels.call(this);
        createLever.call(this);
        createBetControls.call(this);
        createTextDisplays.call(this);
        createSymbolLegend.call(this);
    
        setGameStatus("Game ready");
      } catch (error) {
        console.error("Error in create():", error);
        setGameStatus("Create error: " + error.message);
      }
    }
    

    // Create the main machine body and window
    function createMachineBody() {
      // Create slot machine body
      this.add
        .rectangle(GAME_CONFIG.width / 2, GAME_CONFIG.height / 2, 600, 400, COLORS.machineBody)
        .setStrokeStyle(8, COLORS.machineStroke)

      // Create reel window (the visible part)
      this.add
        .rectangle(GAME_CONFIG.width / 2, 250, 450, 180, COLORS.reelWindow)
        .setStrokeStyle(4, COLORS.reelWindowStroke)

      // Add title
      this.add
        .text(GAME_CONFIG.width / 2, 80, "HAKARI'S DOMAIN", {
          fontSize: "36px",
          fill: "#ffffff",
          fontFamily: "Arial",
          fontWeight: "bold",
          stroke: "#6a0dad",
          strokeThickness: 6,
        })
        .setOrigin(0.5)
    }

    // Create the reels and symbols
    function createReels() {
      console.log("Creating reels...");
      const maskGraphics = this.make.graphics();
      maskGraphics.fillStyle(0xffffff);
      maskGraphics.fillRect(175, 160, 450, 180);
      const reelMask = maskGraphics.createGeometryMask();
    
      const reelContainer = this.add.container(GAME_CONFIG.width / 2, 250);
      reelContainer.setMask(reelMask);    

      // Create each reel
      for (let i = 0; i < REEL_CONFIG.count; i++) {
        const reelBg = this.add
          .rectangle(REEL_CONFIG.startX + i * REEL_CONFIG.spacing, 0, REEL_CONFIG.width, 170, COLORS.reelBackground)
          .setStrokeStyle(2, COLORS.reelStroke)

        reelContainer.add(reelBg)

        const symbolsArray = []
        for (let j = 0; j < REEL_CONFIG.symbolsPerReel; j++) {
          const symbolName = getRandomSymbol()

          // Create an image with proper sizing
          const symbol = this.add
            .image(REEL_CONFIG.startX + i * REEL_CONFIG.spacing, -80 + j * 80, symbolName)
            .setDisplaySize(REEL_CONFIG.symbolWidth, REEL_CONFIG.symbolHeight)
            .setOrigin(0.5)

          symbol.name = symbolName
          reelContainer.add(symbol)
          symbolsArray.push(symbol)
        }

        reels.push({
          x: REEL_CONFIG.startX + i * REEL_CONFIG.spacing,
          symbols: symbolsArray,
          position: 0,
          previousPosition: 0,
        })
      }
    }

    // Create the lever
    function createLever() {
      // Lever base
      this.add.rectangle(650, 250, 30, 150, COLORS.leverBase).setStrokeStyle(2, COLORS.leverStroke)

      // Lever handle text
      leverHandle = this.add
        .text(650, 180, "SPIN", {
          fontSize: "16px",
          fontFamily: "Arial",
          fontWeight: "bold",
          fill: "#ffffff",
          backgroundColor: "#ff0000",
          padding: { x: 10, y: 10 },
          align: "center",
        })
        .setOrigin(0.5, 0)
        .setInteractive({ useHandCursor: true })
        .on(
          "pointerdown",
          function () {
            if (!isSpinning) {
              pullLever.call(this)
            }
          },
          this,
        )
    }

    // Create bet controls
    function createBetControls() {
      // Plus button
      betUpButton = this.add
        .rectangle(450, 450, 60, 60, COLORS.betButton)
        .setStrokeStyle(4, COLORS.betButtonStroke)
        .setInteractive({ useHandCursor: true })
        .on("pointerdown", increaseBet, this)

      this.add
        .text(450, 450, "+", {
          fontSize: "24px",
          fill: "#ffffff",
          fontFamily: "Arial",
          fontWeight: "bold",
        })
        .setOrigin(0.5)

      // Minus button
      betDownButton = this.add
        .rectangle(350, 450, 60, 60, COLORS.betButton)
        .setStrokeStyle(4, COLORS.betButtonStroke)
        .setInteractive({ useHandCursor: true })
        .on("pointerdown", decreaseBet, this)

      this.add
        .text(350, 450, "-", {
          fontSize: "24px",
          fill: "#ffffff",
          fontFamily: "Arial",
          fontWeight: "bold",
        })
        .setOrigin(0.5)
    }

    // Create text displays for balance, bet, and results
    function createTextDisplays() {
      balanceText = this.add
        .text(GAME_CONFIG.width / 2, 380, `Balance: $${balanceRef.current}`, {
          fontSize: "24px",
          fill: "#ffffff",
          fontFamily: "Arial",
          fontWeight: "bold",
          stroke: "#000000",
          strokeThickness: 3,
        })
        .setOrigin(0.5)

      resultText = this.add
        .text(GAME_CONFIG.width / 2, 340, "", {
          fontSize: "28px",
          fill: "#ffffff",
          fontFamily: "Arial",
          fontWeight: "bold",
          stroke: "#000000",
          strokeThickness: 3,
        })
        .setOrigin(0.5)

      // Create bet input field
      const inputElement = document.createElement("input")
      inputElement.type = "number"
      inputElement.value = currentBet
      inputElement.min = GAME_SETTINGS.minBet
      inputElement.max = balanceRef.current
      inputElement.style.width = "60px"
      inputElement.style.height = "30px"
      inputElement.style.textAlign = "center"
      inputElement.style.fontSize = "18px"
      inputElement.style.fontFamily = "Arial"
      inputElement.style.borderRadius = "5px"
      inputElement.style.border = "2px solid #ffd700"
      inputElement.style.backgroundColor = "#6a0dad"
      inputElement.style.color = "#ffffff"
      inputElement.style.fontWeight = "bold"
      inputElement.style.marginLeft = "5px"

      // Create a container for the bet label and input
      const betContainer = document.createElement("div")
      betContainer.style.display = "flex"
      betContainer.style.alignItems = "center"
      betContainer.style.justifyContent = "center"

      // Add a label before the input
      const betLabel = document.createElement("span")
      betLabel.textContent = "Bet: $"
      betLabel.style.color = "#ffffff"
      betLabel.style.fontSize = "20px"
      betLabel.style.fontFamily = "Arial"
      betLabel.style.fontWeight = "bold"
      betLabel.style.textShadow = "2px 2px 2px #000000"

      betContainer.appendChild(betLabel)
      betContainer.appendChild(inputElement)

      // Add the container to the DOM
      betInput = this.add.dom(GAME_CONFIG.width / 2, 500, betContainer)

      // Add event listener for input changes
      inputElement.addEventListener("change", (e) => {
        if (isSpinning) return

        let newBet = Number.parseInt(e.target.value)

        // Validate the bet amount
        if (isNaN(newBet) || newBet < GAME_SETTINGS.minBet) {
          newBet = GAME_SETTINGS.minBet
        } else if (newBet > balanceRef.current) {
          newBet = balanceRef.current
        }

        // Update the bet amount
        currentBet = newBet
        e.target.value = currentBet
      })

      // Add input event to update bet in real-time as user types
      inputElement.addEventListener("input", (e) => {
        if (isSpinning) return

        const newBet = Number.parseInt(e.target.value)

        // Only update if it's a valid number
        if (!isNaN(newBet)) {
          // We don't enforce min/max here to allow typing in progress
          // The final validation happens on change or before spin
          currentBet = newBet
        }
      })
    }

    function createSymbolLegend() {
      // Placeholder for symbol legend creation
    }

    function pullLever() {
      try {
        if (isSpinning) return

        // Get the current value from the input field and validate it before spinning
        const inputElement = document.querySelector('input[type="number"]')
        if (inputElement) {
          let newBet = Number.parseInt(inputElement.value)

          // Validate the bet amount
          if (isNaN(newBet) || newBet < GAME_SETTINGS.minBet) {
            newBet = GAME_SETTINGS.minBet
          } else if (newBet > balanceRef.current) {
            newBet = balanceRef.current
          }

          // Update the bet amount and input field
          currentBet = newBet
          inputElement.value = currentBet
        }

        // Animate lever pull
        this.tweens.add({
          targets: leverHandle,
          y: 230, // Move down
          duration: 300,
          ease: "Cubic.easeOut",
          onComplete: () => {
            // Return lever to original position
            this.tweens.add({
              targets: leverHandle,
              y: 180, // Original position
              duration: 500,
              ease: "Bounce.easeOut",
            })

            // Start the spin
            startSpin.call(this)
          },
        })
      } catch (error) {
        console.error("Error in pullLever:", error)
      }
    }

    function startSpin() {
      try {
        console.log("Starting spin...")

        if (isSpinning) {
          console.log("Already spinning, ignoring click")
          return
        }

        // Check if player has enough balance
        if (balanceRef.current < currentBet) {
          resultText.setText("Not enough funds!")
          resultText.setFill("#ff0000")
          setTimeout(() => {
            resultText.setText("")
          }, 2000)
          return
        }

        // Deduct bet from balance
        const newBalance = balanceRef.current - currentBet
        setBalance(newBalance)
        updateCredits(newBalance)
        balanceText.setText(`Balance: $${newBalance}`)

        isSpinning = true
        resultText.setText("")

        // Disable buttons during spin
        leverHandle.disableInteractive()
        betUpButton.disableInteractive()
        betDownButton.disableInteractive()

        // Disable input field during spin
        const inputElement = document.querySelector('input[type="number"]')
        if (inputElement) {
          inputElement.disabled = true
        }

        // Spin each reel with delay
        reels.forEach((reel, i) => {
          // Start spinning animation with a delay
          this.time.delayedCall(i * 200, () => {
            spinReelSimple(this, reel, i === reels.length - 1)
          })
        })
      } catch (error) {
        console.error("Error in startSpin:", error)
        isSpinning = false
        resultText.setText("Error: " + error.message)

        // Re-enable buttons
        enableControls()
      }
    }

    // Enable all controls
    function enableControls() {
      leverHandle.setInteractive()
      betUpButton.setInteractive()
      betDownButton.setInteractive()

      // Re-enable input field
      const inputElement = document.querySelector('input[type="number"]')
      if (inputElement) {
        inputElement.disabled = false
        inputElement.max = balanceRef.current
      }
    }

    // Simplified spinning function
    function spinReelSimple(scene, reel, isLastReel) {
      try {
        // How many spins to do
        const spinCount = isLastReel ? 7 : 5 + Math.floor(Math.random() * 3)
        let currentSpin = 0

        // Function to do one spin
        function doOneSpin() {
          // Move symbols down
          scene.tweens.add({
            targets: reel.symbols,
            y: "+=240", // Increased for better effect
            duration: 200,
            ease: currentSpin < spinCount - 1 ? "Linear" : "Cubic.easeOut",
            onComplete: () => {
              // Reset symbols position and randomize them
              reel.symbols.forEach((symbol) => {
                symbol.y -= 240

                // Only randomize if not the final spin
                if (currentSpin < spinCount - 1) {
                  updateSymbol(symbol, getRandomSymbol())
                } else {
                  // On final spin, set to predetermined values for win/lose logic
                  const shouldWin = Math.random() < GAME_SETTINGS.winChance

                  // If it's the last reel and we want a win, match the first reel's center symbol
                  if (isLastReel && shouldWin) {
                    const firstReelCenterSymbol = reels[0].symbols[1].name // Middle symbol (index 1 of 3)
                    updateSymbol(symbol, firstReelCenterSymbol)
                  } else {
                    updateSymbol(symbol, getRandomSymbol())
                  }
                }
              })

              currentSpin++

              // Continue spinning or check for win
              if (currentSpin < spinCount) {
                doOneSpin()
              } else if (isLastReel) {
                // If this is the last reel and we're done spinning, check for win
                checkWin(scene)
              }
            },
          })
        }

        // Start the spinning process
        doOneSpin()
      } catch (error) {
        console.error("Error in spinReelSimple:", error)
        if (isLastReel) {
          isSpinning = false
          resultText.setText("Error: " + error.message)
          enableControls()
        }
      }
    }

    // Update a symbol with a new texture while maintaining its size
    function updateSymbol(symbol, newSymbolName) {
      if (symbol.type === "Image") {
        symbol.setTexture(newSymbolName)
        // Ensure the size stays consistent
        symbol.setDisplaySize(REEL_CONFIG.symbolWidth, REEL_CONFIG.symbolHeight)
      } else {
        symbol.setText(SYMBOLS.labels[newSymbolName])
      }
      symbol.name = newSymbolName
    }

    function checkWin(scene) {
      try {
        // Get the center symbols (on the win line)
        const centerSymbols = reels.map((reel) => {
          // Get the middle symbol (index 1 of 3)
          return reel.symbols[1]
        })

        // Check if all symbols match
        const firstSymbol = centerSymbols[0].name
        const allMatch = centerSymbols.every((symbol) => symbol.name === firstSymbol)

        // Enable buttons after spin
        setTimeout(() => {
          isSpinning = false
          enableControls()
        }, 1000)

        if (allMatch) {
          // Player wins!
          winAmount = currentBet * SYMBOLS.prizes[firstSymbol]
          const newBalance = balanceRef.current + winAmount
          setBalance(newBalance)
          updateCredits(newBalance)
          balanceText.setText(`Balance: $${newBalance}`)

          resultText.setText(`YOU WIN $${winAmount}!`)
          resultText.setFill("#ffd700")

          // Animate winning symbols
          centerSymbols.forEach((symbol) => {
            scene.tweens.add({
              targets: symbol,
              scale: 1.3,
              duration: 200,
              yoyo: true,
              repeat: 5,
            })
          })
        } else {
          // Player loses
          resultText.setText("TRY AGAIN!")
          resultText.setFill("#ff6666")
        }
      } catch (error) {
        console.error("Error in checkWin:", error)
        isSpinning = false
        resultText.setText("Error: " + error.message)
        enableControls()
      }
    }

    function increaseBet() {
      if (isSpinning) return

      currentBet += GAME_SETTINGS.betIncrement
      if (currentBet > balanceRef.current) currentBet = balanceRef.current
      if (currentBet <= 0) currentBet = GAME_SETTINGS.minBet

      // Update the input field
      const inputElement = document.querySelector('input[type="number"]')
      if (inputElement) {
        inputElement.value = currentBet
      }
    }

    function decreaseBet() {
      if (isSpinning) return

      currentBet -= GAME_SETTINGS.betIncrement
      if (currentBet < GAME_SETTINGS.minBet) currentBet = GAME_SETTINGS.minBet

      // Update the input field
      const inputElement = document.querySelector('input[type="number"]')
      if (inputElement) {
        inputElement.value = currentBet
      }
    }

    function update() {
      // Any per-frame updates can go here
    }

    // Clean up on unmount
    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, []);

  // Update the JSX structure to ensure the gradient background is applied correctly
  return (
    <div className="slots-container">
      {!user ? (
        <div className="auth-message">
          <p>Please sign in to play!</p>
        </div>
      ) : (
        <>
          <div id="slots-container" className="slots-game"></div>
          {gameStatus !== "Game ready" && (
            <div className="game-status">
              <p>{gameStatus}</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Slots;
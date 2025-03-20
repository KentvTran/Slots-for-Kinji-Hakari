"use client"

import { useEffect, useRef, useState } from "react"
import Phaser from "phaser"
import "./Slots.scss"

const Slots = () => {
  const gameRef = useRef(null)
  const [gameStatus, setGameStatus] = useState("Loading...")

  useEffect(() => {
    // Game constants
    const GAME_CONFIG = {
      width: 800,
      height: 600,
      backgroundColor: "#ff69b4",
    }

    const REEL_CONFIG = {
      count: 3,
      symbolsPerReel: 3,
      width: 130,
      spacing: 150,
      startX: -150,
      symbolWidth: 110,
      symbolHeight: 60,
    }

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
    }

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
    }

    const GAME_SETTINGS = {
      initialBalance: 1000,
      initialBet: 50,
      minBet: 10,
      betIncrement: 10,
      winChance: 0.3,
    }

    // Game variables
    let isSpinning = false
    const reels = []
    let resultText
    let balanceText
    let betText
    let balance = GAME_SETTINGS.initialBalance
    let currentBet = GAME_SETTINGS.initialBet
    let winAmount = 0
    let leverHandle
    let betUpButton
    let betDownButton

    // Clear any existing game instance
    if (gameRef.current) {
      gameRef.current.destroy(true)
      gameRef.current = null
    }

    // Create a new game configuration
    const config = {
      type: Phaser.AUTO,
      parent: "slots-container",
      width: GAME_CONFIG.width,
      height: GAME_CONFIG.height,
      backgroundColor: GAME_CONFIG.backgroundColor,
      scene: {
        preload: preload,
        create: create,
        update: update,
      },
    }

    try {
      // Create the game instance
      gameRef.current = new Phaser.Game(config)
      setGameStatus("Game loaded")

      // Add a global error handler
      window.addEventListener("error", (e) => {
        console.error("Game error:", e)
        setGameStatus("Error: " + e.message)
      })
    } catch (error) {
      console.error("Failed to initialize game:", error)
      setGameStatus("Failed to initialize: " + error.message)
    }

    function preload() {
      try {
        // Load the character images from the assets folder
        SYMBOLS.names.forEach((symbol) => {
          this.load.image(symbol, `/src/assets/${symbol}.png`)
        })

        // Add error handling for image loading
        this.load.on("loaderror", (fileObj) => {
          console.error("Error loading asset:", fileObj.src)
          setGameStatus(`Error loading: ${fileObj.key}`)
        })

        setGameStatus("Assets loaded")
      } catch (error) {
        console.error("Error in preload:", error)
        setGameStatus("Preload error: " + error.message)
      }
    }

    function create() {
      try {
        createMachineBody.call(this)
        createReels.call(this)
        createLever.call(this)
        createBetControls.call(this)
        createTextDisplays.call(this)
        createSymbolLegend.call(this)

        setGameStatus("Game ready")
      } catch (error) {
        console.error("Error in create:", error)
        setGameStatus("Create error: " + error.message)
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
      // Create a mask for the reels
      const maskGraphics = this.make.graphics()
      maskGraphics.fillStyle(0xffffff)
      maskGraphics.fillRect(175, 160, 450, 180)
      const reelMask = maskGraphics.createGeometryMask()

      // Create reel container that will be masked
      const reelContainer = this.add.container(GAME_CONFIG.width / 2, 250)
      reelContainer.setMask(reelMask)

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
        .text(GAME_CONFIG.width / 2, 380, `Balance: $${balance}`, {
          fontSize: "24px",
          fill: "#ffffff",
          fontFamily: "Arial",
          fontWeight: "bold",
          stroke: "#000000",
          strokeThickness: 3,
        })
        .setOrigin(0.5)

      betText = this.add
        .text(GAME_CONFIG.width / 2, 520, `Bet: $${currentBet}`, {
          fontSize: "20px",
          fill: "#ffffff",
          fontFamily: "Arial",
          stroke: "#000000",
          strokeThickness: 2,
        })
        .setOrigin(0.5)

      resultText = this.add
        .text(GAME_CONFIG.width / 2, 150, "", {
          fontSize: "32px",
          fill: "#ffd700",
          fontFamily: "Arial",
          fontWeight: "bold",
          stroke: "#000000",
          strokeThickness: 4,
        })
        .setOrigin(0.5)
    }

    // Create the symbol legend
    function createSymbolLegend() {
      this.add.text(650, 380, "SYMBOLS:", {
        fontSize: "16px",
        fill: "#ffffff",
        fontFamily: "Arial",
        fontWeight: "bold",
      })

      let legendY = 410
      for (const symbol of SYMBOLS.names) {
        this.add.text(650, legendY, `${SYMBOLS.labels[symbol]}: x${SYMBOLS.prizes[symbol]}`, {
          fontSize: "14px",
          fill: "#ffffff",
          fontFamily: "Arial",
        })
        legendY += 20
      }
    }

    // Helper function to get a random symbol
    function getRandomSymbol() {
      return SYMBOLS.names[Math.floor(Math.random() * SYMBOLS.names.length)]
    }

    function pullLever() {
      try {
        if (isSpinning) return

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
        if (balance < currentBet) {
          resultText.setText("Not enough funds!")
          resultText.setFill("#ff0000")
          setTimeout(() => {
            resultText.setText("")
          }, 2000)
          return
        }

        // Deduct bet from balance
        balance -= currentBet
        balanceText.setText(`Balance: $${balance}`)

        isSpinning = true
        resultText.setText("")

        // Disable buttons during spin
        leverHandle.disableInteractive()
        betUpButton.disableInteractive()
        betDownButton.disableInteractive()

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
          balance += winAmount

          // Update UI
          balanceText.setText(`Balance: $${balance}`)
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
      if (currentBet > balance) currentBet = balance
      if (currentBet <= 0) currentBet = GAME_SETTINGS.minBet

      betText.setText(`Bet: $${currentBet}`)
    }

    function decreaseBet() {
      if (isSpinning) return

      currentBet -= GAME_SETTINGS.betIncrement
      if (currentBet < GAME_SETTINGS.minBet) currentBet = GAME_SETTINGS.minBet

      betText.setText(`Bet: $${currentBet}`)
    }

    function update() {
      // Any per-frame updates can go here
    }

    // Clean up on unmount
    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true)
        gameRef.current = null
      }
    }
  }, [])

  return (
    <div className="slots-container">
      <div id="slots-container" className="slots-game"></div>
      {gameStatus !== "Game ready" && (
        <div className="game-status">
          <p>{gameStatus}</p>
        </div>
      )}
    </div>
  )
}

export default Slots


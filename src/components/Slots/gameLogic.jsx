// Get a random symbol
export function getRandomSymbol(symbols) {
  return symbols[Math.floor(Math.random() * symbols.length)]
}

// Update a symbol with a new texture while maintaining its size
export function updateSymbol(symbol, newSymbolName, symbolWidth, symbolHeight, symbolLabels) {
  if (symbol.type === "Image") {
    symbol.setTexture(newSymbolName)
    // Ensure the size stays consistent
    symbol.setDisplaySize(symbolWidth, symbolHeight)
  } else {
    symbol.setText(symbolLabels[newSymbolName])
  }
  symbol.name = newSymbolName
}

// Check if player has won and calculate winnings
export function calculateWinnings(centerSymbols, currentBet, symbolPrizes) {
  // Check if all symbols match
  const firstSymbol = centerSymbols[0].name
  const allMatch = centerSymbols.every((symbol) => symbol.name === firstSymbol)

  if (allMatch) {
    // Player wins!
    return currentBet * symbolPrizes[firstSymbol]
  }

  // Player loses
  return 0
}

// Validate and adjust bet amount
export function validateBet(bet, minBet, balance) {
  if (isNaN(bet) || bet < minBet) {
    return minBet
  } else if (bet > balance) {
    return balance
  }
  return bet
}

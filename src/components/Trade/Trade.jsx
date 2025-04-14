import { useState } from "react"
import "./Trade.scss"

const TRADE_ITEMS = [
  { 
    id: 1, 
    name: "Neon Warrior", 
    value: 1500, 
    category: "Character",
    rarity: "Epic"
  },
  { 
    id: 2, 
    name: "Cyber Crown", 
    value: 800, 
    category: "Accessory",
    rarity: "Rare"
  },
  { 
    id: 3, 
    name: "Victory Dance", 
    value: 500, 
    category: "Animation",
    rarity: "Rare"
  },
  { 
    id: 4, 
    name: "Night City", 
    value: 1200, 
    category: "Background",
    rarity: "Epic"
  },
  { 
    id: 5, 
    name: "Plasma Trail", 
    value: 300, 
    category: "Effect",
    rarity: "Rare"
  },
  { 
    id: 6, 
    name: "Shadow Assassin", 
    value: 2000, 
    category: "Character",
    rarity: "Legendary"
  },
  { 
    id: 7, 
    name: "Dragon Wings", 
    value: 1500, 
    category: "Accessory",
    rarity: "Legendary"
  },
  { 
    id: 8, 
    name: "Teleport Effect", 
    value: 400, 
    category: "Animation",
    rarity: "Epic"
  }
];

const Trade = () => {
  const [creditAmount, setCreditAmount] = useState(5000)
  const [selectedItem, setSelectedItem] = useState(null)
  const [offerAmount, setOfferAmount] = useState("")
  const [filter, setFilter] = useState("all")

  // Placeholder for item selection function
  const handleItemSelection = (item) => {
    // Implement item selection functionality here
  }

  // Placeholder for offer input change function
  const handleOfferChange = (e) => {
    // Implement offer input change functionality here
  }

  // Placeholder for trade confirmation function
  const handleTradeConfirm = () => {
    // Implement trade confirmation functionality here
  }

  // Placeholder for filtering trade items
  const filteredItems = filter === "all" 
    ? TRADE_ITEMS 
    : TRADE_ITEMS.filter(item => item.category.toLowerCase() === filter.toLowerCase())

  return (
    <div className="trade-container">
      <div className="trade-header">
        <div className="credits-section">
        </div>
      </div>
      <div className="trade-content">
        <div className="trade-section">
          <div className="section-header">
            <h2 className="available-trade">AVAILABLE TRADES</h2>
            <div className="filter-buttons">
              <button 
                className={filter === 'all' ? 'active' : ''} 
                onClick={() => setFilter('all')}
              >
                All
              </button>
              <button 
                className={filter === 'character' ? 'active' : ''} 
                onClick={() => setFilter('character')}
              >
                Characters
              </button>
              <button 
                className={filter === 'accessory' ? 'active' : ''} 
                onClick={() => setFilter('accessory')}
              >
                Accessories
              </button>
              <button 
                className={filter === 'animation' ? 'active' : ''} 
                onClick={() => setFilter('animation')}
              >
                Animations
              </button>
              <button 
                className={filter === 'background' ? 'active' : ''} 
                onClick={() => setFilter('background')}
              >
                Backgrounds
              </button>
              <button 
                className={filter === 'effect' ? 'active' : ''} 
                onClick={() => setFilter('effect')}
              >
                Effects
              </button>
            </div>
          </div>

          <div className="items-grid">
            {filteredItems.map((item) => (
              <div 
                key={item.id}
                className={`trade-item ${item.rarity.toLowerCase()} ${selectedItem?.id === item.id ? 'selected' : ''}`}
                onClick={() => handleItemSelection(item)}
              >
                <div className="item-content">
                  <h3>{item.name}</h3>
                  <p className="item-category">{item.category}</p>
                  <p className="item-rarity">{item.rarity}</p>
                  <p className="item-value">{item.value.toLocaleString()} Credits</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="trade-form">
          <h2>Make Your Offer</h2>
          {selectedItem ? (
            <>
              <div className="selected-item-info">
                <h3>Selected: {selectedItem.name}</h3>
                <p className="item-details">
                  <span className="category">{selectedItem.category}</span>
                  <span className="rarity">{selectedItem.rarity}</span>
                </p>
                <p className="suggested-value">Suggested Value: {selectedItem.value.toLocaleString()} Credits</p>
              </div>
              
              <div className="offer-input">
                <label htmlFor="offerAmount">Your Offer (Credits):</label>
                <input
                  id="offerAmount"
                  type="text"
                  value={offerAmount}
                  onChange={handleOfferChange}
                  placeholder="Enter amount"
                />
              </div>

              <button 
                className="confirm-button"
                onClick={handleTradeConfirm}
                disabled={!offerAmount || parseInt(offerAmount) <= 0}
              >
                Confirm Trade
              </button>
            </>
          ) : (
            <p className="select-prompt">Trade Center</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default Trade

import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db, auth } from "../../firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { shopItems } from "../Shop/shopData";
import "./Trade.scss";

const Trade = () => {
  const [creditAmount, setCreditAmount] = useState(5000);
  const [selectedItem, setSelectedItem] = useState(null);
  const [offerAmount, setOfferAmount] = useState("");
  const [filter, setFilter] = useState("all");
  const allShopItems = [...shopItems.featured, ...shopItems.daily];
  const [userItems, setUserItems] = useState([]);
  const [activeTab, setActiveTab] = useState("availableTrades");

  const getFilteredItems = () => {
    if (filter === "all") return allShopItems;
    return allShopItems.filter((item) => item.category === filter);
  };

  const filteredItems = getFilteredItems();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const data = userSnap.data();
          setCreditAmount(data.credits || 0);

          const userItemIds = data.items || [];
          const matchedItems = allShopItems.filter((item) =>
            userItemIds.includes(item.id)
          );
          setUserItems(matchedItems); 
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const handleItemSelection = (item) => {
    setSelectedItem(item);
  };

  const handleOfferChange = (e) => {
    setOfferAmount(e.target.value); // ✅ Fix: use value instead of price
  };

  const handleTradeConfirm = () => {
    if (selectedItem && offerAmount) {
      alert(`You offered ${offerAmount} credits for ${selectedItem.name}`);
      // TODO: Submit this offer or update Firestore if needed
    }
  };

  return (
    <div className="trade-container">
      <div className="trade-header">
        <div className="credits-section">
          <h3>Your Credits: {creditAmount.toLocaleString()}</h3>
        </div>
      </div>
      
    <div className="trade-content-wrapper">
    {/* Left Side: Items Grid */}
    <div className="trade-section">
      <div className="section-header">
        <h2 className="available-trade">AVAILABLE TRADES</h2>
        <div className="filter-buttons">

          {["all", "Chill", "Ight", "Legendary", "Special"].map((cat) => (
            <button
              key={cat}
              className={filter === cat ? "active" : ""}
              onClick={() => setFilter(cat)}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
              {cat === "all" ? "" : "s"}
            </button> 
          ))}
 < div className="trade-tabs">
      <button
        className={activeTab === "availableTrades" ? "active" : ""}
        onClick={() => setActiveTab("availableTrades")}
      >
        Available Trades
      </button>
      <button
        className={activeTab === "myItems" ? "active" : ""}
        onClick={() => setActiveTab("myItems")}
      >
        My Items
      </button>
    </div>
        </div>

      </div>

      <div className="items-grid">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className={`trade-item ${selectedItem?.id === item.id ? "selected" : ""}`}
            onClick={() => handleItemSelection(item)}
          >
            <div className="item-content">
              {item.image && (
                <img src={item.image} alt={item.name} className="item-image" />
              )}
              <h3>{item.name}</h3>
              <p className="item-category">{item.category}</p>
              <p className="item-price">{item.price.toLocaleString()} Credits</p>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Right Side: Trade Form */}
    <div className="trade-form">
      <h2>Make Your Offer</h2>
      {selectedItem ? (
        <>
          <div className="selected-item-info">
            <h3>Selected: {selectedItem.name}</h3>
            <p className="item-details">
              <span className="category">{selectedItem.category}</span>
            </p>
            <p className="suggested-value">
              Suggested Value: {(selectedItem.value ?? selectedItem.price).toLocaleString()} Credits
            </p>
          </div>

          {offerAmount && parseInt(offerAmount) > 0 && (
            <div className="selected-to-offer">
              <h3>Your Offer</h3>
              <p className="trade-value">{parseInt(offerAmount).toLocaleString()} Credits</p>
              <p className="exchange-rate">
                Exchange Rate: {(
                  parseInt(offerAmount) / (selectedItem.value ?? selectedItem.price)
                ).toFixed(2)}x
              </p>
            </div>
          )}

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

  );
};

export default Trade;

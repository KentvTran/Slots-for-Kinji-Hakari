import { useState, useEffect } from "react"
import { doc, getDoc, updateDoc, arrayUnion, increment } from "firebase/firestore"
import { onAuthStateChanged } from "firebase/auth"
import { db, auth } from "../../firebase/firebase" // Adjust path if needed
import "./Shop.scss"

// Import all item images
import chaewonCoin from "../../assets/items/chaewon_coin.jpg"
import gojoEyes from "../../assets/items/gojo_eyes.jpg"
import fortnitePick from "../../assets/items/fortnite_pickaxe.jpg"
import mcFlintSteel from "../../assets/items/mc_flint&steel.png"
import triforce from "../../assets/items/triforce.jpg"
import orangeCreamGhost from "../../assets/items/orangecream_ghost.jpg"
import ekkoBeaters from "../../assets/items/ekko_beaters.png"
import gtaDiamondCasino from "../../assets/items/diamond_casino.jpg"
import joelGolf from "../../assets/items/golf_club.jpg"
import joeItalianIce from "../../assets/items/italian_ice.jpg"
import jinxSheriff from "../../assets/items/jinx_sheriff.jpg"

const PER_CHAEWON_COIN_PRICE = 50000

const Shop = () => {
  const [creditAmount, setCreditAmount] = useState(0)
  const [userId, setUserId] = useState(null)
  const [userItems, setUserItems] = useState([])
  const [userChaewonCoins, setUserChaewonCoins] = useState(0)
  const [loading, setLoading] = useState(true)
  const [purchaseStatus, setPurchaseStatus] = useState({ show: false, message: "", success: true })
  const [chaewonQuantity, setChaewonQuantity] = useState(1)

  // Define all shop items
  const shopItems = {
    featured: [
      {
        id: "battle_pass",
        name: "BATTLE PASS",
        price: 10000,
        category: "Special",
        image: null,
        isBattlePass: true,
      },
      {
        id: "chaewon_coin",
        name: "Chaewon Coins",
        price: PER_CHAEWON_COIN_PRICE,
        category: "Legendary",
        image: chaewonCoin,
      },
      {
        id: "italian_ice",
        name: "Joe's Italian Ice",
        price: 1000,
        category: "Chill",
        image: joeItalianIce,
      }
    ],
    daily: [
      {
        id: "gojo_eyes",
        name: "Gojo Eyes",
        price: 1000,
        category: "Chill",
        image: gojoEyes,
      },
      {
        id: "fortnite_pickaxe",
        name: "Fortnite Pickaxe",
        price: 800,
        category: "Ight",
        image: fortnitePick,
      },
      {
        id: "mc_flint_steel",
        name: "Minecraft Flint & Steel",
        price: 800,
        category: "Ight",
        image: mcFlintSteel,
      },
      {
        id: "triforce",
        name: "Trinity Triforce",
        price: 1000,
        category: "Chill",
        image: triforce,
      },
      {
        id: "orange_cream_ghost",
        name: "Orange Cream Ghost Energy",
        price: 1000,
        category: "Chill",
        image: orangeCreamGhost,
      },
      {
        id: "ekko_beaters",
        name: "Ekkovision Beaters",
        price: 800,
        category: "Ight",
        image: ekkoBeaters,
      },
      {
        id: "gta_diamond_casino",
        name: "GTA Diamond Casino",
        price: 1000,
        category: "Chill",
        image: gtaDiamondCasino,
      },
      {
        id: "golf_club",
        name: "Joel's Golf Club",
        price: 800,
        category: "Ight",
        image: joelGolf,
      },
      {
        id: "jinx_sheriff",
        name: "Jinx's Sheriff",
        price: 800,
        category: "Ight",
        image: jinxSheriff,
      }
    ],
  }

  const allItemIds = [
    ...shopItems.featured.filter((item) => !item.isBattlePass).map((item) => item.id),
    ...shopItems.daily.map((item) => item.id),
  ]

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid)
        fetchUserData(user.uid)
      } else {
        setLoading(false)
        setCreditAmount(1000)
        setUserItems([])
        setUserChaewonCoins(0)
      }
    })

    return () => unsubscribe()
  }, [])

  const fetchUserData = async (uid) => {
    try {
      const userRef = doc(db, "users", uid)
      const userSnap = await getDoc(userRef)

      if (userSnap.exists()) {
        const data = userSnap.data()
        setCreditAmount(data.credits || 1000)
        setUserItems(data.items || [])
        setUserChaewonCoins(data.chaewon_coin || 0)
      } else {
        await updateDoc(userRef, {
          credits: 1000,
          items: [],
          chaewon_coin: 0,
        })
        setCreditAmount(1000)
        setUserItems([])
        setUserChaewonCoins(0)
      }
    } catch (error) {
      console.error("Error fetching user data:", error)
    } finally {
      setLoading(false)
    }
  }

  const showTempStatus = (message, success = true) => {
    setPurchaseStatus({ show: true, message, success })
    setTimeout(() => setPurchaseStatus({ show: false, message: "", success: true }), 3000)
  }

  const purchaseChaewonCoins = async () => {
    if (!userId) return showTempStatus("Please log in to make purchases", false)
    const qty = Math.max(1, Number(chaewonQuantity))
    const totalCost = qty * PER_CHAEWON_COIN_PRICE
    if (creditAmount < totalCost) return showTempStatus("Not enough credits", false)

    try {
      const userRef = doc(db, "users", userId)
      await updateDoc(userRef, {
        credits: creditAmount - totalCost,
        chaewon_coin: increment(qty),
      })
      setCreditAmount((prev) => prev - totalCost)
      setUserChaewonCoins((prev) => prev + qty)
      showTempStatus(`Purchased ${qty} Chaewon Coin${qty > 1 ? "s" : ""}!`, true)
    } catch (error) {
      console.error(error)
      showTempStatus("Error purchasing coins. Please try again.", false)
    }
  }

  const purchaseItem = async (itemId, price, isBattlePass = false) => {
    if (itemId === "chaewon_coin") {
      return purchaseChaewonCoins()
    }
    if (!userId) return showTempStatus("Please log in to make purchases", false)
    if (userItems.includes(itemId)) return showTempStatus("You already own this item", false)
    if (creditAmount < price) return showTempStatus("Not enough credits", false)

    try {
      const userRef = doc(db, "users", userId)
      if (isBattlePass) {
        const newItems = allItemIds.filter((id) => !userItems.includes(id))
        await updateDoc(userRef, {
          credits: creditAmount - price,
          items: arrayUnion(...newItems),
        })
        setCreditAmount((prev) => prev - price)
        setUserItems((prev) => [...prev, ...newItems])
        showTempStatus("Battle Pass purchased! All items unlocked!", true)
      } else {
        await updateDoc(userRef, {
          credits: creditAmount - price,
          items: arrayUnion(itemId),
        })
        setCreditAmount((prev) => prev - price)
        setUserItems((prev) => [...prev, itemId])
        showTempStatus("Item purchased successfully!", true)
      }
    } catch (error) {
      console.error("Error purchasing item:", error)
      showTempStatus("Error purchasing item. Please try again.", false)
    }
  }

  const userOwnsItem = (itemId) => userItems.includes(itemId)

  return (
    <div className="shop-container">
      <div className="shop-header">
        <h1 className="shop-title">NIGHTMARKET</h1>
        <div className="credits-section">
          <div className="credits-display">{creditAmount.toLocaleString()} Credits</div>
          <div className="credits-display">{userChaewonCoins} Chaewon Coins</div>
          <button className="buy-credits-btn">Buy Credits</button>
        </div>
      </div>

      {purchaseStatus.show && (
        <div className={`purchase-status ${purchaseStatus.success ? "success" : "error"}`}>
          {purchaseStatus.message}
        </div>
      )}

      <div className="shop-content">
        <div className="shop-section">
          <div className="section-header">
            <h2>FEATURED ITEMS</h2>
          </div>
          <div className="featured-items">
            <div className="battle-pass-item">
              <div className="item-details">
                <h3>BATTLE PASS</h3>
                <div className="item-price">{shopItems.featured[0].price}</div>
                <button
                  className="purchase-btn"
                  onClick={() => purchaseItem(shopItems.featured[0].id, shopItems.featured[0].price, true)}
                  disabled={loading}
                >
                  Purchase
                </button>
              </div>
            </div>
            {shopItems.featured.slice(1).map((item) =>
              item.id === "chaewon_coin" ? (
                <div
                  key={item.id}
                  className="regular-item legendary"
                  style={{
                    backgroundImage: `url(${item.image})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  <div className="item-details">
                    <h3>{item.name}</h3>
                    <p className="item-category">{item.category}</p>
                    <div className="item-price">{PER_CHAEWON_COIN_PRICE.toLocaleString()} / coin</div>

                    {/* Redesigned input field with label */}
                    <div className="quantity-container">
                      <label htmlFor="chaewon-quantity" className="sr-only">
                        Quantity
                      </label>
                      <input
                        id="chaewon-quantity"
                        type="number"
                        min={1}
                        value={chaewonQuantity}
                        onChange={(e) => setChaewonQuantity(e.target.value)}
                        className="quantity-input"
                        aria-label="Quantity"
                      />
                      <button className="purchase-btn" onClick={() => purchaseItem(item.id)} disabled={loading}>
                        Buy {chaewonQuantity}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  key={item.id}
                  className={`regular-item ${item.category.toLowerCase()}`}
                  style={{
                    backgroundImage: `url(${item.image})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  <div className="item-details">
                    <h3>{item.name}</h3>
                    <p className="item-category">{item.category}</p>
                    <div className="item-price">{item.price.toLocaleString()}</div>
                    {userOwnsItem(item.id) ? (
                      <button className="owned-btn" disabled>
                        Owned
                      </button>
                    ) : (
                      <button
                        className="purchase-btn"
                        onClick={() => purchaseItem(item.id, item.price)}
                        disabled={loading}
                      >
                        Purchase
                      </button>
                    )}
                  </div>
                </div>
              ),
            )}
          </div>
        </div>

        {/* Daily Items Section */}
        <div className="shop-section">
          <div className="section-header">
            <h2>ITEMS</h2>
          </div>

          <div className="daily-items">
            {/* Daily Items */}
            {shopItems.daily.map((item) => (
              <div
                key={item.id}
                className={`daily-item ${item.category.toLowerCase()}`}
                style={
                  item.image
                    ? { backgroundImage: `url(${item.image})`, backgroundSize: "cover", backgroundPosition: "center" }
                    : {}
                }
              >
                <div className="item-details">
                  <h3>{item.name}</h3>
                  <p className="item-category">{item.category}</p>
                  <div className="item-price">{item.price.toLocaleString()}</div>
                  {userOwnsItem(item.id) ? (
                    <button className="owned-btn" disabled>
                      Owned
                    </button>
                  ) : (
                    <button
                      className="purchase-btn"
                      onClick={() => purchaseItem(item.id, item.price)}
                      disabled={loading}
                    >
                      Purchase
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Shop

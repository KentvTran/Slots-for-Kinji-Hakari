"use client"

import { useState, useEffect } from "react"
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore"
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

const Shop = () => {
  const [creditAmount, setCreditAmount] = useState(0)
  const [userId, setUserId] = useState(null)
  const [userItems, setUserItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [purchaseStatus, setPurchaseStatus] = useState({ show: false, message: "", success: true })

  // Define all shop items
  const shopItems = {
    featured: [
      {
        id: "battle_pass",
        name: "BATTLE PASS",
        price: 950,
        category: "Special",
        image: null,
        isBattlePass: true,
      },
      {
        id: "chaewon_coin",
        name: "Chaewon Coins",
        price: 1500,
        category: "Legendary",
        image: chaewonCoin,
      },
      {
        id: "gojo_eyes",
        name: "Gojo Eyes",
        price: 800,
        category: "Chill",
        image: gojoEyes,
      },
    ],
    daily: [
      {
        id: "fortnite_pickaxe",
        name: "Fortnite Pickaxe",
        price: 500,
        category: "Ight",
        image: fortnitePick,
      },
      {
        id: "mc_flint_steel",
        name: "Minecraft Flint & Steel",
        price: 400,
        category: "Ight",
        image: mcFlintSteel,
      },
      {
        id: "triforce",
        name: "Trinity Triforce LoL",
        price: 1200,
        category: "Chill",
        image: triforce,
      },
      {
        id: "orange_cream_ghost",
        name: "Orange Cream Ghost Energy",
        price: 800,
        category: "Dope",
        image: orangeCreamGhost,
      },
      {
        id: "ekko_beaters",
        name: "Ekkovision Beaters",
        price: 500,
        category: "Ight",
        image: ekkoBeaters,
      },
    ],
  }

  // Get all item IDs for battle pass
  const allItemIds = [
    ...shopItems.featured.filter((item) => !item.isBattlePass).map((item) => item.id),
    ...shopItems.daily.map((item) => item.id),
  ]

  // Fetch user data from Firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid)
        fetchUserData(user.uid)
      } else {
        setLoading(false)
        // Handle not logged in state
        setCreditAmount(1000) // Default credits for demo
        setUserItems([])
      }
    })

    return () => unsubscribe()
  }, [])

  const fetchUserData = async (uid) => {
    try {
      const userRef = doc(db, "users", uid)
      const userSnap = await getDoc(userRef)

      if (userSnap.exists()) {
        const userData = userSnap.data()
        setCreditAmount(userData.credits || 1000)
        setUserItems(userData.items || [])
      } else {
        // Create user document if it doesn't exist
        await updateDoc(userRef, {
          credits: 1000,
          items: [],
        })
        setCreditAmount(1000)
        setUserItems([])
      }
    } catch (error) {
      console.error("Error fetching user data:", error)
    } finally {
      setLoading(false)
    }
  }

  // Purchase item function
  const purchaseItem = async (itemId, price, isBattlePass = false) => {
    if (!userId) {
      setPurchaseStatus({
        show: true,
        message: "Please log in to make purchases",
        success: false,
      })
      setTimeout(() => setPurchaseStatus({ show: false, message: "", success: true }), 3000)
      return
    }

    if (userItems.includes(itemId)) {
      setPurchaseStatus({
        show: true,
        message: "You already own this item",
        success: false,
      })
      setTimeout(() => setPurchaseStatus({ show: false, message: "", success: true }), 3000)
      return
    }

    if (creditAmount < price) {
      setPurchaseStatus({
        show: true,
        message: "Not enough credits",
        success: false,
      })
      setTimeout(() => setPurchaseStatus({ show: false, message: "", success: true }), 3000)
      return
    }

    try {
      const userRef = doc(db, "users", userId)

      if (isBattlePass) {
        // Add all items and subtract battle pass price
        const newItems = allItemIds.filter((id) => !userItems.includes(id))
        await updateDoc(userRef, {
          credits: creditAmount - price,
          items: arrayUnion(...newItems),
        })

        // Update local state
        setCreditAmount((prev) => prev - price)
        setUserItems((prev) => [...prev, ...newItems])

        setPurchaseStatus({
          show: true,
          message: "Battle Pass purchased! All items unlocked!",
          success: true,
        })
      } else {
        // Add single item and subtract its price
        await updateDoc(userRef, {
          credits: creditAmount - price,
          items: arrayUnion(itemId),
        })

        // Update local state
        setCreditAmount((prev) => prev - price)
        setUserItems((prev) => [...prev, itemId])

        setPurchaseStatus({
          show: true,
          message: "Item purchased successfully!",
          success: true,
        })
      }
    } catch (error) {
      console.error("Error purchasing item:", error)
      setPurchaseStatus({
        show: true,
        message: "Error purchasing item. Please try again.",
        success: false,
      })
    }

    setTimeout(() => setPurchaseStatus({ show: false, message: "", success: true }), 3000)
  }

  // Check if user owns an item
  const userOwnsItem = (itemId) => {
    return userItems.includes(itemId)
  }

  return (
    <div className="shop-container">
      {/* Top Navigation */}
      <div className="shop-header">
        <h1 className="shop-title">NIGHTMARKET</h1>
        <div className="credits-section">
          <div className="credits-display">{creditAmount.toLocaleString()} Credits</div>
          <button className="buy-credits-btn">Buy Credits</button>
        </div>
      </div>

      {/* Purchase Status Message */}
      {purchaseStatus.show && (
        <div className={`purchase-status ${purchaseStatus.success ? "success" : "error"}`}>
          {purchaseStatus.message}
        </div>
      )}

      {/* Main Shop Content */}
      <div className="shop-content">
        {/* Featured Items Section */}
        <div className="shop-section">
          <div className="section-header">
            <h2>FEATURED ITEMS</h2>
          </div>

          <div className="featured-items">
            {/* Battle Pass - Larger Box */}
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

            {/* Regular Featured Items */}
            {shopItems.featured.slice(1).map((item) => (
              <div
                key={item.id}
                className={`regular-item ${item.category.toLowerCase()}`}
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

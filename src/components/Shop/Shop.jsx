"use client"

import { useState } from "react"
import "./Shop.scss"

const Shop = () => {
  const [creditAmount, setCreditAmount] = useState(1000) //connect to firebase later on

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
                <div className="item-price">950</div>
                <button className="purchase-btn">Purchase</button>
              </div>
            </div>

            {/* Regular Items */}
            <div className="regular-item character">
              <div className="item-details">
                <h3>ITEM 1</h3>
                <p className="item-category">Character</p>
                <div className="item-price">1,500</div>
              </div>
            </div>

            <div className="regular-item accessory">
              <div className="item-details">
                <h3>ITEM 2</h3>
                <p className="item-category">Accessory</p>
                <div className="item-price">800</div>
              </div>
            </div>
          </div>
        </div>

        {/* Daily Items Section */}
        <div className="shop-section">
          <div className="section-header">
            <h2>ITEMS</h2>
          </div>

          <div className="daily-items">
            {/* Daily Items */}
            <div className="daily-item animation">
              <div className="item-details">
                <h3>ITEM 3</h3>
                <p className="item-category">Animation</p>
                <div className="item-price">500</div>
              </div>
            </div>

            <div className="daily-item background">
              <div className="item-details">
                <h3>ITEM 4</h3>
                <p className="item-category">Background</p>
                <div className="item-price">400</div>
              </div>
            </div>

            <div className="daily-item effect">
              <div className="item-details">
                <h3>ITEM 5</h3>
                <p className="item-category">Effect</p>
                <div className="item-price">300</div>
              </div>
            </div>

            <div className="daily-item character">
              <div className="item-details">
                <h3>ITEM 6</h3>
                <p className="item-category">Character</p>
                <div className="item-price">1,200</div>
              </div>
            </div>

            <div className="daily-item animation">
              <div className="item-details">
                <h3>ITEM 7</h3>
                <p className="item-category">Animation</p>
                <div className="item-price">800</div>
              </div>
            </div>

            <div className="daily-item accessory">
              <div className="item-details">
                <h3>ITEM 8</h3>
                <p className="item-category">Accessory</p>
                <div className="item-price">500</div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}

export default Shop


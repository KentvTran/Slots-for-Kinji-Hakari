import React, { useState } from 'react';
import './Shop.scss';

const Shop = () => {
    const [creditAmount, setCreditAmount] = useState(100); // Default credit amount

    return (
        <div className="shop-container">
            <h1 className="shop-title">Game Store</h1>
            <p className="shop-subtitle">Purchase in-game items and credits</p>

            <div className="shop-items">
                {/* Credit Purchase */}
                <div className="shop-item">
                    <div className="item-content">
                        <div className="item-image-placeholder"></div>
                        <h2>Credits</h2>
                        <p className="item-price">${(creditAmount / 100).toFixed(2)}</p>
                        <input 
                            type="number" 
                            className="credit-input"
                            min="100" 
                            step="100" 
                            value={creditAmount} 
                            onChange={(e) => setCreditAmount(Number(e.target.value))}
                        />
                        <button className="buy-button">Buy</button>
                    </div>
                </div>

                {/* Battle Pass */}
                <div className="shop-item">
                    <div className="item-content">
                        <div className="item-image-placeholder"></div>
                        <h2>Battle Pass</h2>
                        <p className="item-price">$9.99</p>
                        <button className="buy-button">Buy</button>
                    </div>
                </div>

                {/* Skin */}
                <div className="shop-item">
                    <div className="item-content">
                        <div className="item-image-placeholder"></div>
                        <h2>Exclusive Skin</h2>
                        <p className="item-price">$4.99</p>
                        <button className="buy-button">Buy</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Shop;

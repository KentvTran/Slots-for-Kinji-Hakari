import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import './Slots.scss';

//need to update slots game to look more clean this is just code to get it working
const SlotsGame = () => {
  const gameRef = useRef(null); 

  useEffect(() => {
    const config = {
      type: Phaser.AUTO,
      parent: 'slots-container',
      width: 800,
      height: 600,
      backgroundColor: '#f5e6ff',
      scene: {
        create: create,
        update: update
      }
    };

    gameRef.current = new Phaser.Game(config);

    let isSpinning = false;
    let symbols = [];
    let winText = null; 
    const reelCount = 3;
    const symbolCount = 5;
    const symbolColors = [0xff6b6b, 0xffd166, 0x06d6a0, 0x118ab2, 0x073b4c]; 

    function create() {
      this.add.rectangle(400, 300, 600, 400, 0xdecfff).setStrokeStyle(4, 0xc8adff);
    
      const reelSpacing = 150;
      for (let i = 0; i < reelCount; i++) {
        symbols[i] = [];
        for (let j = 0; j < symbolCount; j++) {
          const x = 250 + i * reelSpacing;
          const y = 150 + j * 100;
          const symbol = this.add.rectangle(x, y, 80, 80, Phaser.Math.RND.pick(symbolColors))
            .setStrokeStyle(2, 0xffffff);
          symbols[i].push(symbol);
        }
      }

      const spinButton = this.add.rectangle(400, 500, 120, 60, 0xbaa2ff)
        .setStrokeStyle(2, 0xffffff)
        .setInteractive();
      
      this.add.text(400, 500, 'SPIN', {
        fontSize: '24px',
        fill: '#ffffff',
        fontFamily: 'Arial',
        fontWeight: 'bold'
      }).setOrigin(0.5);
      
      spinButton.on('pointerdown', startSpin, this);
    }

    function startSpin() {
      if (isSpinning) return;
      isSpinning = true;


      if (winText) {
        winText.destroy();
        winText = null;
      }

      for (let i = 0; i < reelCount; i++) {
        const reel = symbols[i];
        const delay = i * 300;
        
        this.time.delayedCall(delay, () => {
          reel.forEach(symbol => {
            this.tweens.add({
              targets: symbol,
              y: symbol.y + 100,
              duration: 100,
              repeat: 10,
              onComplete: () => {
                symbol.y -= 100 * 10;
                symbol.fillColor = Phaser.Math.RND.pick(symbolColors);
                if (i === reelCount - 1) {
                  isSpinning = false;
                  checkWin();
                }
              }
            });
          });
        });
      }
    }

    function checkWin() {
      const firstSymbol = symbols[0][0].fillColor;
      const allSame = symbols.every(reel => reel[0].fillColor === firstSymbol);
      
      if (allSame) {
        winText = this.add.text(400, 100, 'You Win!', { 
          fontSize: '48px', 
          fill: '#ff69b4',
          fontFamily: 'Arial',
          stroke: '#ffffff',
          strokeThickness: 4
        }).setOrigin(0.5);
      }
    }

    function update() {
     
    }

    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
      }
    };
  }, []);

  return <div id="slots-container" className="slots-game"></div>;
};

export default SlotsGame;
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

// export all shop items
export const PER_CHAEWON_COIN_PRICE = 50000
export const shopItems = {
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
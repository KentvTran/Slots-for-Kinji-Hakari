import { doc, getDoc, updateDoc, arrayUnion, setDoc } from "firebase/firestore"
import { db } from "../firebase" // Adjust path if needed

// Get user data
export const getUserData = async (uid) => {
  try {
    const userRef = doc(db, "users", uid)
    const userSnap = await getDoc(userRef)

    if (userSnap.exists()) {
      return userSnap.data()
    } else {
      // Create user document if it doesn't exist
      const defaultUserData = {
        credits: 1000,
        items: [],
      }
      await setDoc(userRef, defaultUserData)
      return defaultUserData
    }
  } catch (error) {
    console.error("Error fetching user data:", error)
    throw error
  }
}

// Update user credits
export const updateUserCredits = async (uid, newCreditAmount) => {
  try {
    const userRef = doc(db, "users", uid)
    await updateDoc(userRef, {
      credits: newCreditAmount,
    })
    return true
  } catch (error) {
    console.error("Error updating user credits:", error)
    throw error
  }
}

// Add item to user's inventory
export const addItemToUser = async (uid, itemId, itemPrice) => {
  try {
    const userRef = doc(db, "users", uid)
    const userSnap = await getDoc(userRef)

    if (userSnap.exists()) {
      const userData = userSnap.data()

      // Check if user already has the item
      if (userData.items && userData.items.includes(itemId)) {
        return { success: false, message: "You already own this item" }
      }

      // Check if user has enough credits
      if (userData.credits < itemPrice) {
        return { success: false, message: "Not enough credits" }
      }

      // Update user data
      await updateDoc(userRef, {
        credits: userData.credits - itemPrice,
        items: arrayUnion(itemId),
      })

      return {
        success: true,
        message: "Item purchased successfully!",
        newCredits: userData.credits - itemPrice,
      }
    } else {
      return { success: false, message: "User not found" }
    }
  } catch (error) {
    console.error("Error adding item to user:", error)
    throw error
  }
}

// Add multiple items to user (for battle pass)
export const addMultipleItemsToUser = async (uid, itemIds, totalPrice) => {
  try {
    const userRef = doc(db, "users", uid)
    const userSnap = await getDoc(userRef)

    if (userSnap.exists()) {
      const userData = userSnap.data()

      // Check if user has enough credits
      if (userData.credits < totalPrice) {
        return { success: false, message: "Not enough credits" }
      }

      // Filter out items the user already owns
      const userItems = userData.items || []
      const newItems = itemIds.filter((id) => !userItems.includes(id))

      if (newItems.length === 0) {
        return { success: false, message: "You already own all these items" }
      }

      // Update user data
      await updateDoc(userRef, {
        credits: userData.credits - totalPrice,
        items: arrayUnion(...newItems),
      })

      return {
        success: true,
        message: "Battle Pass purchased! All items unlocked!",
        newCredits: userData.credits - totalPrice,
      }
    } else {
      return { success: false, message: "User not found" }
    }
  } catch (error) {
    console.error("Error adding multiple items to user:", error)
    throw error
  }
}

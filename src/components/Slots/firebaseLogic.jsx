import { doc, updateDoc } from "firebase/firestore"
import { db } from "../../firebase/firebase"

// Update credits in Firestore
export const updateCredits = async (newBalance, user) => {
  try {
    if (user) {
      console.log("Updating credits for", user.uid, "to", newBalance)
      await updateDoc(doc(db, "users", user.uid), {
        credits: newBalance,
      })
    }
  } catch (error) {
    console.error("Error updating credits:", error)
  }
}

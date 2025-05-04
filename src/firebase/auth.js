import { 
    createUserWithEmailAndPassword, 
    sendEmailVerification, 
    sendPasswordResetEmail, 
    updatePassword, 
    signInWithEmailAndPassword, 
    signOut
} from "firebase/auth";
import { auth } from "./firebase";

export const doCreateUserWithEmailAndPassword = async (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
};

export const doSignInWithEmailAndPassword = async (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
};

export const doSignout = () => {
    return signOut(auth);
};

export const doPasswordReset = (email) => {
    return sendPasswordResetEmail(auth, email, {
      url: "http://localhost:5173/reset-password",
      handleCodeInApp: true,
    });
  };
//   youre gonna have to remove the hard coded url maybe later on

export const doPasswordChange = (password) => {
    return updatePassword(auth.currentUser, password);
};

export const doSendEmailVerification = () => {
    return sendEmailVerification(auth.currentUser, {
        url: `${window.location.origin}/home`,
    });
};

import React, { useEffect, useState, useContext } from "react";
import { auth } from "../../firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";

const AuthContext = React.createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const value = {
        user,
        loading,
        setUser,  // ✅ Add setUser so components can update it
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading ? children : <div>Loading...</div>}
        </AuthContext.Provider>
    );
}

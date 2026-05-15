import React, { createContext, useState, useEffect } from "react";
import { auth, db } from "../firebase/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export const AuthContext = createContext({
  user: null,
  role: null,
  authChecked: false,
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setUserRole] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

 useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
    if (fbUser) {
      const snap = await getDoc(doc(db, "users", fbUser.uid));
      console.log("AuthContext fetch role:", snap.exists(), snap.data());
      setUserRole(snap.exists() ? snap.data().role?.toLowerCase() : null);
      setUser(fbUser);
    } else {
      setUser(null);
      setUserRole(null);
    }
    setAuthChecked(true);
  });
  return unsubscribe;
}, []);


  return (
    <AuthContext.Provider value={{ user, role, authChecked }}>
      {children}
    </AuthContext.Provider>
  );
};

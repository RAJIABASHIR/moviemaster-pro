import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut, updateProfile } from "firebase/auth";
import { auth } from "../lib/firebase";
import AuthCtx from "./AuthContext";

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    return onAuthStateChanged(auth, (u) => {
      setUser(u);
      setReady(true);
    });
  }, []);

  const logout = () => signOut(auth);

  const updateUser = async (profile) => {
    if (!auth.currentUser) return;
    try {
      await updateProfile(auth.currentUser, profile);
      // Force refresh user state locally
      setUser({ ...auth.currentUser });
    } catch (e) {
      throw e;
    }
  };

  return (
    <AuthCtx.Provider value={{ user, ready, logout, updateUser }}>
      {children}
    </AuthCtx.Provider>
  );
}
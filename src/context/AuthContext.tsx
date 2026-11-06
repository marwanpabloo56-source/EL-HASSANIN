import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  onAuthStateChanged,
  signOut,
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db, handleFirestoreError, OperationType } from '../lib/firebase';

export interface AdminProfile {
  uid: string;
  email: string;
  name: string;
  role: 'OWNER' | 'ADMIN';
  createdAt: string;
  createdBy?: string;
}

interface AuthContextType {
  user: User | null;
  adminProfile: AdminProfile | null;
  loading: boolean;
  isOwner: boolean;
  isAdmin: boolean;
  isInitialized: boolean | null;
  checkInitializationStatus: () => Promise<boolean>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  adminProfile: null,
  loading: true,
  isOwner: false,
  isAdmin: false,
  isInitialized: null,
  checkInitializationStatus: async () => true,
  logout: async () => {},
  refreshProfile: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [adminProfile, setAdminProfile] = useState<AdminProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isInitialized, setIsInitialized] = useState<boolean | null>(null);

  // Check if system has an initialized OWNER record
  const checkInitializationStatus = async (): Promise<boolean> => {
    try {
      const initDoc = await getDoc(doc(db, 'settings', 'initialized'));
      const initialized = initDoc.exists();
      setIsInitialized(initialized);
      return initialized;
    } catch {
      // If error (e.g. offline or rules), default to assuming initialized to be safe
      return true;
    }
  };

  const fetchAdminProfile = async (uid: string) => {
    try {
      const snap = await getDoc(doc(db, 'admins', uid));
      if (snap.exists()) {
        const data = snap.data() as AdminProfile;
        setAdminProfile(data);
      } else {
        setAdminProfile(null);
      }
    } catch (err) {
      console.warn('Could not fetch admin profile:', err);
      setAdminProfile(null);
    }
  };

  const refreshProfile = async () => {
    if (auth.currentUser) {
      await fetchAdminProfile(auth.currentUser.uid);
    }
  };

  useEffect(() => {
    checkInitializationStatus();

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await fetchAdminProfile(currentUser.uid);
      } else {
        setAdminProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setAdminProfile(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const isOwner = adminProfile?.role === 'OWNER';
  const isAdmin = adminProfile?.role === 'ADMIN' || isOwner;

  return (
    <AuthContext.Provider
      value={{
        user,
        adminProfile,
        loading,
        isOwner,
        isAdmin,
        isInitialized,
        checkInitializationStatus,
        logout,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

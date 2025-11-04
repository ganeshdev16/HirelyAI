"use client";
import {
  createContext,
  ReactNode,
  useState,
  useContext,
  useEffect,
} from "react";
import {
  User,
  onAuthStateChanged,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  updateProfile,
} from "firebase/auth";
import { auth } from "@/firebaseConfig";

// Define the user data structure
interface UserData {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
  phoneNumber: string | null;
  createdAt: string | null;
  lastLoginAt: string | null;
}

// Define the authentication state
interface AuthState {
  user: UserData | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isEmailVerified: boolean;
}

// Define the context value type
interface AuthContextValue {
  // State
  authState: AuthState;

  // Actions
  signIn: (email: string, password: string) => Promise<User>;
  signUp: (email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  sendVerificationEmail: () => Promise<void>;
  updateUserProfile: (displayName?: string, photoURL?: string) => Promise<void>;

  // Utility functions
  refreshUser: () => Promise<void>;
}

// Create the context
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// Auth Provider Component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    isEmailVerified: false,
  });

  // Helper function to convert Firebase User to UserData
  const convertFirebaseUser = (firebaseUser: User): UserData => {
    return {
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      displayName: firebaseUser.displayName,
      photoURL: firebaseUser.photoURL,
      emailVerified: firebaseUser.emailVerified,
      phoneNumber: firebaseUser.phoneNumber,
      createdAt: firebaseUser.metadata.creationTime || null,
      lastLoginAt: firebaseUser.metadata.lastSignInTime || null,
    };
  };

  // Update auth state when user changes
  const updateAuthState = (firebaseUser: User | null) => {
    if (firebaseUser) {
      const userData = convertFirebaseUser(firebaseUser);
      setAuthState({
        user: userData,
        isAuthenticated: true,
        isLoading: false,
        isEmailVerified: firebaseUser.emailVerified,
      });
    } else {
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        isEmailVerified: false,
      });
    }
  };

  // Listen to authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      updateAuthState(user);
    });

    return () => unsubscribe();
  }, []);

  // Sign in function
  const signIn = async (email: string, password: string): Promise<User> => {
    try {
      setAuthState((prev) => ({ ...prev, isLoading: true }));
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      return userCredential.user;
    } catch (error) {
      setAuthState((prev) => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  // Sign up function
  const signUp = async (email: string, password: string): Promise<User> => {
    try {
      setAuthState((prev) => ({ ...prev, isLoading: true }));
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Send verification email automatically
      await sendEmailVerification(userCredential.user);

      return userCredential.user;
    } catch (error) {
      setAuthState((prev) => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  // Logout function
  const logout = async (): Promise<void> => {
    try {
      setAuthState((prev) => ({ ...prev, isLoading: true }));
      await signOut(auth);
      // Auth state will be updated by onAuthStateChanged listener
    } catch (error) {
      setAuthState((prev) => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  // Reset password function
  const resetPassword = async (email: string): Promise<void> => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      throw error;
    }
  };

  // Send verification email
  const sendVerificationEmail = async (): Promise<void> => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error("No authenticated user found");
    }

    try {
      await sendEmailVerification(currentUser);
    } catch (error) {
      throw error;
    }
  };

  // Update user profile
  const updateUserProfile = async (
    displayName?: string,
    photoURL?: string
  ): Promise<void> => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error("No authenticated user found");
    }

    try {
      const updateData: { displayName?: string; photoURL?: string } = {};
      if (displayName !== undefined) updateData.displayName = displayName;
      if (photoURL !== undefined) updateData.photoURL = photoURL;

      await updateProfile(currentUser, updateData);

      // Update local state with new user data
      updateAuthState(currentUser);
    } catch (error) {
      throw error;
    }
  };

  // Refresh user data
  const refreshUser = async (): Promise<void> => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      await currentUser.reload();
      updateAuthState(currentUser);
    }
  };

  // Context value
  const contextValue: AuthContextValue = {
    authState,
    signIn,
    signUp,
    logout,
    resetPassword,
    sendVerificationEmail,
    updateUserProfile,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Export the context itself (optional, for advanced use cases)
export { AuthContext };

// Export types for use in other components
export type { AuthState, UserData, AuthContextValue };

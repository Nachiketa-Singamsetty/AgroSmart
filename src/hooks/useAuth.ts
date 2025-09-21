import { useState, useEffect } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/config';
import { AuthService } from '../services/authService';

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setAuthState({
        user,
        loading: false,
        error: null
      });
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      await AuthService.signIn(email, password);
    } catch (error: any) {
      setAuthState(prev => ({ ...prev, loading: false, error }));
      throw error;
    }
  };

  const signUp = async (email: string, password: string, displayName?: string) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      await AuthService.signUp(email, password, displayName);
    } catch (error: any) {
      setAuthState(prev => ({ ...prev, loading: false, error }));
      throw error;
    }
  };

  const signOut = async () => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      await AuthService.signOut();
    } catch (error: any) {
      setAuthState(prev => ({ ...prev, loading: false, error }));
      throw error;
    }
  };

  const sendPasswordReset = async (email: string) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      await AuthService.sendPasswordResetEmail(email);
    } catch (error: any) {
      setAuthState(prev => ({ ...prev, loading: false, error }));
      throw error;
    }
  };

  const updateProfile = async (displayName?: string, photoURL?: string) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      await AuthService.updateUserProfile(displayName, photoURL);
    } catch (error: any) {
      setAuthState(prev => ({ ...prev, loading: false, error }));
      throw error;
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      await AuthService.changePassword(currentPassword, newPassword);
    } catch (error: any) {
      setAuthState(prev => ({ ...prev, loading: false, error }));
      throw error;
    }
  };

  const deleteAccount = async (password: string) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      await AuthService.deleteAccount(password);
    } catch (error: any) {
      setAuthState(prev => ({ ...prev, loading: false, error }));
      throw error;
    }
  };

  return {
    ...authState,
    signIn,
    signUp,
    signOut,
    sendPasswordReset,
    updateProfile,
    changePassword,
    deleteAccount,
    isLoggedIn: !!authState.user
  };
};

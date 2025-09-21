import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  sendPasswordResetEmail,
  updateProfile,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  deleteUser,
  User
} from 'firebase/auth';
import { auth } from '../firebase/config';

export interface AuthError {
  code: string;
  message: string;
}

export class AuthService {
  /**
   * Sign in with email and password
   */
  static async signIn(email: string, password: string): Promise<User> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error: any) {
      throw this.getAuthErrorMessage(error);
    }
  }

  /**
   * Create new user account
   */
  static async signUp(email: string, password: string, displayName?: string): Promise<User> {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update display name if provided
      if (displayName && userCredential.user) {
        await updateProfile(userCredential.user, { displayName });
      }
      
      return userCredential.user;
    } catch (error: any) {
      throw this.getAuthErrorMessage(error);
    }
  }

  /**
   * Sign out current user
   */
  static async signOut(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error: any) {
      throw this.getAuthErrorMessage(error);
    }
  }

  /**
   * Send password reset email
   */
  static async sendPasswordResetEmail(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error: any) {
      throw this.getAuthErrorMessage(error);
    }
  }

  /**
   * Update user profile
   */
  static async updateUserProfile(displayName?: string, photoURL?: string): Promise<void> {
    try {
      if (!auth.currentUser) throw new Error('No user logged in');
      
      const updates: any = {};
      if (displayName) updates.displayName = displayName;
      if (photoURL) updates.photoURL = photoURL;
      
      await updateProfile(auth.currentUser, updates);
    } catch (error: any) {
      throw this.getAuthErrorMessage(error);
    }
  }

  /**
   * Change user password
   */
  static async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    try {
      if (!auth.currentUser || !auth.currentUser.email) {
        throw new Error('No user logged in');
      }

      // Re-authenticate user
      const credential = EmailAuthProvider.credential(
        auth.currentUser.email,
        currentPassword
      );
      await reauthenticateWithCredential(auth.currentUser, credential);
      
      // Update password
      await updatePassword(auth.currentUser, newPassword);
    } catch (error: any) {
      throw this.getAuthErrorMessage(error);
    }
  }

  /**
   * Delete user account
   */
  static async deleteAccount(password: string): Promise<void> {
    try {
      if (!auth.currentUser || !auth.currentUser.email) {
        throw new Error('No user logged in');
      }

      // Re-authenticate user
      const credential = EmailAuthProvider.credential(
        auth.currentUser.email,
        password
      );
      await reauthenticateWithCredential(auth.currentUser, credential);
      
      // Delete account
      await deleteUser(auth.currentUser);
    } catch (error: any) {
      throw this.getAuthErrorMessage(error);
    }
  }

  /**
   * Get current user
   */
  static getCurrentUser(): User | null {
    return auth.currentUser;
  }

  /**
   * Check if user is logged in
   */
  static isLoggedIn(): boolean {
    return !!auth.currentUser;
  }

  /**
   * Validate email format
   */
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    return emailRegex.test(email);
  }

  /**
   * Validate password strength
   */
  static validatePassword(password: string): string | null {
    if (password.length < 6) {
      return 'Password must be at least 6 characters long.';
    }
    if (!password.match(/[A-Z]/)) {
      return 'Password must contain at least one uppercase letter.';
    }
    if (!password.match(/[a-z]/)) {
      return 'Password must contain at least one lowercase letter.';
    }
    if (!password.match(/[0-9]/)) {
      return 'Password must contain at least one number.';
    }
    return null;
  }

  /**
   * Get user-friendly error message from Firebase Auth error
   */
  private static getAuthErrorMessage(error: any): string {
    const errorCode = error.code;
    
    switch (errorCode) {
      case 'auth/user-not-found':
        return 'No user found with this email address.';
      case 'auth/wrong-password':
        return 'Incorrect password. Please try again.';
      case 'auth/email-already-in-use':
        return 'An account already exists with this email address.';
      case 'auth/weak-password':
        return 'Password is too weak. Please choose a stronger password.';
      case 'auth/invalid-email':
        return 'Invalid email address. Please check your email.';
      case 'auth/user-disabled':
        return 'This account has been disabled. Please contact support.';
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Please try again later.';
      case 'auth/operation-not-allowed':
        return 'This sign-in method is not allowed. Please contact support.';
      case 'auth/invalid-credential':
        return 'Invalid credentials. Please check your email and password.';
      case 'auth/requires-recent-login':
        return 'Please sign in again to perform this action.';
      default:
        return error.message || 'An authentication error occurred.';
    }
  }
}

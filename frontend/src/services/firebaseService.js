import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  updatePassword
} from 'firebase/auth';
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  Timestamp
} from 'firebase/firestore';
import { auth, db } from '../firebase/config';

class FirebaseService {
  // Authentication methods
  async signIn(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return {
        success: true,
        user: userCredential.user,
        message: 'Successfully signed in'
      };
    } catch (error) {
      console.error('Sign in error:', error);
      return {
        success: false,
        error: this.getAuthErrorMessage(error.code),
        code: error.code
      };
    }
  }

  async signUp(email, password, displayName = '') {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      // Update profile if display name provided
      if (displayName) {
        await updateProfile(userCredential.user, { displayName });
      }

      return {
        success: true,
        user: userCredential.user,
        message: 'Account created successfully'
      };
    } catch (error) {
      console.error('Sign up error:', error);
      return {
        success: false,
        error: this.getAuthErrorMessage(error.code),
        code: error.code
      };
    }
  }

  async signOutUser() {
    try {
      await signOut(auth);
      return {
        success: true,
        message: 'Successfully signed out'
      };
    } catch (error) {
      console.error('Sign out error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async updateUserProfile(updates) {
    try {
      if (!auth.currentUser) throw new Error('No authenticated user');

      await updateProfile(auth.currentUser, updates);
      return {
        success: true,
        message: 'Profile updated successfully'
      };
    } catch (error) {
      console.error('Profile update error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async updateUserPassword(newPassword) {
    try {
      if (!auth.currentUser) throw new Error('No authenticated user');

      await updatePassword(auth.currentUser, newPassword);
      return {
        success: true,
        message: 'Password updated successfully'
      };
    } catch (error) {
      console.error('Password update error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Auth state listener
  onAuthStateChange(callback) {
    return onAuthStateChanged(auth, callback);
  }

  // Firestore methods for logs
  async addLog(logData) {
    try {
      const logsRef = collection(db, 'logs');
      const docRef = await addDoc(logsRef, {
        ...logData,
        timestamp: Timestamp.now(),
        createdAt: Timestamp.now()
      });

      return {
        success: true,
        id: docRef.id,
        message: 'Log added successfully'
      };
    } catch (error) {
      console.error('Add log error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async getLogs(options = {}) {
    try {
      const logsRef = collection(db, 'logs');
      let q = query(logsRef, orderBy('timestamp', 'desc'));

      // Apply filters
      if (options.userId) {
        q = query(q, where('userId', '==', options.userId));
      }
      if (options.action) {
        q = query(q, where('action', '==', options.action));
      }
      if (options.limit) {
        q = query(q, limit(options.limit));
      }

      const querySnapshot = await getDocs(q);
      const logs = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        // Convert Firestore timestamp to Date
        timestamp: doc.data().timestamp?.toDate(),
        createdAt: doc.data().createdAt?.toDate()
      }));

      return {
        success: true,
        data: logs
      };
    } catch (error) {
      console.error('Get logs error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Real-time listener for logs
  subscribeToLogs(callback, options = {}) {
    const logsRef = collection(db, 'logs');
    let q = query(logsRef, orderBy('timestamp', 'desc'));

    if (options.limit) {
      q = query(q, limit(options.limit));
    }

    return onSnapshot(q, (querySnapshot) => {
      const logs = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate(),
        createdAt: doc.data().createdAt?.toDate()
      }));
      callback(logs);
    }, (error) => {
      console.error('Logs subscription error:', error);
      callback(null, error);
    });
  }

  async updateLog(logId, updates) {
    try {
      const logRef = doc(db, 'logs', logId);
      await updateDoc(logRef, {
        ...updates,
        updatedAt: Timestamp.now()
      });

      return {
        success: true,
        message: 'Log updated successfully'
      };
    } catch (error) {
      console.error('Update log error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async deleteLog(logId) {
    try {
      const logRef = doc(db, 'logs', logId);
      await deleteDoc(logRef);

      return {
        success: true,
        message: 'Log deleted successfully'
      };
    } catch (error) {
      console.error('Delete log error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Utility methods
  getAuthErrorMessage(code) {
    const errorMessages = {
      'auth/invalid-email': 'Invalid email address.',
      'auth/user-disabled': 'This account has been disabled.',
      'auth/user-not-found': 'No account found with this email.',
      'auth/wrong-password': 'Incorrect password.',
      'auth/email-already-in-use': 'An account with this email already exists.',
      'auth/weak-password': 'Password should be at least 6 characters.',
      'auth/operation-not-allowed': 'This operation is not allowed.',
      'auth/network-request-failed': 'Network error. Please check your connection.',
      'auth/too-many-requests': 'Too many failed attempts. Please try again later.',
      'auth/requires-recent-login': 'Please re-authenticate to perform this action.'
    };

    return errorMessages[code] || 'An unexpected error occurred.';
  }

  // Get current user
  getCurrentUser() {
    return auth.currentUser;
  }

  // Check if user is authenticated
  isAuthenticated() {
    return !!auth.currentUser;
  }
}

// Create and export singleton instance
const firebaseService = new FirebaseService();
export default firebaseService;
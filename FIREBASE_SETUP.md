# Firebase Integration Setup Guide

## Prerequisites

1. **Firebase Project**: Create a Firebase project at https://console.firebase.google.com/
2. **Firestore Database**: Enable Firestore Database in your Firebase project
3. **Authentication**: Enable Email/Password authentication in Firebase Authentication

## Firebase Configuration

1. Go to your Firebase project settings (gear icon → Project settings)
2. Scroll down to "Your apps" section
3. Click "Add app" → Web app (</>) icon
4. Register your app with a nickname (e.g., "Audit Log Frontend")
5. Copy the Firebase configuration object

## Update Configuration

1. Open `frontend/src/firebase/config.js`
2. Replace the placeholder values with your actual Firebase config:

```javascript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-actual-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-actual-app-id"
};
```

## Running the Application

1. **Start the backend** (MongoDB):
   ```bash
   cd backend
   npm start
   ```

2. **Start the frontend** (Firebase):
   ```bash
   cd frontend
   npm run dev
   ```

## First Time Setup

1. Open the frontend at `http://localhost:5173`
2. Click "Need an account? Sign Up" on the login page
3. Create your admin account with any email/password
4. After signing up, you'll be redirected to the dashboard
5. Use the "Seed Data" button in the bottom-right corner to populate Firestore with sample audit logs

## Features Implemented

- ✅ **Firebase Authentication**: Email/password sign-in and sign-up
- ✅ **Firestore Database**: Real-time audit log storage and retrieval
- ✅ **Real-time Updates**: Dashboard updates automatically when logs are added
- ✅ **User Management**: Sign-out functionality with user info display
- ✅ **Data Seeding**: Utility to populate Firestore with sample data
- ✅ **Responsive Design**: Works on desktop and mobile

## Security Notes

- The seed data tool should be removed in production
- Consider implementing proper user roles and permissions
- Add input validation and sanitization for production use
- Enable Firebase Security Rules for Firestore access control

## Troubleshooting

**"Firebase: Error (auth/invalid-api-key)"**
- Check that your Firebase config is correct in `config.js`

**"No audit logs found"**
- Run the seed data function using the button in the dashboard
- Check Firebase console to ensure data was added to Firestore

**Authentication issues**
- Ensure Email/Password authentication is enabled in Firebase console
- Check browser console for detailed error messages
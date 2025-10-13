# Hakari's Slots

**Team 3 – California State University, Fullerton**  
Kent Tran • Sean Le • Chanel McGee  
Instructor: Prof. Sha Dong

A web-based casino gaming platform featuring slot machines, a virtual item shop, player trading, and competitive leaderboards. Built with React and powered by Firebase, Hakari delivers an interactive gambling simulation experience with anime and gaming-themed aesthetics.

**Live Site:** [hakari-spin.web.app](https://hakari-spin.web.app)  

## Features

**Slot Machine Game**  
Phaser-powered slot machine with multiple symbols and prize tiers. Features 5 unique symbols with different rarity levels. Players can adjust bet amounts and spin for credits based on symbol matches.

**Virtual Shop**  
Purchase collectible items and battle passes with in-game credits. 

**Trading System**  
Trade items with other players. Browse and filter trades by category  with real-time inventory syncing through Firebase.

**Leaderboards**  
Compete with other players and track rankings pulled from real-time Firebase data.

**Daily Login Bonus**  
Firestore tracks last login time and streaks. Users receive streak bonuses based on consistent login history.

**User Authentication**  
Secure account creation, login, and password recovery via Firebase Authentication. Includes duplicate email protection and React Router-based route protection.

**Real-time Database**  
Player credits, inventories, and stats synchronized with Firestore for seamless persistence across sessions.

## Tech Stack

**Frontend**
- React (v18.2.0)
- Vite (v6.2.0)
- React Router (v6.30.0)
- SCSS/Sass
- Lucide React & React Icons

**Game Engine**
- Phaser (v3.88.2)

**Backend & Database**
- Firebase (v11.6.0)
  - Firebase Authentication
  - Firestore
  - Firebase Storage
  - Firebase Analytics

## Prerequisites

- Node.js (v16.0.0 or higher)
- npm (v7.0.0 or higher) or yarn
- Firebase account and project

## Installation

**1. Clone the Repository**

```bash
git clone https://github.com/KentvTran/Slots-for-Kinji-Hakari.git
cd Slots-for-Kinji-Hakari
```

**2. Install Dependencies**

```bash
npm install
```

**3. Configure Firebase**

Create a `.env` file in the root directory:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

To get these values:
1. Go to Firebase Console
2. Create or select your project
3. Navigate to Project Settings > General
4. Scroll to "Your apps" and select the web app
5. Copy the configuration values

**4. Set Up Firestore Database**

In Firebase Console, enable Firestore Database and create these collections:
- `users` (user profiles, credits, inventories)
- `leaderboards` (player rankings)
- `trades` (trade transactions)

**5. Enable Firebase Authentication**

In Firebase Console, go to Authentication and enable the Email/Password sign-in method.

## Usage

**Development Server**

```bash
npm run dev
```

Application will be available at `http://localhost:5173`

**Build for Production**

```bash
npm run build
```

Built files will be in the `dist` directory.

**Preview Production Build**

```bash
npm run preview
```

## Project Structure

```
Hakari Game/
├── src/
│   ├── assets/              # Images and static resources
│   │   ├── items/          # Shop item images
│   │   └── slots/          # Slot machine symbols
│   ├── components/          # React components
│   │   ├── ForgotPassword/
│   │   ├── Layout/         # Main layout wrapper
│   │   ├── Leaderboards/
│   │   ├── LoginPage/
│   │   ├── NewAccount/
│   │   ├── ResetPassword/
│   │   ├── Settings/
│   │   ├── Shop/           # Shop interface and data
│   │   ├── Slots/          # Slot machine game logic
│   │   ├── Trade/
│   │   └── WelcomePage/
│   ├── contexts/
│   │   └── authContext/    # Authentication context provider
│   ├── firebase/            # Firebase configuration and utilities
│   │   ├── auth.js         # Authentication functions
│   │   ├── firebase.js     # Firebase initialization
│   │   └── items.js        # Item management functions
│   ├── styles/              # Global SCSS styles
│   ├── App.jsx             # Root component
│   └── index.jsx           # Application entry point
├── .env                     # Environment variables (not committed)
├── index.html              # HTML entry point
├── package.json            # Project dependencies
└── vite.config.js          # Vite configuration
```



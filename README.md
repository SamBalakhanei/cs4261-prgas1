# 💬 Tiny Board

A real-time message board mobile app built with React Native (Expo) and Supabase. Users can type a short message, pick an emoji mood, and post it to a shared feed that updates live across all devices.

## What It Does

- **Post messages** — Type a message (up to 280 characters), choose one of six emoji moods, and tap Post.
- **Shared feed** — Every post is stored in a Supabase PostgreSQL database and displayed in a scrollable feed, newest first.
- **Real-time updates** — Posts from other users appear instantly on your device via Supabase Realtime (WebSocket). No need to refresh.
- **Cross-device** — Multiple people can run the app simultaneously on their phones and see each other's messages appear live.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React Native + TypeScript (Expo SDK 57) |
| Backend | Supabase (PostgreSQL + REST API + Realtime) |
| Device | iOS / Android |

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v20 or later recommended)
- [Expo Go](https://expo.dev/go) installed on your phone (iOS App Store or Google Play Store)
- An Expo account (free) — sign up at [expo.dev](https://expo.dev)

### 1. Clone the repository

```bash
git clone https://github.com/SamBalakhanei/cs4261-prgas1.git
cd cs4261-prgas1
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Copy the example env file and fill in the Supabase credentials:

```bash
cp .env.example .env
```

Then edit `.env` and replace the placeholder values with the real Supabase URL and key.

### 4. Log in to Expo

```bash
npx expo login -b
```

Enter your Expo account credentials. You need to be logged in so that your phone (via Expo Go) can connect to the dev server.

### 5. Log in on your phone

Open the **Expo Go** app on your phone and sign in with the **same Expo account** you used in step 4.

### 6. Start the development server

```bash
npx expo start
```

This will display a QR code in your terminal.

### 7. Open on your device

- **iOS**: Open the Camera app and scan the QR code, or open Expo Go and tap the project under "Recently opened".
- **Android**: Open Expo Go and scan the QR code directly from the app.

The app will bundle and load on your phone. You can now post messages and see them appear in real time!

> **Note:** Your phone and computer must be on the same Wi-Fi network for the dev server connection to work.

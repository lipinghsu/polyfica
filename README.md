# <a href="https://profh-2298e.web.app/">Pölyfica</a>

## Overview
A comprehensive redesign of Polyratings, focusing on improving user experience and modernizing the platform.

## Table of Contents
- [Firebase React Project](#firebase-react-project)
  - [Overview](#overview)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the App Locally](#running-the-app-locally)
  - [Firebase Setup](#firebase-setup)
  - [Deploying to Firebase Hosting](#deploying-to-firebase-hosting)
  - [Configuration Files](#configuration-files)
  - [Contributing](#contributing)
  - [License](#license)
  - [Acknowledgements](#acknowledgements)

## Features
- User authentication (Firebase Authentication)
- Real-time database (Firestore)
- Responsive design
- Review writing functionality
- Firebase Hosting for deployment

## Getting Started
Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

## Prerequisites
- Node.js (v14 or later)
- npm (v6 or later)
- Firebase CLI

2. **Install dependencies:**
   ```bash
   npm install
   ```

## Running the App Locally
To run the app in development mode:
```bash
npm start
```
Open [http://localhost:3000](http://localhost:3000) to view it in your browser. The page will reload when you make changes.

## Firebase Setup
1. **Install Firebase CLI:**
   ```bash
   npm install -g firebase-tools
   ```

2. **Login to Firebase:**
   ```bash
   firebase login
   ```

3. **Initialize Firebase in your project:**
   ```bash
   firebase init
   ```
   - Select `Hosting` and follow the prompts.
   - Choose your Firebase project.
   - Set `build` as the public directory.
   - Configure as a single-page app (rewrite all URLs to `index.html`).

## Deploying to Firebase Hosting
1. **Build the React app:**
   ```bash
   npm run build
   ```

2. **Deploy to Firebase Hosting:**
   ```bash
   firebase deploy
   ```

## Configuration Files

### `firebase.json`
```json
{
  "hosting": {
    "public": "build",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

## Contributing
Contributions are welcome! Please read the [CONTRIBUTING.md](CONTRIBUTING.md) file for details on how to contribute.

## License
This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## Acknowledgements
- [React](https://reactjs.org/)
- [Firebase](https://firebase.google.com/)
- [Create React App](https://github.com/facebook/create-react-app)

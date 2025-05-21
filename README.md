## Multiplayer Gaming Platform Using Nextjs, Stream and Firebase
A gaming application with chat channels built using Next.js, Firebase, and Stream Chat SDK.

## Getting Started
- Clone the GitHub repository
- Install the package dependencies.
  ```bash
  npm install
  ```
- Create a [Firebase app with Authentication and Firebase Firestore features](https://firebase.google.com/)
- Update the [firebase.ts](https://github.com/dha-stix/stream-games/blob/main/src/lib/firebase.ts) file with your Firebase configuration code.
- Create your Stream account and also add your Stream credentials into the **`env.local`** file.
- Ensure you create the **TicTacToe** and **RockPaperScissors** channels manually within your Stream app dashboard.
- Finally, start the development server by running the code snippet below:
  ```bash
  npm run dev
  ```

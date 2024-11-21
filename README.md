# NFT Inventory - Universal Game Assets Manager

## About this App

NFT Inventory is a World App mini-app that provides a universal hub for managing game-related NFTs across different platforms and games. It serves as a centralized inventory system for both current in-game assets and future game items.

### Key Features
- **Cross-Game Asset Management**: Seamlessly manage NFTs from multiple games in one interface
- **Human Verification**: Secure access through World ID verification ensures genuine ownership
- **Future Asset Support**: Track and manage both existing and upcoming game assets
- **Universal Compatibility**: Works across different gaming platforms and blockchains
- **Intuitive Interface**: Gaming-inspired design with easy-to-use inventory management

### Target Users
- Gamers with assets across multiple games
- NFT collectors focused on gaming assets
- Game developers implementing cross-game assets
- Players interested in future game releases

### Vision
NFT Inventory aims to solve the fragmentation in gaming asset management by providing a unified, secure platform for tracking and managing game-related NFTs. Our goal is to become the standard tool for cross-game asset management in the Web3 gaming ecosystem.


## Setup

To run as a mini app choose a production app in the dev portal and use NGROK to tunnel. Set the `NEXTAUTH_URL` and the redirect url if using sign in with worldcoin to that ngrok url 

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

View docs: [Docs](https://minikit-docs.vercel.app/mini-apps)

[Developer Portal](https://developer.worldcoin.org/)


# Local Setup Instructions for NFT Inventory Project

## Prerequisites
1. Ensure you have Node.js (v16+), pnpm, and ngrok installed.
2. Obtain your `WLD_CLIENT_ID` and `WLD_CLIENT_SECRET` from the Worldcoin Developer Portal.

## Steps to Get the Local Setup Running
1. Clone the repository and navigate to the project directory.
2. Install dependencies using pnpm.
3. Copy `.env.example` to `.env`.
4. Update `.env.local` with the following variables:
   - `APP_ID`
   - `DEV_PORTAL_API_KEY`
   - `WLD_CLIENT_ID`
   - `WLD_CLIENT_SECRET`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL`
5. Start ngrok vith `ngrok http 3000 --log stdout` and note the generated ngrok URL.
6. Start the development server using `pnpm dev -p 3000`.

7. Update `NEXTAUTH_URL` in `.env` with the ngrok URL.
8. Add the ngrok callback URL to the Worldcoin Developer Portal like so `Current_Nextauth_URL/api/auth/callback/worldcoin`.


## Debugging Tips
- If you encounter `ERR_TOO_MANY_REDIRECTS`, check that `NEXTAUTH_URL` matches the ngrok URL and ensure cookies are not blocked.
- Restart the server after modifying `.env`.
- Inspect `ngrok` here: http://127.0.0.1:4040

## Common Commands
- Clone the repository: `git clone`
- Install dependencies: `pnpm install`
- Start the development server: `pnpm dev`
- Start ngrok: `ngrok http 3000`

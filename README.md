
## Setup


```bash
cp .env.example .env
pnpm i 
pnpm dev

```

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
5. Start ngrok vith `ngrok http 3000` and note the generated ngrok URL
6. Update `NEXTAUTH_URL` in `.env` with the ngrok URL.
7. Start the development server using pnpm.
8. Add the ngrok callback URL to the Worldcoin Developer Portal.

... or type `just dev`.

## Debugging Tips
- If you encounter `ERR_TOO_MANY_REDIRECTS`, check that `NEXTAUTH_URL` matches the ngrok URL and ensure cookies are not blocked.
- Restart the server after modifying `.env`.
- INspect `ngrok` here: http://127.0.0.1:4040

## Common Commands
- Clone the repository: `git clone`
- Install dependencies: `pnpm install`
- Start the development server: `pnpm dev`
- Start ngrok: `ngrok http 3000`

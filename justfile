# Set the shell for commands
set shell := ["bash", "-cu"]

# Recipe to start the development environment
dev:
	@echo "Checking if port 3000 is in use..."
	@if lsof -i :3000; then kill -9 $(lsof -t -i :3000); fi

	@echo "Starting Next.js Development Server..."
	pnpm dev -p 3000 &

	@echo "Starting ngrok with verbose output..."
	ngrok http 3000 --log stdout
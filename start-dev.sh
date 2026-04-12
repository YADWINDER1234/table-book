#!/bin/bash

# Restaurant Web App - Quick Start Script (Linux/Mac)
# This script automatically installs dependencies and starts both backend and frontend

echo "🍽️  Restaurant Web App - Quick Start"
echo "===================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Check if backend .env exists
if [ ! -f "backend/.env" ]; then
  echo -e "${YELLOW}Creating backend/.env from template...${NC}"
  cp backend/.env.example backend/.env
  echo -e "${GREEN}✓${NC} Created backend/.env"
  echo "Please update backend/.env with your settings (MONGODB_URI, Stripe keys, etc.)"
fi

# Check if frontend .env.local exists
if [ ! -f "frontend/.env.local" ]; then
  echo -e "${YELLOW}Creating frontend/.env.local from template...${NC}"
  cp frontend/.env.example frontend/.env.local
  echo -e "${GREEN}✓${NC} Created frontend/.env.local"
  echo "Please update frontend/.env.local with your Stripe key"
fi

echo ""
echo "Installing backend dependencies..."
cd backend
if [ ! -d "node_modules" ]; then
  npm install > /dev/null 2>&1
  if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓${NC} Backend dependencies installed"
  else
    echo -e "${RED}✗${NC} Failed to install backend dependencies"
    exit 1
  fi
else
  echo -e "${GREEN}✓${NC} Backend dependencies already installed"
fi

echo ""
echo "Installing frontend dependencies..."
cd ../frontend
if [ ! -d "node_modules" ]; then
  npm install > /dev/null 2>&1
  if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓${NC} Frontend dependencies installed"
  else
    echo -e "${RED}✗${NC} Failed to install frontend dependencies"
    exit 1
  fi
else
  echo -e "${GREEN}✓${NC} Frontend dependencies already installed"
fi

cd ..

echo ""
echo -e "${YELLOW}Starting Backend...${NC}"
echo "Backend will run on http://localhost:5000"
echo "Backend seed data can be loaded with: npm run seed (from backend directory)"
echo ""
cd backend
npm run dev &
BACKEND_PID=$!
cd ..

sleep 2

echo ""
echo -e "${YELLOW}Starting Frontend...${NC}"
echo "Frontend will run on http://localhost:5173"
echo ""
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo "=================================================="
echo -e "${GREEN}✨ Restaurant Web App is starting!${NC}"
echo "=================================================="
echo ""
echo "Backend:  http://localhost:5000/api/v1"
echo "Frontend: http://localhost:5173"
echo ""
echo "Both processes are running in the background."
echo "Press Ctrl+C to stop both servers."
echo ""

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID

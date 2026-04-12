#!/bin/bash

# Restaurant Web App - Pre-Launch Verification Script
# This script checks if everything is configured properly before running the app

echo "🍽️  Restaurant Web App - Pre-Launch Verification"
echo "=================================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

checks_passed=0
checks_failed=0
warnings=0

# Helper functions
check_pass() {
  echo -e "${GREEN}✓${NC} $1"
  ((checks_passed++))
}

check_fail() {
  echo -e "${RED}✗${NC} $1"
  ((checks_failed++))
}

check_warn() {
  echo -e "${YELLOW}⚠${NC} $1"
  ((warnings++))
}

# 1. Check Node.js
echo "1. Checking Node.js installation..."
if command -v node &> /dev/null; then
  node_version=$(node -v)
  check_pass "Node.js installed: $node_version"
else
  check_fail "Node.js not found. Please install Node.js 14+ from https://nodejs.org"
fi

# 2. Check npm
echo ""
echo "2. Checking npm installation..."
if command -v npm &> /dev/null; then
  npm_version=$(npm -v)
  check_pass "npm installed: $npm_version"
else
  check_fail "npm not found"
fi

# 3. Check MongoDB
echo ""
echo "3. Checking MongoDB..."
if command -v mongod &> /dev/null; then
  mongo_version=$(mongod --version | head -n 1)
  check_pass "MongoDB installed: $mongo_version"
else
  check_warn "MongoDB not found locally (you can use MongoDB Atlas instead)"
fi

# 4. Check backend file structure
echo ""
echo "4. Checking backend directory structure..."
backend_files=(
  "backend/src/index.ts"
  "backend/src/models/index.ts"
  "backend/src/controllers/bookingController.ts"
  "backend/src/routes/bookingRoutes.ts"
  "backend/package.json"
)

for file in "${backend_files[@]}"; do
  if [ -f "$file" ]; then
    check_pass "Found: $file"
  else
    check_fail "Missing: $file"
  fi
done

# 5. Check frontend file structure
echo ""
echo "5. Checking frontend directory structure..."
frontend_files=(
  "frontend/src/App.tsx"
  "frontend/src/pages/index.tsx"
  "frontend/src/services/bookingService.ts"
  "frontend/package.json"
  "frontend/vite.config.ts"
)

for file in "${frontend_files[@]}"; do
  if [ -f "$file" ]; then
    check_pass "Found: $file"
  else
    check_fail "Missing: $file"
  fi
done

# 6. Check .env files
echo ""
echo "6. Checking environment configuration..."
if [ -f "backend/.env" ]; then
  check_pass "Backend .env file exists"
else
  check_warn "Backend .env file not found. Creating from template..."
  if [ -f "backend/.env.example" ]; then
    cp backend/.env.example backend/.env
    check_pass "Created backend/.env from template (please update with your settings)"
  fi
fi

if [ -f "frontend/.env.local" ]; then
  check_pass "Frontend .env.local file exists"
else
  check_warn "Frontend .env.local file not found. Creating from template..."
  if [ -f "frontend/.env.example" ]; then
    cp frontend/.env.example frontend/.env.local
    check_pass "Created frontend/.env.local from template (please update with your settings)"
  fi
fi

# 7. Check backend dependencies
echo ""
echo "7. Checking backend dependencies..."
if [ -d "backend/node_modules" ]; then
  check_pass "Backend node_modules directory exists"
else
  check_warn "Backend node_modules not installed. Run: cd backend && npm install"
fi

# 8. Check frontend dependencies
echo ""
echo "8. Checking frontend dependencies..."
if [ -d "frontend/node_modules" ]; then
  check_pass "Frontend node_modules directory exists"
else
  check_warn "Frontend node_modules not installed. Run: cd frontend && npm install"
fi

# 9. Check key packages
echo ""
echo "9. Checking key packages..."
if grep -q '"express"' backend/package.json; then
  check_pass "Express.js configured"
else
  check_fail "Express.js not found in backend/package.json"
fi

if grep -q '"mongoose"' backend/package.json; then
  check_pass "Mongoose configured"
else
  check_fail "Mongoose not found in backend/package.json"
fi

if grep -q '"react"' frontend/package.json; then
  check_pass "React configured"
else
  check_fail "React not found in frontend/package.json"
fi

if grep -q '"stripe"' backend/package.json; then
  check_pass "Stripe configured in backend"
else
  check_warn "Stripe not found in backend/package.json (payment features won't work)"
fi

# 10. Check documentation
echo ""
echo "10. Checking documentation..."
doc_files=(
  "SETUP_GUIDE.md"
  "FEATURES_GUIDE.md"
  "ARCHITECTURE.md"
)

for file in "${doc_files[@]}"; do
  if [ -f "$file" ]; then
    check_pass "Found: $file"
  else
    check_warn "Missing: $file"
  fi
done

# Summary
echo ""
echo "=================================================="
echo "Verification Summary:"
echo -e "${GREEN}Passed: $checks_passed${NC}"
if [ $checks_failed -gt 0 ]; then
  echo -e "${RED}Failed: $checks_failed${NC}"
fi
if [ $warnings -gt 0 ]; then
  echo -e "${YELLOW}Warnings: $warnings${NC}"
fi

echo ""

if [ $checks_failed -eq 0 ]; then
  echo -e "${GREEN}✨ All critical checks passed!${NC}"
  echo ""
  echo "Next steps:"
  echo "1. Update backend/.env with your settings"
  echo "2. Update frontend/.env.local with your settings"
  echo "3. Run: npm run seed (in backend directory)"
  echo "4. Run: npm run dev (in backend directory)"
  echo "5. Run: npm run dev (in frontend directory)"
  echo ""
  echo "Frontend will be available at: http://localhost:5173"
  echo "Backend API at: http://localhost:5000/api/v1"
else
  echo -e "${RED}❌ Some critical checks failed. Please fix issues above.${NC}"
  exit 1
fi

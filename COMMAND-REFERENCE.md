# AromaSouq - Command Reference Card

Quick reference for commonly used commands. Keep this handy! 📋

---

## 🚀 Starting Servers

### Start Backend (Terminal 1)
```cmd
cd C:\Users\deept\AromaSouq\aromasouq-api
pnpm start:dev
```
**URL:** http://localhost:3001/api/v1

### Start Frontend (Terminal 2)
```cmd
cd C:\Users\deept\AromaSouq\aromasouq-web
pnpm dev
```
**URL:** http://localhost:3000

### Start Prisma Studio (Terminal 3)
```cmd
cd C:\Users\deept\AromaSouq\aromasouq-api
npx prisma studio
```
**URL:** http://localhost:5555

---

## 🗄️ Database Commands

### View Database
```cmd
npx prisma studio
```

### Generate Prisma Client (after schema changes)
```cmd
npx prisma generate
```

### Create Migration
```cmd
npx prisma migrate dev --name your_migration_name
```

### Run Existing Migrations
```cmd
npx prisma migrate deploy
```

### Seed Database
```cmd
npx prisma db seed
```

### Reset Database (⚠️ DELETES ALL DATA)
```cmd
npx prisma migrate reset
```

### Pull Schema from Database
```cmd
npx prisma db pull
```

### Push Schema to Database (without migration)
```cmd
npx prisma db push
```

---

## 🧪 Testing Commands

### Verify Setup
```cmd
cd C:\Users\deept\AromaSouq
node verify-setup.js
```

### Test API Endpoints
```cmd
cd C:\Users\deept\AromaSouq
test-api.bat
```

### Test Backend Health
```cmd
curl http://localhost:3001/api/v1
```

### Test Register API
```cmd
curl -X POST http://localhost:3001/api/v1/auth/register ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"test@example.com\",\"password\":\"testpass123\",\"firstName\":\"Test\",\"lastName\":\"User\"}"
```

### Test Login API
```cmd
curl -X POST http://localhost:3001/api/v1/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"customer@test.com\",\"password\":\"admin123\"}"
```

### Test Protected Route (replace TOKEN)
```cmd
curl http://localhost:3001/api/v1/auth/profile ^
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 📦 Package Management

### Install Dependencies
```cmd
# Backend
cd aromasouq-api
pnpm install

# Frontend
cd aromasouq-web
pnpm install
```

### Add New Package
```cmd
# Backend
cd aromasouq-api
pnpm add package-name

# Frontend
cd aromasouq-web
pnpm add package-name
```

### Add Dev Dependency
```cmd
pnpm add -D package-name
```

### Remove Package
```cmd
pnpm remove package-name
```

### Update All Packages
```cmd
pnpm update
```

### Check Outdated Packages
```cmd
pnpm outdated
```

---

## 🔧 Development Commands

### Build Backend
```cmd
cd aromasouq-api
pnpm build
```

### Build Frontend
```cmd
cd aromasouq-web
pnpm build
```

### Run Production Backend
```cmd
cd aromasouq-api
pnpm start:prod
```

### Run Production Frontend
```cmd
cd aromasouq-web
pnpm start
```

### Lint Code
```cmd
# Backend
cd aromasouq-api
pnpm lint

# Frontend
cd aromasouq-web
pnpm lint
```

### Format Code
```cmd
# Backend
pnpm format

# Frontend
pnpm format
```

---

## 🐛 Debugging & Troubleshooting

### Check Port Usage
```cmd
# Check if port 3001 is in use
netstat -ano | findstr :3001

# Check if port 3000 is in use
netstat -ano | findstr :3000
```

### Kill Process on Port
```cmd
# Find PID first with netstat command above
taskkill /PID [PID_NUMBER] /F
```

### View Backend Logs
Logs appear in the terminal where you ran `pnpm start:dev`

### Clear Cache & Reinstall
```cmd
# Backend
cd aromasouq-api
rmdir /s /q node_modules
rmdir /s /q dist
del pnpm-lock.yaml
pnpm install

# Frontend
cd aromasouq-web
rmdir /s /q node_modules
rmdir /s /q .next
del pnpm-lock.yaml
pnpm install
```

### Regenerate Prisma Client
```cmd
cd aromasouq-api
npx prisma generate
```

---

## 🔐 Environment Variables

### Edit Backend .env
```cmd
notepad C:\Users\deept\AromaSouq\aromasouq-api\.env
```

### Edit Frontend .env.local
```cmd
notepad C:\Users\deept\AromaSouq\aromasouq-web\.env.local
```

### View Supabase Credentials
```cmd
notepad C:\Users\deept\AromaSouq\supabase-credentials.txt
```

---

## 🧠 Claude Code Commands

### Start Claude Code
```cmd
cd C:\Users\deept\AromaSouq
claude
```

### List MCP Servers
```cmd
claude mcp list
```

### Quick Feature Generation Examples

#### Create Login Page
```cmd
claude "Create a login page at aromasouq-web/src/app/login/page.tsx with email/password fields, React Hook Form validation, and connect to the backend API"
```

#### Add Product Model
```cmd
claude "Add the Product model to aromasouq-api/prisma/schema.prisma with all fields from the database schema document, then create and run the migration"
```

#### Create API Module
```cmd
claude "Create a Products module in aromasouq-api/src/products with CRUD operations, Supabase Storage integration, and proper validation"
```

#### Build Component
```cmd
claude "Create a ProductCard component in aromasouq-web/src/components with image, name, price, and Add to Cart button using the Oud Gold theme"
```

---

## 📊 Git Commands

### Initialize Git
```cmd
cd C:\Users\deept\AromaSouq
git init
```

### Add Remote Repository
```cmd
git remote add origin https://github.com/yourusername/aromasouq.git
```

### Check Status
```cmd
git status
```

### Add All Files
```cmd
git add .
```

### Commit Changes
```cmd
git commit -m "Your commit message"
```

### Push to Remote
```cmd
git push -u origin main
```

### Pull Latest Changes
```cmd
git pull origin main
```

### Create New Branch
```cmd
git checkout -b feature/your-feature-name
```

### Switch Branch
```cmd
git checkout branch-name
```

### View Commit History
```cmd
git log --oneline
```

---

## 🌐 Useful URLs

### Local Development
- Backend API: http://localhost:3001/api/v1
- Frontend: http://localhost:3000
- Prisma Studio: http://localhost:5555

### Supabase
- Dashboard: https://supabase.com/dashboard
- Your Project: https://supabase.com/dashboard/project/[YOUR-PROJECT-REF]

### Documentation
- Supabase Docs: https://supabase.com/docs
- Prisma Docs: https://www.prisma.io/docs
- NestJS Docs: https://docs.nestjs.com
- Next.js Docs: https://nextjs.org/docs

---

## 🔑 Test Accounts

```
Super Admin:
  Email: admin@aromasouq.ae
  Password: admin123

Customer:
  Email: customer@test.com
  Password: admin123

Vendor:
  Email: vendor@test.com
  Password: admin123
```

---

## 📁 Important File Paths

### Configuration Files
```
Backend .env: C:\Users\deept\AromaSouq\aromasouq-api\.env
Frontend .env: C:\Users\deept\AromaSouq\aromasouq-web\.env.local
Prisma Schema: C:\Users\deept\AromaSouq\aromasouq-api\prisma\schema.prisma
Tailwind Config: C:\Users\deept\AromaSouq\aromasouq-web\tailwind.config.ts
```

### Key Directories
```
Backend Source: C:\Users\deept\AromaSouq\aromasouq-api\src
Frontend Source: C:\Users\deept\AromaSouq\aromasouq-web\src
Documentation: C:\Users\deept\AromaSouq\docs
MCP Config: C:\Users\deept\AromaSouq\.claude
```

---

## 🆘 Emergency Commands

### Stop All Node Processes
```cmd
taskkill /f /im node.exe
```

### Clear All Caches
```cmd
cd aromasouq-api
rmdir /s /q node_modules dist

cd ..\aromasouq-web
rmdir /s /q node_modules .next

cd ..
```

### Reinstall Everything
```cmd
cd aromasouq-api
pnpm install
npx prisma generate

cd ..\aromasouq-web
pnpm install

cd ..
```

### Reset Database (DANGER!)
```cmd
cd aromasouq-api
npx prisma migrate reset
npx prisma db seed
```

---

## 💡 Pro Tips

### Tip 1: Create Aliases (Optional)
Create a batch file for quick commands:

```cmd
notepad C:\Users\deept\quick.bat
```

Add:
```batch
@echo off
if "%1"=="api" (
    cd C:\Users\deept\AromaSouq\aromasouq-api && pnpm start:dev
) else if "%1"=="web" (
    cd C:\Users\deept\AromaSouq\aromasouq-web && pnpm dev
) else if "%1"=="studio" (
    cd C:\Users\deept\AromaSouq\aromasouq-api && npx prisma studio
) else (
    echo Usage: quick api ^| web ^| studio
)
```

Then use:
```cmd
quick api
quick web
quick studio
```

### Tip 2: Keep This Open
Keep this file open in Notepad while developing:
```cmd
notepad C:\Users\deept\AromaSouq\COMMAND-REFERENCE.md
```

### Tip 3: Bookmark URLs
Bookmark these in your browser:
- http://localhost:3001/api/v1
- http://localhost:3000
- http://localhost:5555
- https://supabase.com/dashboard

---

## 📞 Quick Help

**Setup Issues?** → Read `SETUP-GUIDE-COMPLETE.md`
**Verify Setup?** → Run `node verify-setup.js`
**Test API?** → Run `test-api.bat`
**Database Issues?** → Check Supabase Dashboard
**Port Conflicts?** → Use `netstat` and `taskkill` commands above

---

**Print this page and keep it at your desk! 📄**

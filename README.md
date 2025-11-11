# AromaSouq - Luxury Fragrance Marketplace

**Status:** 🚀 Ready for Development Setup
**Version:** 1.0.0
**Tech Stack:** Next.js 15 + NestJS + Prisma + Supabase

---

## 🎯 Quick Start

### New Setup (First Time)

**Follow these files IN ORDER:**

1. **📘 SETUP-GUIDE-COMPLETE.md** ← Start here (90 min walkthrough)
2. **✅ SETUP-CHECKLIST.md** ← Print and check off items
3. **🔍 verify-setup.js** ← Run to verify everything works
4. **🧪 test-api.bat** ← Test your API endpoints

```cmd
# Step 1: Read the setup guide
notepad SETUP-GUIDE-COMPLETE.md

# Step 2: After setup, verify everything
node verify-setup.js

# Step 3: Start servers (2 separate CMD windows)
cd aromasouq-api
pnpm start:dev

cd aromasouq-web
pnpm dev

# Step 4: Test API
test-api.bat
```

---

## 📁 Project Structure

```
AromaSouq/
├── aromasouq-api/          # Backend (NestJS + Prisma)
│   ├── src/
│   │   ├── auth/           # Authentication module
│   │   ├── prisma/         # Database service
│   │   └── main.ts
│   ├── prisma/
│   │   ├── schema.prisma   # Database schema
│   │   └── seed.ts         # Seed data
│   └── .env                # Backend environment variables
│
├── aromasouq-web/          # Frontend (Next.js 15)
│   ├── src/
│   │   ├── app/            # Pages (App Router)
│   │   └── components/     # React components
│   ├── tailwind.config.ts  # AromaSouq theme
│   └── .env.local          # Frontend environment variables
│
├── docs/                   # Complete documentation (350+ pages)
│   ├── 00-README-START-HERE.md
│   ├── 01-AromaSouq-MVP-PRD.md
│   ├── 02-AromaSouq-Design-System.md
│   ├── 03-AromaSouq-Technical-Architecture.md
│   ├── 04-AromaSouq-Database-Schema.md
│   ├── 05-AromaSouq-Implementation-Roadmap.md
│   ├── 06-AromaSouq-Claude-Code-Guide.md
│   └── 07-AromaSouq-Supabase-Setup-Guide.md
│
├── .claude/                # MCP configuration for Claude Code
│   ├── mcp.json
│   └── config.json
│
└── Setup Files:
    ├── SETUP-GUIDE-COMPLETE.md      # Full setup instructions
    ├── SETUP-CHECKLIST.md           # Quick checklist
    ├── verify-setup.js               # Verification script
    ├── test-api.bat                  # API testing script
    └── supabase-credentials.txt      # Your credentials (KEEP SAFE!)
```

---

## 🌟 What's Already Built

### ✅ Infrastructure
- [x] NestJS backend with TypeScript
- [x] Next.js 15 frontend with App Router
- [x] Prisma ORM connected to Supabase
- [x] Tailwind CSS with Oud Gold theme
- [x] MCP configured for Claude Code

### ✅ Database
- [x] User model (Customer, Vendor, Admin roles)
- [x] Vendor model with business info
- [x] Category model (8 categories seeded)
- [x] Supabase Storage (4 buckets configured)

### ✅ Authentication
- [x] User registration API
- [x] User login API
- [x] JWT token generation
- [x] Protected routes with JWT guard
- [x] Password hashing with bcrypt
- [x] Test accounts created

### 🔄 Next to Build (Use Claude Code!)
- [ ] Frontend login/register pages
- [ ] Auth context & token management
- [ ] Product model & APIs
- [ ] Supabase Storage integration
- [ ] Product listing & detail pages
- [ ] Shopping cart
- [ ] Checkout flow
- [ ] Vendor & Admin dashboards

---

## 🚀 Daily Development Workflow

### Start Your Day

```cmd
# Terminal 1: Start Backend
cd C:\Users\deept\AromaSouq\aromasouq-api
pnpm start:dev

# Terminal 2: Start Frontend
cd C:\Users\deept\AromaSouq\aromasouq-web
pnpm dev

# Terminal 3: Use Claude Code
cd C:\Users\deept\AromaSouq
claude
```

### Useful Commands

```cmd
# View Database
cd aromasouq-api
npx prisma studio

# Generate Prisma Client (after schema changes)
npx prisma generate

# Create Migration
npx prisma migrate dev --name your_migration_name

# Seed Database
npx prisma db seed

# Reset Database (DANGER: deletes all data)
npx prisma migrate reset
```

---

## 🧠 Using Claude Code for Development

Once setup is complete, use Claude Code to build features:

```cmd
# Example: Create Login Page
claude "Create a login page at src/app/login/page.tsx with email/password fields, form validation using React Hook Form + Zod, and connect to the backend API. Use the Oud Gold theme from tailwind.config.ts"

# Example: Add Product Model
claude "Add the complete Product model to prisma/schema.prisma based on docs/04-AromaSouq-Database-Schema.md, then create and run the migration"

# Example: Create Products API
claude "Create a Products module in src/products/ with CRUD operations, image upload to Supabase Storage, filters, and pagination"

# Example: Build Product Card Component
claude "Create a ProductCard component that displays product image, name, price, rating, and Add to Cart button using the design system from docs/02-AromaSouq-Design-System.md"
```

---

## 🔐 Test Accounts

After running `npx prisma db seed`, these accounts are available:

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
Business: Luxury Fragrances LLC
```

---

## 📊 Services & URLs

### Local Development
- **Backend API:** http://localhost:3001/api/v1
- **Frontend:** http://localhost:3000
- **Prisma Studio:** http://localhost:5555 (run: `npx prisma studio`)

### Cloud Services
- **Supabase Dashboard:** https://supabase.com/dashboard
- **Supabase Storage:** Your buckets: products, brands, users, documents

### API Endpoints

```
POST   /api/v1/auth/register      # Register new user
POST   /api/v1/auth/login         # Login
GET    /api/v1/auth/profile       # Get user profile (protected)
```

---

## 📚 Documentation

**Comprehensive Guides (in `/docs` folder):**

1. **PRD** - Product Requirements Document (features, user flows)
2. **Design System** - Colors, typography, components
3. **Technical Architecture** - Tech stack, infrastructure
4. **Database Schema** - Complete data models
5. **Roadmap** - 24-week implementation plan
6. **Claude Code Guide** - 200+ ready-to-use prompts
7. **Supabase Guide** - Complete setup & usage

**Total:** 350+ pages of documentation

---

## 🆘 Troubleshooting

### Backend won't start
```cmd
# Check if port is in use
netstat -ano | findstr :3001

# Kill process
taskkill /PID [PID] /F

# Check .env file
notepad aromasouq-api\.env
```

### Frontend won't start
```cmd
# Check if port is in use
netstat -ano | findstr :3000

# Kill process
taskkill /PID [PID] /F

# Reinstall dependencies
cd aromasouq-web
rmdir /s /q node_modules
pnpm install
```

### Database connection error
- Verify Supabase credentials in `.env`
- Check Supabase project isn't paused
- Ensure no special characters in password need escaping
- Test connection: `npx prisma db pull`

### Prisma errors
```cmd
# Regenerate client
npx prisma generate

# Check migration status
npx prisma migrate status

# Reset database (deletes all data!)
npx prisma migrate reset
```

---

## 🎯 Development Roadmap

Follow the **24-week roadmap** in `docs/05-AromaSouq-Implementation-Roadmap.md`:

- **Weeks 1-4:** Foundation ✅ (YOU ARE HERE)
- **Weeks 5-12:** Core MVP (Products, Cart, Checkout, Dashboards)
- **Weeks 13-18:** Enhancement (Payments, Reviews, Search, Emails)
- **Weeks 19-24:** Polish & Launch (WhatsApp, Loyalty, SEO, Testing)

---

## 🌍 Environment Variables

### Backend (aromasouq-api/.env)
```env
DATABASE_URL="postgresql://..."
SUPABASE_URL="https://..."
SUPABASE_SERVICE_KEY="..."
JWT_SECRET="..."
```

### Frontend (aromasouq-web/.env.local)
```env
NEXT_PUBLIC_API_URL="http://localhost:3001/api/v1"
NEXT_PUBLIC_SUPABASE_URL="https://..."
NEXT_PUBLIC_SUPABASE_ANON_KEY="..."
```

**⚠️ Never commit `.env` or `.env.local` to Git!**

---

## 🤝 Contributing

Currently in initial development phase. Follow the coding standards in:
- `docs/03-AromaSouq-Technical-Architecture.md`
- `docs/02-AromaSouq-Design-System.md`

---

## 📝 License

Proprietary - AromaSouq MVP

---

## 🎉 Let's Build!

You're now ready to build the next big fragrance marketplace for the UAE! 🚀

**Next Step:** Open `SETUP-GUIDE-COMPLETE.md` and start your setup journey.

**Need Help?** Check the troubleshooting sections in:
- SETUP-GUIDE-COMPLETE.md
- docs/07-AromaSouq-Supabase-Setup-Guide.md

**Happy Coding!** 💻✨

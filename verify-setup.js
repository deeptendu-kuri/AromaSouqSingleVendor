// AromaSouq Setup Verification Script
// Run with: node verify-setup.js

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔍 AromaSouq Setup Verification\n');
console.log('='.repeat(50));

let passCount = 0;
let failCount = 0;

function check(name, condition, errorMsg = '') {
  if (condition) {
    console.log(`✅ ${name}`);
    passCount++;
    return true;
  } else {
    console.log(`❌ ${name}`);
    if (errorMsg) console.log(`   → ${errorMsg}`);
    failCount++;
    return false;
  }
}

function fileExists(filePath) {
  return fs.existsSync(filePath);
}

function dirExists(dirPath) {
  return fs.existsSync(dirPath) && fs.lstatSync(dirPath).isDirectory();
}

function checkCommand(cmd) {
  try {
    execSync(cmd, { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

// Prerequisites
console.log('\n📋 Prerequisites:');
check('Node.js installed', checkCommand('node --version'), 'Install Node.js v20+');
check('Git installed', checkCommand('git --version'), 'Install Git');
check('pnpm installed', checkCommand('pnpm --version'), 'Run: npm install -g pnpm');

// Project Structure
console.log('\n📁 Project Structure:');
check('aromasouq-api folder', dirExists('aromasouq-api'), 'Create: mkdir aromasouq-api');
check('aromasouq-web folder', dirExists('aromasouq-web'), 'Create: mkdir aromasouq-web');
check('docs folder', dirExists('docs'));

// Backend Files
console.log('\n🔧 Backend Configuration:');
check('package.json (backend)', fileExists('aromasouq-api/package.json'), 'Initialize NestJS project');
check('.env file', fileExists('aromasouq-api/.env'), 'Create .env with Supabase credentials');
check('prisma/schema.prisma', fileExists('aromasouq-api/prisma/schema.prisma'), 'Run: npx prisma init');
check('prisma/seed.ts', fileExists('aromasouq-api/prisma/seed.ts'), 'Create seed file');

// Backend Modules
console.log('\n🏗️  Backend Modules:');
check('src/auth directory', dirExists('aromasouq-api/src/auth'), 'Create auth module');
check('src/prisma directory', dirExists('aromasouq-api/src/prisma'), 'Create prisma module');
check('auth.service.ts', fileExists('aromasouq-api/src/auth/auth.service.ts'));
check('auth.controller.ts', fileExists('aromasouq-api/src/auth/auth.controller.ts'));
check('jwt.strategy.ts', fileExists('aromasouq-api/src/auth/strategies/jwt.strategy.ts'));

// Frontend Files
console.log('\n⚛️  Frontend Configuration:');
check('package.json (frontend)', fileExists('aromasouq-web/package.json'), 'Initialize Next.js project');
check('.env.local file', fileExists('aromasouq-web/.env.local'), 'Create .env.local');
check('tailwind.config.ts', fileExists('aromasouq-web/tailwind.config.ts'));
check('next.config.ts', fileExists('aromasouq-web/next.config.ts'));

// MCP Configuration
console.log('\n🔌 MCP Configuration:');
check('.claude directory', dirExists('.claude'), 'Create: mkdir .claude');
check('mcp.json', fileExists('.claude/mcp.json'), 'Create MCP configuration');

// Environment Variables Check
console.log('\n🔐 Environment Variables:');
if (fileExists('aromasouq-api/.env')) {
  const envContent = fs.readFileSync('aromasouq-api/.env', 'utf-8');
  check('DATABASE_URL set', envContent.includes('DATABASE_URL='), 'Add Supabase connection string');
  check('SUPABASE_URL set', envContent.includes('SUPABASE_URL='), 'Add Supabase URL');
  check('JWT_SECRET set', envContent.includes('JWT_SECRET='), 'Add JWT secret');
} else {
  console.log('   ⚠️  .env file not found');
}

// Node Modules
console.log('\n📦 Dependencies:');
check('node_modules (backend)', dirExists('aromasouq-api/node_modules'), 'Run: cd aromasouq-api && pnpm install');
check('node_modules (frontend)', dirExists('aromasouq-web/node_modules'), 'Run: cd aromasouq-web && pnpm install');

// Prisma
console.log('\n🗄️  Database:');
check('Prisma Client generated', dirExists('aromasouq-api/node_modules/.prisma'), 'Run: npx prisma generate');
check('Migrations folder', dirExists('aromasouq-api/prisma/migrations'), 'Run: npx prisma migrate dev --name init');

// Summary
console.log('\n' + '='.repeat(50));
console.log(`\n📊 Results: ${passCount} passed, ${failCount} failed\n`);

if (failCount === 0) {
  console.log('🎉 SUCCESS! Your setup is complete!\n');
  console.log('Next steps:');
  console.log('1. Start backend: cd aromasouq-api && pnpm start:dev');
  console.log('2. Start frontend: cd aromasouq-web && pnpm dev');
  console.log('3. Test API: curl http://localhost:3001/api/v1/auth/profile\n');
} else {
  console.log('⚠️  Setup incomplete. Please fix the failed items above.\n');
  console.log('📖 Refer to: SETUP-GUIDE-COMPLETE.md\n');
}

process.exit(failCount === 0 ? 0 : 1);

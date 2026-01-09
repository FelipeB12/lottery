# 🎰 Loterias - Management & Betting System

A modern, high-performance web application for managing local lottery simulations. This platform allows owners, admins, and sellers to coordinate betting flows, manage credits, and process prizes in real-time.

## 🚀 Tech Stack

- **Framework**: [Next.js 15.1](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **UI & Styling**: [Tailwind CSS v4.0](https://tailwindcss.com/) (Cutting-edge engine)
- **Database**: [PostgreSQL](https://www.postgresql.org/) (via [Supabase](https://supabase.com/))
- **ORM**: [Prisma 6.2](https://www.prisma.io/)
- **State & Logic**: React 19, Server Actions, Zod Validation
- **Authentication**: Custom Server-side session management (bcryptjs)
- **Animation**: [Framer Motion](https://www.framer.com/motion/)

## 📋 Features

### 👑 Hierarchical Role Management
- **Owner**: Full system control. Manages Admins and creating/activating Lotteries.
- **Admin**: Manages a group of Sellers. Handles credit distribution and sales monitoring.
- **Seller**: Mobile-first betting interface for rapid ticket entry.

### 💰 Financial Controls
- **Credit Transfers**: Secure hierarchical transfers (Owner → Admin → Seller).
- **Balance Validation**: Real-time balance checks to prevent over-betting.
- **Audit Ready**: Transaction history for all credit transfers.

### 🎫 Betting Flow
- **Multi-step Selection**: Filter by day and select active lotteries with a native feel.
- **30-Minute Rule**: Automatic cutoff for bets 30 minutes before results.
- **Prize Processing**: Automatic winner detection and hierarchy-wide notifications.

## 🛠️ Installation & Setup

Follow these steps to get the project running locally:

### 1. Prerequisites
- **Node.js 22.x** or higher (LTS recommended)
- **NVM** (optional but recommended)

### 2. Clone and Install
```bash
git clone <repository-url>
cd lottery
npm install
```

### 3. Database Configuration
Create a `.env` file in the root directory and add your Supabase connection strings (ensure special characters in your password are URL encoded):

```env
# URL-encoded password is required for characters like + or @
DATABASE_URL="postgresql://postgres.[REF]:[ENCODED_PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[REF]:[ENCODED_PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres"
```

### 4. Sync Database Schema
```bash
npx prisma db push
```

### 5. Seed Initial Data
Create the default Owner account:
```bash
npm run seed
```

### 6. Start Development
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the app.

## 🔒 Security & Committing

- **Passwords**: All user passwords are encrypted using `bcryptjs` with high cost factors.
- **Server Side**: No direct database access from the client; all mutations use validated Server Actions.

---
Created with ❤️

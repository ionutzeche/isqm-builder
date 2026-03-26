# ISQM-1 Builder — CLA Romania

Quality management operating system for CLA Romania Audit practice.

## Setup

```bash
npm install
cp .env.example .env   # Edit DATABASE_URL
npm run seed            # Create tables + seed demo data
npm run dev             # Starts API (3001) + Web (5173)
```

Open http://localhost:5173

Login: admin@cla.com.ro / admin123

## Stack
- **Frontend:** React 18, Vite, Tailwind CSS
- **Backend:** Express, PostgreSQL
- **Auth:** JWT (7-day tokens)
- **Schema:** 16 tables, 8 pre-seeded ISQM components

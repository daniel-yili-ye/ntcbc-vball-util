# NTCBC Volleyball Session Manager

A lightweight web application utility for managing priority waitlists for church volleyball drop-in sessions. Built to streamline the process of determining confirmed participants and waitlisted members across multiple weekly sessions.

## Features

- **Dual Session Support**: Manage two concurrent volleyball sessions (6:00 PM and 8:15 PM)
- **Priority-Based Ranking**: Automatically calculates participant priority based on registration timestamp and previous session attendance
- **Luma Integration**: Import participant data directly from Luma event exports (CSV format)
- **Admin Slot Management**: Configure reserved admin spots for each session
- **Flexible Session Caps**: Set custom capacity limits for each session
- **Waitlist Generation**: Automatically determines confirmed vs. waitlisted participants based on ranking and capacity
- **CSV Export**: Generate formatted reports for easy integration back into Luma or other management systems
- **Real-time Processing**: Client-side data processing using DuckDB WASM for fast, secure operations

## Use Case

Designed for volunteer coordinators managing weekly volleyball drop-ins at North Toronto Community Baptist Church. Eliminates manual waitlist calculation and ensures fair, transparent participant selection based on registration order and session history.

Perfect for any organization running recurring events with capacity constraints and priority-based registration systems.

## Getting Started

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## How to Use

1. **Upload Session Files**: Export participant data from Luma for both sessions as CSV files
2. **Configure Settings**: Set the number of admin slots and session capacity for each session
3. **Process Data**: Click "Process Data" to generate rankings and waitlist status
4. **Review Results**: View participants organized by session with their ranking and status
5. **Export Results**: Download the processed data as CSV for importing back into Luma

## Tech Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Modern UI components
- **DuckDB WASM** - In-browser SQL database for data processing

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

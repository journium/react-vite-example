# Looply Habit Tracker - React + Vite Example

This repository demonstrates Journium integration for **React + Vite**. Use this as a reference implementation for building your own Journium-powered applications with React and Vite.

> [!NOTE]
> If you want to use **Next.js**, please refer to the [Next.js App Router example repository](https://github.com/journium/nextjs-app-router-example.git) or [Next.js Pages Router example repository](https://github.com/journium/nextjs-pages-router-example.git) instead.

## Prerequisites

- Node.js 18+ installed
- Bun package manager (recommended) or npm/yarn/pnpm
- A Journium account (sign up at [https://journium.app/signup](https://journium.app/signup))

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/journium/react-vite-example.git
cd react-vite-example
```

### 2. Install Dependencies

```bash
bun install
# or
npm install
# or
yarn install
# or
pnpm install
```

### 3. Set Up Journium

1. **Sign up for a Journium account** at [https://journium.app/signup](https://journium.app/signup)

2. **Create an application named "Looply"** in your Journium dashboard

3. **Get your publishable key** from the application settings in your Journium dashboard

4. **Create a `.env` file** in the root of this project and add your publishable key:

```bash
VITE_JOURNIUM_PUBLISHABLE_KEY=your_publishable_key_here
```

### 4. Run the Development Server

```bash
bun run dev
# or
npm run dev
# or
yarn dev
# or
pnpm dev
```

To use a custom port, modify the `server.port` setting in `vite.config.ts`.

Open [http://localhost:8080](http://localhost:8080) in your browser to see the application running.

## Next Steps

- Explore the codebase to see how Journium is integrated
- Check out the [Journium documentation](https://journium.app/docs) for more details
- Customize this example to build your own application

## Available Scripts

- `bun run dev` - Start the development server
- `bun run build` - Build the application for production
- `bun run build:dev` - Build the application in development mode
- `bun run preview` - Preview the production build locally
- `bun run lint` - Run ESLint to check for code issues

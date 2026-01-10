# Looply Habit Tracker - React + Vite Example

This repository demonstrates Journium integration for **React + Vite**. Use this as a reference implementation for building your own Journium-powered applications with React and Vite.

> [!NOTE]
> If you want to use **Next.js**, please refer to the [Next.js App Router example repository](https://github.com/journium/nextjs-app-router-example.git) or [Next.js Pages Router example repository](https://github.com/journium/nextjs-pages-router-example.git) instead.

## Prerequisites

- Node.js 18+ installed [TODO: Verify minimal node version and supply here]
- [Bun package manager](https://bun.com/) (recommended) or npm/yarn/pnpm

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

### 3. Set your Journium Publishable Key

1. **Sign up for a Journium account** at [https://journium.app/signup](https://journium.app/signup)

2. **Create an application named "Looply"** in your Journium dashboard

3. Copy your Publishable Key from the [Developers | API Keys](https://dashboard.journium.app/apps/j_app~/instances/j_app_inst~/developers/api-keys) section.

4. Paste your key into your `.env` or `.env.local` file.

```bash
VITE_JOURNIUM_PUBLISHABLE_KEY=your_publishable_key_here
```

### 4. Run the Development Server

```bash
# Start the development server (default port 5173)
bun run dev
# or
npm run dev
# or
yarn dev
# or
pnpm dev
```

To use a custom port, specify it with the `-p` flag:

```bash
# To run on a specific port (e.g., 8080), use:
bun run dev -- --port 8080
# or
npm run dev -- --port 8080
# or
yarn dev --port 8080
# or
pnpm dev -- --port 8080
```

## Send Events to Journium from your app

To send events automatically from your running app to Journium:

- Open [http://localhost:8080](http://localhost:8080) in your browser and navigate around various pages.
- View collected events in your Journium [Dashboard | Events](https://dashboard.journium.app/apps/j_app~/instances/j_app_inst~/developers/events) page.

## Generate sample insights from collected data.

> [!NOTE]
> When you create an app in Journium, a default [Insight Tracker](https://journium.app/docs/concepts/insight_tracker). You can list trackers for your app in [Dashboard | Insight Tracker](https://dashboard.journium.app/apps/j_app~/instances/j_app_inst~/developers/insight-trackers) is created for you. This is a good starting point to test your data ingestion and insight generation. 

- Go to the tracker listing page for your app at [Dashboard | Insight Tracker](https://dashboard.journium.app/apps/j_app~/instances/j_app_inst~/developers/insight-trackers).
- Click on the `Analyze now` button for the tracker titled `User Engagment`. This will trigger a job for you to execute the tracker. 
- You can track jobs in your dashboard at [Dashboard | Jobs](https://dashboard.journium.app/apps/j_app~/instances/j_app_inst~/developers/jobs)
- Wait for the job to complete. You can view the details of the job by clicking on the job name.
- Once the job complete successfully, navigate to your application's Insights - [Dashboard | Overview](https://dashboard.journium.app/apps/j_app~/instances/j_app_inst~/overview)


Congratulations on creating your first insight successfully!

## Next Steps

- Explore the codebase to see how Journium is integrated
- Send your own custom events. See <a href="https://journium.app/docs/concepts/events" target="_blank" rel="noopener noreferrer">Journium documentation</a>.
- Customize this example to build your own application

## Available Scripts

- `bun run dev` - Start the development server
- `bun run build` - Build the application for production
- `bun run build:dev` - Build the application in development mode
- `bun run preview` - Preview the production build locally
- `bun run lint` - Run ESLint to check for code issues

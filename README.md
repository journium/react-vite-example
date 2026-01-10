# Looply Habit Tracker - React + Vite Example

This repository demonstrates Journium integration for **React + Vite**. Use this as a reference implementation for building your own Journium-powered applications with React and Vite.

> [!NOTE]
> If you want to use **Next.js**, please refer to the [Next.js App Router example repository](https://github.com/journium/nextjs-app-router-example.git) or [Next.js Pages Router example repository](https://github.com/journium/nextjs-pages-router-example.git) instead.

## What You'll Build

A fully functional habit tracking app demonstrating:
- ✅ User authentication flow
- ✅ Event tracking with Journium
- ✅ Real-time insights generation
- ✅ Paywall integration
- ✅ React + Vite best practices

**Time to complete:** ~10 minutes

## Prerequisites

- Node.js 18+ installed
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

   > 💡 **Smart Links:** Dashboard URLs automatically navigate to your app - just click!

4. **Create a `.env` file** in the project root:

    ```bash
    touch .env
    ```

5. **Add your key** to the `.env` file:

    ```bash
    VITE_JOURNIUM_PUBLISHABLE_KEY=your_publishable_key_here
    ```

6. **Verify your setup** - check that the key is correctly saved:

    ```bash
    cat .env
    # Should show: VITE_JOURNIUM_PUBLISHABLE_KEY=pk_test_...
    ```

   > **Important:** Development instances use `pk_test_` keys. Production keys start with `pk_live_`.

### 4. Run the Development Server

```bash
# Start the development server (default port 8080)
bun run dev
# or
npm run dev
# or
yarn dev
# or
pnpm dev
```

The server will start at **http://localhost:8080**

<details>
<summary>Using a custom port?</summary>

```bash
bun run dev -- --port 3000
npm run dev -- --port 3000
pnpm dev -- --port 3000
yarn dev --port 3000  # Note: yarn doesn't use -- before flags
```
</details>

### 5. Verify Your Setup

Open [http://localhost:8080](http://localhost:8080) in your browser to see the Looply app running.

### 6. Send Events to Journium

Navigate around the app to automatically send events to Journium:

- **Sign up** for a test account (use any email/password, e.g., `test@example.com` / `password123` - data is local only)
- **Create a habit** (e.g., "Drink water")
- **Log a habit entry**
- **Explore different pages** (Home, Insights, Settings)

Then view your collected events at [Developers | Events](https://dashboard.journium.app/apps/j_app~/instances/j_app_inst~/developers/events).

✅ **Success indicator:** You should see events appearing in your dashboard within a few seconds.

### 7. Generate Your First Insight

> [!NOTE]
> When you create an app in Journium, a default [Insight Tracker](https://journium.app/docs/concepts/insight_tracker) is automatically created. This tracker helps you test data ingestion and insight generation.

1. Go to your [Developers | Insight Trackers](https://dashboard.journium.app/apps/j_app~/instances/j_app_inst~/developers/insight-trackers) page
2. Click the **`Analyze now`** button for the tracker titled **"User Engagement"**
3. Monitor the job status in [Developers | Jobs](https://dashboard.journium.app/apps/j_app~/instances/j_app_inst~/developers/jobs)
4. Wait for the job to complete (usually takes 1-2 minutes)
5. View your generated insights at [Dashboard | Overview](https://dashboard.journium.app/apps/j_app~/instances/j_app_inst~/overview)

✅ **Congratulations!** You've successfully created your first insight with Journium!

## Troubleshooting

### Events not appearing in dashboard?
- Verify your API key starts with `pk_` and is correctly set in `.env`
- Check browser console for errors (F12 → Console)
- Ensure you're interacting with the **local Looply app** at `localhost:8080` (not the dashboard)
- Restart the dev server after changing `.env` file

### Build errors?
- Delete `node_modules` and reinstall dependencies:
  ```bash
  rm -rf node_modules && bun install
  ```
- Ensure Node.js version is 18+:
  ```bash
  node --version
  ```

### Port already in use?
- Use a different port:
  ```bash
  bun run dev -- --port 3000
  ```
- Or stop the process using port 8080:
  ```bash
  lsof -ti:8080 | xargs kill -9
  ```

### `.env` file not loading?
- Ensure the file is named exactly `.env` (not `.env.txt`)
- Restart the development server after creating/modifying `.env`
- Check file location: it must be in the project root, not in `src/`

## Next Steps

- Explore the codebase to see how Journium is integrated
- Send your own custom events - see [Journium Events Documentation](https://journium.app/docs/concepts/events)
- Customize this example to build your own application
- Learn about [Insight Trackers](https://journium.app/docs/concepts/insight_tracker) and create custom analytics

## Available Scripts

- `bun run dev` - Start the development server
- `bun run build` - Build the application for production
- `bun run build:dev` - Build the application in development mode
- `bun run preview` - Preview the production build locally
- `bun run lint` - Run ESLint to check for code issues



## 🚀 Technologies Used

- **Framework**: Next.js (App Router)
- **Styling**: Tailwind CSS v4
- **Backend & Database**: Firebase (Firestore, Authentication)
- **Hooks**: React Firebase Hooks
- **Language**: TypeScript

## 📦 Getting Started

First, ensure you have your Firebase configuration set up in the `.env.local` file:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

Install the dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application in action.

## 🛠️ Project Structure

- `app/` - Next.js App Router pages and layouts.
- `app/lib/firebase.ts` - Firebase initialization and configuration.
- `public/` - Static assets like images and fonts.

## 📄 Available Scripts

- `npm run dev` - Runs the app in development mode.
- `npm run build` - Builds the app for production.
- `npm run start` - Starts the production server.
- `npm run lint` - Runs ESLint to check for code issues.

## 🚀 Deployment

https://notes-app-f2029.web.app/

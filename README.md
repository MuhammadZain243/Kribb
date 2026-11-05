# Kribb 🏠

A real-estate mobile app built with **Expo** and **React Native**. Browse featured and recommended properties, search listings, save favorites, and (for admins) add new properties.

## Features

- 🔐 **Authentication** with Clerk: email and password sign-in and sign-up, email verification, and two-step verification (SMS, authenticator app, backup codes)
- 🏡 **Home feed** with greeting header, search bar, and recommended properties
- 🔎 **Search**, **Saved** and **Profile** tabs
- ➕ **Add Property** tab, visible to admin users only
- 🪟 **Platform-specific tabs**: a native tab bar on iOS and a custom animated glass tab bar on Android
- ✨ Smooth animations with Reanimated, pull-to-refresh, loading and empty states

## Tech Stack

| Area         | Tools                                                                 |
| ------------ | --------------------------------------------------------------------- |
| Framework    | [Expo](https://expo.dev), React Native, TypeScript                    |
| Routing      | [Expo Router](https://docs.expo.dev/router/introduction) (file-based) |
| Auth         | [Clerk](https://clerk.com) (`@clerk/expo`)                            |
| Backend / DB | [Supabase](https://supabase.com)                                      |
| Styling      | NativeWind (Tailwind CSS)                                             |
| Animation    | `react-native-reanimated`                                             |
| UI extras    | `expo-blur`, `lucide-react-native`, `@expo/vector-icons`              |
| State        | Zustand (`store/userStore.ts`)                                        |

## Project Structure

```
.
├── app/
│   ├── (auth)/
│   │   ├── sign-in.tsx              # Sign-in route (renders the sign-in flow)
│   │   └── sign-up.tsx              # Sign-up route (renders the sign-up flow)
│   └── (root)/
│       └── (tabs)/
│           ├── _layout.tsx          # Tabs: native on iOS, animated glass bar on Android
│           ├── index.tsx            # Home screen
│           ├── search.tsx           # Search tab
│           ├── create.tsx           # Add Property tab (admin only)
│           ├── saved.tsx            # Saved properties tab
│           └── profile.tsx          # Profile tab
│
├── components/
│   ├── OTPInput.tsx                 # 6-digit code input
│   ├── auth/
│   │   ├── AuthLayout.tsx           # Shared screen shell: logo, title, keyboard handling
│   │   ├── AuthInput.tsx            # Icon text input with error and password toggle
│   │   ├── Button.tsx               # Solid and link buttons with loading state
│   │   ├── ErrorMessage.tsx         # Inline error banner
│   │   ├── CredentialsStep.tsx      # Sign-in: email and password
│   │   ├── EmailVerificationStep.tsx # Sign-in: client trust email code
│   │   ├── SecondFactorStep.tsx     # Sign-in: SMS, TOTP or backup code
│   │   ├── SignUpFormStep.tsx       # Sign-up: details form
│   │   └── SignUpVerifyStep.tsx     # Sign-up: email verification
│   └── home/
│       ├── HomeHeader.tsx           # Avatar, greeting and logo
│       ├── HomeSearchBar.tsx        # Search shortcut and filter button
│       ├── SectionHeader.tsx        # Section title with "See all"
│       ├── PropertyCard.tsx         # Property listing card
│       ├── EmptyState.tsx           # Reusable empty state
│       └── shadows.ts               # Shared shadow styles
│
├── hooks/
│   ├── useProperties.ts             # Fetches featured and recommended properties
│   ├── useSignInFlow.ts             # Sign-in logic (password, MFA, client trust)
│   └── useSignUpFlow.ts             # Sign-up logic (create account, verify email)
│
├── lib/
│   └── supabase.ts                  # Supabase client
│
├── store/
│   └── userStore.ts                 # Global user state (e.g. isAdmin)
│
├── types/
│   └── index.ts                     # Shared types (Property, ...)
│
├── utils/
│   └── format.ts                    # Greeting and price/number formatting
│
├── assets/
│   └── images/
│       └── kribb.png                # App logo
│
├── global.css                       # Tailwind / NativeWind entry
├── tailwind.config.js
├── babel.config.js
├── metro.config.js
├── app.json
├── package.json
└── tsconfig.json                    # Path alias: "@/*" -> project root
```

> The root `app/_layout.tsx`, config files and a few screens aren't listed in detail. Adjust the tree if your project differs.

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

Create a `.env` file in the project root:

```bash
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Start the app

```bash
npx expo start
```

From the output you can open the app in a:

- [Development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

## Data Model

Properties live in a Supabase `properties` table:

```ts
export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  type: string;
  bedrooms: number;
  bathrooms: number;
  area_sqft: number;
  address: string;
  city: string;
  latitude: number;
  longitude: number;
  images: string[];
  is_featured: boolean;
  is_sold: boolean;
  created_at: string;
}
```

## Architecture Notes

- **Logic and UI are separated.** Screens in `app/` stay thin. Business logic lives in `hooks/`, and UI pieces live in `components/`.
- **Auth flows are step-based.** `useSignInFlow` and `useSignUpFlow` expose the current `step`, and the route file renders the matching step component.
- **Tabs differ by platform.** iOS uses Expo Router's `NativeTabs`. Android uses a custom animated glass tab bar, with a raised Add Property button shown only to admins.
- **Path alias.** Imports use `@/` (for example `@/hooks/useProperties`).

## Scripts

| Command           | Description                          |
| ----------------- | ------------------------------------ |
| `npm start`       | Start the Expo dev server            |
| `npm run android` | Run on an Android device or emulator |
| `npm run ios`     | Run on an iOS device or simulator    |
| `npm run lint`    | Lint the project                     |

## Learn More

- [Expo documentation](https://docs.expo.dev/)
- [Expo Router](https://docs.expo.dev/router/introduction)
- [Clerk Expo SDK](https://clerk.com/docs/quickstarts/expo)
- [Supabase docs](https://supabase.com/docs)
- [NativeWind](https://www.nativewind.dev/)

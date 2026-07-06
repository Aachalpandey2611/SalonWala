# SalonWala Frontend Architecture

## Module Structure (Expo Router)
The application leverages Expo Router for a file-based routing mechanism, deeply segregating the architecture by user persona to ensure zero bleed of UI/logic between user roles.

- `/app/(auth)`: The onboarding funnel (Splash, Language, Login, OTP, Gender, Location). Uses a standard stack layout.
- `/app/(customer)`: The end-user application. Relies on a persistent Bottom Tab Bar for navigation (Home, Search, Bookings, Profile). Includes nested stacks for Shop Details, Booking Flows, and Live Queue Tracking.
- `/app/(barber)`: The operations interface for staff. Uses a specialized sticky header/action bar instead of bottom tabs to maximize vertical screen real estate. Contains Dashboard, Live Queue Operations, Shop Management, and Analytics.
- `/app/(owner)`: The SaaS-like "God View" for parlour owners. Exclusively handles multi-barber queues, overall business metrics, and high-level shop settings.

## Data Layer (Frontend Mocks)
Currently, all data is mocked and strictly typed within the `/data` directory (e.g., `live-queue.ts`, `barber-stats.ts`). 
- **Backend Integration Note**: Before production, replace these static arrays with React Query (`@tanstack/react-query`) hooks fetching from your REST/GraphQL endpoints.

## State Management
- Local UI state (modals, active tabs, filters) is handled via React `useState`.
- Complex multi-step flows (like the Booking Flow in `app/(customer)/shop/book/...`) pass simple ID params via Expo Router query params.
- **Backend Integration Note**: For global state (e.g., current authenticated user, active websocket queue connection), consider implementing Zustand or Jotai.

## Animation Strategy
All animations utilize `react-native-reanimated`.
- We rely heavily on `FadeInDown` with staggered delays (e.g., `.delay(index * 50)`) for list rendering to create a premium, buttery-smooth load experience.
- Interactive elements (Buttons, Cards) should utilize `useSharedValue` and `withSpring` for press-scale effects.

# Component Library

All reusable UI primitives are located in `components/ui/`. They are built to be highly extensible while strictly adhering to the Design System.

## Primary Components

### Button (`<Button />`)
Standardized interactive CTA.
- **Props**:
  - `label` (string): Text to display.
  - `variant` ('primary' | 'secondary' | 'outline' | 'ghost'): Visual style.
  - `size` ('s' | 'm' | 'l'): Sizing config.
  - `isLoading` (boolean): Shows an inline `<Spinner />` and disables press.
  - `disabled` (boolean): Reduces opacity and disables press.

### Input (`<Input />`)
Standardized text entry.
- **Props**:
  - `label` (string): Optional top label.
  - `error` (string): Optional error message (turns borders red).
  - `leftIcon` / `rightIcon` (ReactNode): Appends icons inside the input field.

### Avatar (`<Avatar />`)
Displays a user or barber profile image, falling back to initials.
- **Props**:
  - `imageUrl` (string): URI of the image.
  - `initials` (string): 1-2 characters to display if no image exists.
  - `size` (number): Exact width/height of the circle.

### Header (`<Header />`)
Consistent top navigation bar.
- **Props**:
  - `title` (string): Center title.
  - `showBack` (boolean): Auto-injects a left back arrow that triggers `router.back()`.
  - `rightElement` (ReactNode): Optional right-aligned action (e.g., a filter button or settings gear).

## Layout Wrappers

### ScreenWrapper (`components/shared/ScreenWrapper.tsx`)
**CRITICAL**: Every single screen in the application MUST be wrapped in this component.
It automatically handles:
- Background color enforcement.
- `SafeAreaView` insets (preventing notches/home indicators from overlapping UI).
- Keyboard avoiding behavior for form screens.

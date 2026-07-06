# Design System & Theming

The SalonWala design system is strictly controlled by a single source of truth: `constants/theme.ts`. 

## Core Rules
1. **NO HARDCODED STYLES**: You must never use inline hex codes (e.g., `color: '#1A1A2E'`) or raw pixel values for padding (e.g., `padding: 16`).
2. **ALWAYS USE TOKENS**: Import the `Colors`, `Spacing`, `Typography`, and `Radius` objects.

## The Tokens

### Colors
- `Colors.primary` (`#1A1A2E`): Deep navy used for main headers, primary buttons, and strong text.
- `Colors.accent` (`#FF6B35`): Warm orange used for call-to-actions, queue token numbers, and highlights.
- `Colors.background` (`#F7F8FA`): The standard screen background.
- `Colors.surface` (`#FFFFFF`): The background for cards, modals, and elevated elements.

### Typography
The system uses a typographic scale based on object spreads. 
Example usage: `<Text style={[Typography.titleM, { color: Colors.textPrimary }]}>`

- `displayXL`, `displayL`, `displayM`: Massive headers (Hero sections).
- `titleL`, `titleM`, `titleS`: Standard section headers and card titles.
- `bodyL`, `bodyM`, `bodyS`: Standard reading text.
- `caption`: Tiny text for timestamps and metadata.
- `label`: Uppercase, widely-spaced text for overlines and tags.

### Spacing & Radius
- Use `Spacing.xs` (4) through `Spacing.xxxxxl` (48) for all margins and paddings.
- Use `Radius.s` (6) through `Radius.full` (999) for border radii.

## Shadows
Always spread the shadow token onto elevated components to ensure cross-platform consistency (iOS shadows vs Android elevation).
Example: `<View style={{ ...Shadow.card }}>`

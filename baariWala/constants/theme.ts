// constants/theme.ts - SalonWala MATERIAL 3 DESIGN SYSTEM

export const Colors = {
  // Backgrounds & Surfaces
  background:     '#F6F6F6',  // body bg
  surface:        '#FFFFFF',  // var(--bg)
  surfacePink:    '#FFF5F7',  // var(--pink)
  surfaceGrey:    '#F2F2F2',  // icon bg
  
  // Accents / Colors
  primary:        '#111111',  // Used for prominent elements like Book btn
  primaryDark:    '#000000',
  secondary:      '#E5364A',  // Used for notification dot
  success:        '#2E9E5B',  // Used for Open Now badge
  
  // Text / Neutrals
  textPrimary:    '#111111',  // var(--ink)
  textSecondary:  '#6B6B6B',  // var(--ink-soft)
  textInverse:    '#FFFFFF',
  iconInactive:   '#9C9C9C',  // var(--grey-icon)
  
  // Borders
  border:         '#ECECEC',  // var(--line)
  borderPink:     '#F6D9E0',  // var(--pink-line)

  // Status map (for backward compatibility if needed)
  error:          '#E5364A',
  warning:        '#F2A93B',
  info:           '#0F6E56',
  transparent:    'transparent',
} as const;

export const Typography = {
  // Poppins
  displayXL: { fontFamily: 'Poppins_800ExtraBold', fontSize: 34, lineHeight: 40 },
  displayL:  { fontFamily: 'Poppins_700Bold', fontSize: 26, lineHeight: 32 },
  displayM:  { fontFamily: 'Poppins_700Bold', fontSize: 22, lineHeight: 28 },
  titleL:    { fontFamily: 'Poppins_600SemiBold', fontSize: 18, lineHeight: 24 },
  titleM:    { fontFamily: 'Poppins_600SemiBold', fontSize: 15.5, lineHeight: 22 },
  titleS:    { fontFamily: 'Poppins_600SemiBold', fontSize: 14, lineHeight: 20 },
  bodyL:     { fontFamily: 'Poppins_500Medium', fontSize: 15, lineHeight: 22 },
  bodyM:     { fontFamily: 'Poppins_400Regular', fontSize: 13.5, lineHeight: 20 },
  bodyS:     { fontFamily: 'Poppins_400Regular', fontSize: 12, lineHeight: 18 },
  caption:   { fontFamily: 'Poppins_400Regular', fontSize: 11.5, lineHeight: 16 },
  label:     { fontFamily: 'Poppins_600SemiBold', fontSize: 12.5, letterSpacing: 0.5, textTransform: 'uppercase' as const },
} as const;

export const Spacing = {
  xs: 4, 
  s: 8, 
  m: 12, 
  l: 16, 
  xl: 22, 
  xxl: 24, 
  xxxl: 32,
} as const;

export const Radius = {
  s: 10, 
  m: 14, 
  l: 16, 
  xl: 36,
  full: 999 
} as const;

export const Shadow = {
  // Based on HTML Material 3 box-shadows
  card: {
    shadowColor: '#111111',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.07,
    shadowRadius: 24,
    elevation: 4,
  },
  cardSm: {
    shadowColor: '#111111',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
  },
  // Used in backwards compatible places
  floating: {
    shadowColor: '#111111',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.07,
    shadowRadius: 24,
    elevation: 4,
  },
  layered: {
    shadowColor: '#111111',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
  },
} as const;

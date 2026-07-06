import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ActivityIndicator, 
  TouchableOpacityProps 
} from 'react-native';
import { Colors, Typography, Spacing, Radius } from '../../constants/theme';

export type ButtonVariant = 'primary' | 'secondary' | 'accent' | 'ghost' | 'danger';
export type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps extends TouchableOpacityProps {
  label: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  isFullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  accessibilityLabel?: string;
}

export const Button: React.FC<ButtonProps> = ({
  label,
  variant = 'primary',
  size = 'medium',
  isLoading = false,
  isFullWidth = true,
  disabled,
  style,
  leftIcon,
  rightIcon,
  accessibilityLabel,
  ...props
}) => {
  const isDisabled = disabled || isLoading;

  // Variant Styles
  const getBackgroundColor = () => {
    switch (variant) {
      case 'primary': return Colors.primary;
      case 'secondary': return Colors.surface;
      case 'accent': return Colors.accent;
      case 'danger': return Colors.error;
      case 'ghost': return Colors.transparent;
      default: return Colors.primary;
    }
  };

  const getTextColor = () => {
    if (isDisabled && variant !== 'ghost') return Colors.textInverse;
    switch (variant) {
      case 'primary':
      case 'accent':
      case 'danger':
        return Colors.textInverse;
      case 'secondary':
        return Colors.textPrimary;
      case 'ghost':
        return Colors.textSecondary;
      default:
        return Colors.textInverse;
    }
  };

  const getBorderColor = () => {
    if (variant === 'secondary') return Colors.border;
    return 'transparent';
  };

  // Size Styles
  const getHeight = () => {
    switch (size) {
      case 'small': return 32;
      case 'medium': return 48; // minimum touch target 48x48
      case 'large': return 56;
      default: return 48;
    }
  };

  const getPadding = () => {
    switch (size) {
      case 'small': return Spacing.m;
      case 'medium': return Spacing.xl;
      case 'large': return Spacing.xxl;
      default: return Spacing.xl;
    }
  };

  const getTextVariant = () => {
    switch (size) {
      case 'small': return Typography.bodyS;
      case 'large': return Typography.titleM;
      case 'medium':
      default:
        return Typography.bodyM;
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || label}
      accessibilityState={{ disabled: isDisabled, busy: isLoading }}
      style={[
        styles.button,
        {
          backgroundColor: getBackgroundColor(),
          borderColor: getBorderColor(),
          borderWidth: variant === 'secondary' ? 1 : 0,
          height: getHeight(),
          paddingHorizontal: getPadding(),
          opacity: isDisabled ? 0.6 : 1,
          alignSelf: isFullWidth ? 'stretch' : 'flex-start',
        },
        style,
      ]}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator color={getTextColor()} />
      ) : (
        <>
          {leftIcon && leftIcon}
          <Text
            style={[
              styles.text,
              getTextVariant(),
              { color: getTextColor(), fontWeight: '600' },
              leftIcon && { marginLeft: Spacing.s },
              rightIcon && { marginRight: Spacing.s },
            ]}
          >
            {label}
          </Text>
          {rightIcon && rightIcon}
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.m, // 10px standard radius for buttons
    minWidth: 48, // Accessibility minimum touch target
  },
  text: {
    textAlign: 'center',
  },
});

import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TextInputProps } from 'react-native';
import { Colors, Radius, Spacing, Typography } from '../../constants/theme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  hint,
  leftIcon,
  rightIcon,
  style,
  onFocus,
  onBlur,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = (e: any) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  const getBorderColor = () => {
    if (error) return Colors.error;
    if (isFocused) return Colors.primary;
    return Colors.border;
  };

  return (
    <View style={styles.container}>
      {label && (
        <Text style={[Typography.bodyS, styles.label]}>
          {label}
        </Text>
      )}
      
      <View
        style={[
          styles.inputContainer,
          { borderColor: getBorderColor(), borderWidth: isFocused || error ? 1.5 : 1 },
        ]}
      >
        {leftIcon && <View style={styles.iconLeft}>{leftIcon}</View>}
        
        <TextInput
          style={[
            styles.input,
            Typography.bodyM,
            { color: Colors.textPrimary },
            leftIcon ? { paddingLeft: Spacing.s } : {},
            rightIcon ? { paddingRight: Spacing.s } : {},
            style,
          ]}
          placeholderTextColor={Colors.textTertiary}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...props}
        />
        
        {rightIcon && <View style={styles.iconRight}>{rightIcon}</View>}
      </View>

      {error ? (
        <Text style={[Typography.caption, styles.errorText]}>{error}</Text>
      ) : hint ? (
        <Text style={[Typography.caption, styles.hintText]}>{hint}</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.xxl, // 24px vertical spacing between fields
  },
  label: {
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: Spacing.xs, // 4px bottom margin
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    backgroundColor: Colors.surface,
    borderRadius: Radius.m, // 10px radius
    paddingHorizontal: Spacing.l, // 16px padding
  },
  input: {
    flex: 1,
    height: '100%',
  },
  iconLeft: {
    marginRight: Spacing.xs,
  },
  iconRight: {
    marginLeft: Spacing.xs,
  },
  errorText: {
    color: Colors.error,
    marginTop: Spacing.xs,
  },
  hintText: {
    color: Colors.textTertiary,
    marginTop: Spacing.xs,
  },
});

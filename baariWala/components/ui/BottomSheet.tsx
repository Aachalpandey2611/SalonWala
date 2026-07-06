import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Radius, Spacing, Shadow, Typography } from '../../constants/theme';
// Note: In a full project, this would use @gorhom/bottom-sheet. 
// This is a styled UI representation built from primitives.

/**
 * ==========================================
 * COMPONENT: BottomSheet
 * ==========================================
 * Purpose: Slide-up panel for secondary flows or selectors.
 * 
 * Props:
 * - title (string): Header title
 * - onClose (function): Close handler
 * - children (ReactNode): Content
 */

interface BottomSheetProps {
  title?: string;
  onClose: () => void;
  children: React.ReactNode;
}

export const BottomSheet: React.FC<BottomSheetProps> = ({ title, onClose, children }) => {
  return (
    <View style={styles.overlay}>
      <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />
      
      <View style={styles.sheet}>
        <View style={styles.dragHandleContainer}>
          <View style={styles.dragHandle} />
        </View>
        
        {title && (
          <View style={styles.header}>
            <Text style={[Typography.titleL, { color: Colors.textPrimary }]}>{title}</Text>
            <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Ionicons name="close" size={24} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>
        )}
        
        <View style={styles.content}>
          {children}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    backgroundColor: Colors.overlay,
    zIndex: 1000,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  sheet: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    paddingBottom: Spacing.xxxxxl, // Safe area padding
    ...Shadow.modal,
  },
  dragHandleContainer: {
    alignItems: 'center',
    paddingVertical: Spacing.m,
  },
  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: Colors.border,
    borderRadius: Radius.full,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.m,
  },
  content: {
    paddingHorizontal: Spacing.xl,
  },
});

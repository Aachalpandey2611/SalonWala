import React from 'react';
import { View, StyleSheet, Modal as RNModal, TouchableOpacity, Text } from 'react-native';
import { Colors, Radius, Spacing, Shadow, Typography } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { Button } from './Button';

/**
 * ==========================================
 * COMPONENT: Modal
 * ==========================================
 * Purpose: Centered overlay for critical interactions or confirmations.
 * 
 * Props:
 * - visible (boolean): Controls visibility
 * - title (string): Modal header title
 * - onClose (function): Function to dismiss
 * - onConfirm (function): Primary action
 * - confirmText (string): Text for primary action
 * - type ('default' | 'danger'): Determines button styling
 */

interface ModalProps {
  visible: boolean;
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  onConfirm?: () => void;
  confirmText?: string;
  type?: 'default' | 'danger';
}

export const Modal: React.FC<ModalProps> = ({
  visible,
  title,
  children,
  onClose,
  onConfirm,
  confirmText = 'Confirm',
  type = 'default',
}) => {
  return (
    <RNModal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />
        
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={[Typography.titleL, { color: Colors.textPrimary }]}>{title}</Text>
            <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Ionicons name="close" size={24} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.body}>
            {children}
          </View>

          {onConfirm && (
            <View style={styles.footer}>
              <Button 
                label="Cancel" 
                variant="ghost" 
                onPress={onClose} 
                style={styles.cancelBtn}
                isFullWidth={false}
              />
              <Button 
                label={confirmText} 
                variant={type === 'danger' ? 'danger' : 'primary'} 
                onPress={onConfirm} 
                isFullWidth={false}
              />
            </View>
          )}
        </View>
      </View>
    </RNModal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.overlay,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  content: {
    width: '85%',
    maxWidth: 400,
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: Spacing.xl,
    ...Shadow.modal,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.l,
  },
  body: {
    marginBottom: Spacing.xl,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  cancelBtn: {
    marginRight: Spacing.m,
  }
});

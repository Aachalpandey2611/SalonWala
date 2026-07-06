import React, { useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Radius, Spacing, Typography, Shadow } from '../../constants/theme';
import { QueueDNARing } from '../../components/ui/QueueDNARing';
import { DUMMY_QUEUE, DUMMY_SERVICES_LIST, QueueItem, STATUS_STYLE } from '../../data/live-queue';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  SlideInDown,
  SlideOutDown,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

// ─── LIVE INDICATORS ──────────────────────────────────────────────────────────

const LiveIndicators = ({ queue }: { queue: QueueItem[] }) => {
  const waiting = queue.filter(q => ['waiting', 'called'].includes(q.status)).length;
  const completed = 18; // dummy

  return (
    <View style={styles.indicatorsBar}>
      <View style={styles.indicator}>
        <View style={{ height: 60, justifyContent: 'center' }}>
          <QueueDNARing position={waiting} total={waiting + completed} size={60} />
        </View>
        <Text style={[Typography.caption, styles.indicatorLabel, { marginTop: 8 }]}>Waiting</Text>
      </View>
      <View style={styles.indicatorDivider} />
      <View style={styles.indicator}>
        <Text style={[Typography.displayM, styles.indicatorValue]}>{completed}</Text>
        <Text style={[Typography.caption, styles.indicatorLabel]}>Done Today</Text>
      </View>
      <View style={styles.indicatorDivider} />
      <View style={styles.indicator}>
        <Text style={[Typography.displayM, styles.indicatorValue]}>14m</Text>
        <Text style={[Typography.caption, styles.indicatorLabel]}>Avg Wait</Text>
      </View>
      <View style={styles.indicatorDivider} />
      <View style={styles.indicator}>
        <Text style={[Typography.displayM, styles.indicatorValue]}>28m</Text>
        <Text style={[Typography.caption, styles.indicatorLabel]}>Serving</Text>
      </View>
    </View>
  );
};

// ─── CURRENT CUSTOMER CARD ────────────────────────────────────────────────────

const CurrentCustomerCard = ({
  customer,
  onDone,
}: {
  customer: QueueItem;
  onDone: () => void;
}) => {
  const doneScale = useSharedValue(1);
  const doneStyle = useAnimatedStyle(() => ({ transform: [{ scale: doneScale.value }] }));

  return (
    <Animated.View entering={FadeIn.duration(400)} style={styles.currentCard}>
      {/* Token + Status Row */}
      <View style={styles.currentTopRow}>
        <View style={styles.currentTokenBox}>
          <Text style={[Typography.caption, { color: Colors.textTertiary, marginBottom: 2 }]}>Now Serving</Text>
          <Text style={styles.currentTokenText}>#{customer.tokenNumber}</Text>
        </View>
        <View>
          <View style={[styles.sourceBadge, { backgroundColor: customer.source === 'booking' ? '#E8EAF6' : Colors.accentSoft }]}>
            <Ionicons
              name={customer.source === 'booking' ? 'calendar' : 'walk'}
              size={12}
              color={customer.source === 'booking' ? Colors.primary : Colors.accent}
            />
            <Text style={[Typography.caption, { marginLeft: 4, color: customer.source === 'booking' ? Colors.primary : Colors.accent, fontWeight: '600' }]}>
              {customer.source === 'booking' ? 'Booking' : 'Walk-in'}
            </Text>
          </View>
          {customer.checkedIn && (
            <View style={[styles.sourceBadge, { backgroundColor: Colors.successSoft, marginTop: 4 }]}>
              <Ionicons name="location" size={12} color={Colors.success} />
              <Text style={[Typography.caption, { marginLeft: 4, color: Colors.success, fontWeight: '600' }]}>Checked In</Text>
            </View>
          )}
        </View>
      </View>

      {/* Customer Info */}
      <Text style={[Typography.displayM, { color: Colors.textPrimary, marginBottom: Spacing.xs }]}>
        {customer.customerName}
      </Text>
      <Text style={[Typography.bodyM, { color: Colors.textSecondary, marginBottom: Spacing.l }]}>
        {customer.service} · {customer.serviceDuration} min · {customer.phone}
      </Text>

      {/* Time Row */}
      <View style={styles.currentTimeRow}>
        <View style={styles.currentTimeItem}>
          <Ionicons name="time-outline" size={16} color={Colors.textSecondary} />
          <Text style={[Typography.caption, { color: Colors.textSecondary, marginLeft: 4 }]}>Started</Text>
          <Text style={[Typography.label, { color: Colors.textPrimary, marginLeft: 4 }]}>{customer.waitingSince}</Text>
        </View>
        <View style={styles.currentTimeItem}>
          <Ionicons name="hourglass-outline" size={16} color={Colors.accent} />
          <Text style={[Typography.caption, { color: Colors.textSecondary, marginLeft: 4 }]}>Elapsed</Text>
          <Text style={[Typography.label, { color: Colors.accent, marginLeft: 4, fontWeight: '700' }]}>28 min</Text>
        </View>
      </View>

      {/* Primary DONE button */}
      <Animated.View style={doneStyle}>
        <TouchableOpacity
          style={styles.doneButton}
          onPress={onDone}
          onPressIn={() => { doneScale.value = withSpring(0.97); }}
          onPressOut={() => { doneScale.value = withSpring(1); }}
          activeOpacity={1}
        >
          <Ionicons name="checkmark-circle" size={24} color={Colors.surface} />
          <Text style={styles.doneButtonText}>DONE → CALL NEXT</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Secondary actions */}
      <View style={styles.secondaryActions}>
        <TouchableOpacity style={styles.secondaryBtn}>
          <Ionicons name="close-circle-outline" size={18} color={Colors.error} />
          <Text style={[Typography.caption, { color: Colors.error, marginLeft: 4 }]}>No Show</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondaryBtn}>
          <Ionicons name="pause-circle-outline" size={18} color={Colors.textSecondary} />
          <Text style={[Typography.caption, { color: Colors.textSecondary, marginLeft: 4 }]}>Standby</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondaryBtn}>
          <Ionicons name="call-outline" size={18} color={Colors.primary} />
          <Text style={[Typography.caption, { color: Colors.primary, marginLeft: 4 }]}>Call</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondaryBtn}>
          <Ionicons name="create-outline" size={18} color={Colors.textSecondary} />
          <Text style={[Typography.caption, { color: Colors.textSecondary, marginLeft: 4 }]}>Edit</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

// ─── QUEUE ITEM CARD ──────────────────────────────────────────────────────────

const QueueItemCard = ({
  item,
  index,
  onLongPress,
}: {
  item: QueueItem;
  index: number;
  onLongPress: (item: QueueItem) => void;
}) => {
  const statusStyle = STATUS_STYLE[item.status];

  return (
    <Animated.View entering={FadeInDown.duration(350).delay(index * 50)}>
      <TouchableOpacity
        activeOpacity={0.85}
        onLongPress={() => onLongPress(item)}
        delayLongPress={300}
        style={styles.queueCard}
      >
        {/* Token */}
        <View style={[styles.queueToken, { backgroundColor: item.status === 'standby' ? Colors.borderSubtle : Colors.accentSoft }]}>
          <Text style={[Typography.titleS, { color: item.status === 'standby' ? Colors.textTertiary : Colors.accent, fontWeight: '800' }]}>
            #{item.tokenNumber}
          </Text>
        </View>

        {/* Info */}
        <View style={styles.queueInfo}>
          <View style={styles.queueTopRow}>
            <Text style={[Typography.titleS, { color: Colors.textPrimary, flex: 1 }]} numberOfLines={1}>
              {item.customerName}
            </Text>
            {/* Source badge */}
            <View style={[styles.miniSourceBadge, { backgroundColor: item.source === 'booking' ? '#E8EAF6' : Colors.accentSoft }]}>
              <Text style={[Typography.caption, { color: item.source === 'booking' ? Colors.primary : Colors.accent, fontWeight: '600', fontSize: 10 }]}>
                {item.source === 'booking' ? 'B' : 'W'}
              </Text>
            </View>
          </View>
          <Text style={[Typography.caption, { color: Colors.textSecondary }]}>
            {item.service} · Est. {item.estimatedStart}
          </Text>
          {!item.checkedIn && (
            <Text style={[Typography.caption, { color: Colors.warning, marginTop: 2 }]}>
              ⚠ Not Checked In
            </Text>
          )}
        </View>

        {/* Status + Actions */}
        <View style={styles.queueRight}>
          <View style={[styles.queueStatusBadge, { backgroundColor: statusStyle.bg }]}>
            <Text style={[Typography.caption, { color: statusStyle.color, fontWeight: '600', fontSize: 10 }]}>
              {statusStyle.label}
            </Text>
          </View>
          <TouchableOpacity style={styles.queueAction} onPress={() => onLongPress(item)}>
            <Ionicons name="ellipsis-vertical" size={18} color={Colors.textTertiary} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

// ─── CUSTOMER DETAILS BOTTOM SHEET ────────────────────────────────────────────

const CustomerDetailsSheet = ({
  customer,
  onClose,
}: {
  customer: QueueItem;
  onClose: () => void;
}) => {
  const statusStyle = STATUS_STYLE[customer.status];

  return (
    <View style={styles.sheetOverlay}>
      <TouchableOpacity style={styles.sheetBackdrop} onPress={onClose} activeOpacity={1} />
      <Animated.View entering={SlideInDown.duration(350).springify()} exiting={SlideOutDown} style={styles.sheet}>
        {/* Handle */}
        <View style={styles.sheetHandle} />

        <Text style={[Typography.titleM, { color: Colors.textPrimary, marginBottom: Spacing.m }]}>
          Customer Details
        </Text>

        <View style={styles.sheetRow}>
          <Ionicons name="person-circle-outline" size={48} color={Colors.primary} style={{ marginRight: Spacing.m }} />
          <View style={{ flex: 1 }}>
            <Text style={[Typography.titleM, { color: Colors.textPrimary }]}>{customer.customerName}</Text>
            <Text style={[Typography.bodyM, { color: Colors.textSecondary }]}>{customer.phone}</Text>
          </View>
          <View style={[styles.queueStatusBadge, { backgroundColor: statusStyle.bg }]}>
            <Text style={[Typography.caption, { color: statusStyle.color, fontWeight: '600' }]}>{statusStyle.label}</Text>
          </View>
        </View>

        <View style={styles.sheetDivider} />

        {/* Details */}
        {[
          { label: 'Service',   value: customer.service },
          { label: 'Token',     value: `#${customer.tokenNumber}` },
          { label: 'Est. Start', value: customer.estimatedStart },
          { label: 'Source',    value: customer.source === 'booking' ? 'Pre-Booking' : 'Walk-in' },
          { label: 'Check-in',  value: customer.checkedIn ? 'Yes ✓' : 'Not yet' },
        ].map(({ label, value }) => (
          <View key={label} style={styles.detailRow}>
            <Text style={[Typography.bodyM, { color: Colors.textSecondary, width: 90 }]}>{label}</Text>
            <Text style={[Typography.bodyM, { color: Colors.textPrimary, fontWeight: '600', flex: 1 }]}>{value}</Text>
          </View>
        ))}

        {customer.notes && (
          <View style={styles.notesBox}>
            <Text style={[Typography.caption, { color: Colors.textTertiary, marginBottom: 4 }]}>Notes</Text>
            <Text style={[Typography.bodyM, { color: Colors.textPrimary }]}>{customer.notes}</Text>
          </View>
        )}

        <View style={styles.sheetDivider} />

        {/* Sheet Actions */}
        <View style={styles.sheetActions}>
          <TouchableOpacity style={[styles.sheetActionBtn, { backgroundColor: '#E8EAF6' }]}>
            <Ionicons name="call" size={20} color={Colors.primary} />
            <Text style={[Typography.label, { color: Colors.primary, marginTop: 4 }]}>Call</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.sheetActionBtn, { backgroundColor: Colors.successSoft }]}>
            <Ionicons name="checkmark-circle" size={20} color={Colors.success} />
            <Text style={[Typography.label, { color: Colors.success, marginTop: 4 }]}>Done</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.sheetActionBtn, { backgroundColor: Colors.warningSoft }]}>
            <Ionicons name="pause-circle" size={20} color={Colors.warning} />
            <Text style={[Typography.label, { color: Colors.warning, marginTop: 4 }]}>Standby</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.sheetActionBtn, { backgroundColor: Colors.errorSoft }]}>
            <Ionicons name="close-circle" size={20} color={Colors.error} />
            <Text style={[Typography.label, { color: Colors.error, marginTop: 4 }]}>No Show</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
};

// ─── WALK-IN BOTTOM SHEET ─────────────────────────────────────────────────────

const SERVICES_LIST = ['Haircut', 'Beard Trim', 'Hair Color', 'Facial', 'Haircut + Beard'];

const WalkInSheet = ({ onClose, onAdd }: { onClose: () => void; onAdd: () => void }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedService, setSelectedService] = useState(SERVICES_LIST[0]);
  const phoneRef = useRef<TextInput>(null);

  return (
    <View style={styles.sheetOverlay}>
      <TouchableOpacity style={styles.sheetBackdrop} onPress={onClose} activeOpacity={1} />
      <Animated.View entering={SlideInDown.duration(350).springify()} exiting={SlideOutDown} style={[styles.sheet, styles.walkInSheet]}>
        <View style={styles.sheetHandle} />

        <Text style={[Typography.titleM, { color: Colors.textPrimary, marginBottom: Spacing.l }]}>
          Add Walk-in Customer
        </Text>

        {/* Name */}
        <Text style={styles.walkInLabel}>Customer Name</Text>
        <TextInput
          style={styles.walkInInput}
          placeholder="Enter name (or leave blank)"
          placeholderTextColor={Colors.textTertiary}
          value={name}
          onChangeText={setName}
          returnKeyType="next"
          onSubmitEditing={() => phoneRef.current?.focus()}
        />

        {/* Phone */}
        <Text style={styles.walkInLabel}>Phone Number</Text>
        <TextInput
          ref={phoneRef}
          style={styles.walkInInput}
          placeholder="+91 XXXXX XXXXX"
          placeholderTextColor={Colors.textTertiary}
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
          returnKeyType="done"
        />

        {/* Service */}
        <Text style={styles.walkInLabel}>Service</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingBottom: Spacing.m }}>
          {SERVICES_LIST.map(s => (
            <TouchableOpacity
              key={s}
              onPress={() => setSelectedService(s)}
              style={[styles.serviceChip, selectedService === s && styles.serviceChipActive]}
            >
              <Text style={[Typography.bodyM, { color: selectedService === s ? Colors.surface : Colors.textSecondary, fontWeight: selectedService === s ? '600' : '400' }]}>
                {s}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Add Button */}
        <TouchableOpacity
          style={styles.addWalkInBtn}
          onPress={() => { onAdd(); onClose(); }}
          activeOpacity={0.85}
        >
          <Ionicons name="add-circle" size={22} color={Colors.surface} />
          <Text style={styles.addWalkInBtnText}>Add to Queue</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

// ─── MAIN SCREEN ──────────────────────────────────────────────────────────────

export default function LiveQueueScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [queue, setQueue] = useState(DUMMY_QUEUE);
  const [selectedCustomer, setSelectedCustomer] = useState<QueueItem | null>(null);
  const [showWalkIn, setShowWalkIn] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const currentCustomer = queue.find(q => q.status === 'serving');
  const waitingQueue = queue.filter(q => ['waiting', 'called', 'standby'].includes(q.status));

  const handleDone = useCallback(() => {
    setQueue(prev => {
      const updated = [...prev];
      const currentIdx = updated.findIndex(q => q.status === 'serving');
      if (currentIdx !== -1) {
        updated[currentIdx] = { ...updated[currentIdx], status: 'completed' };
      }
      // Promote next waiting customer
      const nextIdx = updated.findIndex(q => q.status === 'waiting');
      if (nextIdx !== -1) {
        updated[nextIdx] = { ...updated[nextIdx], status: 'serving' };
      }
      return updated;
    });
  }, []);

  const handleCallNext = useCallback(() => {
    const next = waitingQueue.find(q => q.status === 'waiting');
    if (!next) return;
    setQueue(prev => prev.map(q => q.id === next.id ? { ...q, status: 'called' } : q));
  }, [waitingQueue]);

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.screenHeader}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[Typography.titleM, { color: Colors.textPrimary, flex: 1, marginLeft: Spacing.m }]}>
          Live Queue
        </Text>
        <View style={[styles.liveIndicator, { backgroundColor: isPaused ? Colors.warningSoft : Colors.successSoft }]}>
          <View style={[styles.liveDot, { backgroundColor: isPaused ? Colors.warning : Colors.success }]} />
          <Text style={[Typography.caption, { color: isPaused ? Colors.warning : Colors.success, fontWeight: '600' }]}>
            {isPaused ? 'PAUSED' : 'LIVE'}
          </Text>
        </View>
      </View>

      {/* Live Indicators Bar */}
      <LiveIndicators queue={queue} />

      {/* Scrollable Content */}
      <FlatList
        data={waitingQueue}
        keyExtractor={item => item.id}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 120 + insets.bottom }]}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            {/* Current Customer Card */}
            {currentCustomer ? (
              <View style={styles.section}>
                <CurrentCustomerCard customer={currentCustomer} onDone={handleDone} />
              </View>
            ) : (
              <Animated.View entering={FadeInDown.duration(400)} style={[styles.section, styles.idleCard]}>
                <Ionicons name="checkmark-circle" size={48} color={Colors.success} />
                <Text style={[Typography.titleM, { color: Colors.textPrimary, marginTop: Spacing.m }]}>
                  Queue is Free!
                </Text>
                <Text style={[Typography.bodyM, { color: Colors.textSecondary, marginTop: Spacing.xs }]}>
                  Call next customer to start serving.
                </Text>
                <TouchableOpacity style={styles.callNextInlineBtn} onPress={handleCallNext}>
                  <Text style={styles.doneButtonText}>Call Next Customer</Text>
                </TouchableOpacity>
              </Animated.View>
            )}

            {/* Queue List Header */}
            <View style={styles.queueListHeader}>
              <Text style={[Typography.titleM, { color: Colors.textPrimary }]}>
                Queue ({waitingQueue.length})
              </Text>
              <TouchableOpacity>
                <Text style={[Typography.label, { color: Colors.accent }]}>Sort</Text>
              </TouchableOpacity>
            </View>
          </>
        }
        renderItem={({ item, index }) => (
          <View style={styles.section}>
            <QueueItemCard
              item={item}
              index={index}
              onLongPress={setSelectedCustomer}
            />
          </View>
        )}
        ListEmptyComponent={
          <Animated.View entering={FadeIn.duration(400)} style={styles.emptyQueue}>
            <Ionicons name="list-outline" size={56} color={Colors.border} />
            <Text style={[Typography.titleM, { color: Colors.textPrimary, marginTop: Spacing.m }]}>
              Queue is Empty
            </Text>
            <Text style={[Typography.bodyM, { color: Colors.textSecondary, marginTop: Spacing.xs, textAlign: 'center' }]}>
              Add a walk-in or wait for customers to arrive.
            </Text>
          </Animated.View>
        }
      />

      {/* ─── STICKY QUICK ACTION BAR ─── */}
      <View style={[styles.quickBar, { paddingBottom: Math.max(insets.bottom, Spacing.m) }]}>
        <TouchableOpacity style={[styles.quickBarBtn, styles.quickBarBtnPrimary]} onPress={handleCallNext}>
          <Ionicons name="megaphone" size={18} color={Colors.surface} />
          <Text style={styles.quickBarBtnTextPrimary}>Call Next</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.quickBarBtn} onPress={() => setShowWalkIn(true)}>
          <Ionicons name="add-circle-outline" size={18} color={Colors.primary} />
          <Text style={styles.quickBarBtnText}>Walk-in</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.quickBarBtn, isPaused && { backgroundColor: Colors.warningSoft }]}
          onPress={() => setIsPaused(p => !p)}
        >
          <Ionicons name={isPaused ? 'play-circle-outline' : 'pause-circle-outline'} size={18} color={isPaused ? Colors.warning : Colors.textSecondary} />
          <Text style={[styles.quickBarBtnText, isPaused && { color: Colors.warning }]}>
            {isPaused ? 'Resume' : 'Pause'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.quickBarBtn}>
          <Ionicons name="cafe-outline" size={18} color={Colors.textSecondary} />
          <Text style={styles.quickBarBtnText}>Break</Text>
        </TouchableOpacity>
      </View>

      {/* ─── CUSTOMER DETAILS BOTTOM SHEET ─── */}
      {selectedCustomer && (
        <CustomerDetailsSheet
          customer={selectedCustomer}
          onClose={() => setSelectedCustomer(null)}
        />
      )}

      {/* ─── WALK-IN BOTTOM SHEET ─── */}
      {showWalkIn && (
        <KeyboardAvoidingView
          style={StyleSheet.absoluteFill}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          pointerEvents="box-none"
        >
          <WalkInSheet
            onClose={() => setShowWalkIn(false)}
            onAdd={() => Alert.alert('Walk-in Added!', 'Customer added to queue successfully.')}
          />
        </KeyboardAvoidingView>
      )}
    </View>
  );
}

// ─── STYLES ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  screenHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.l,
    paddingVertical: Spacing.m,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderSubtle,
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.m,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.full,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: Spacing.xs,
  },
  indicatorsBar: {
    flexDirection: 'row',
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.m,
  },
  indicator: {
    flex: 1,
    alignItems: 'center',
  },
  indicatorValue: {
    color: Colors.textInverse,
    fontSize: 20,
    fontWeight: '700',
  },
  indicatorLabel: {
    color: Colors.textInverse,
    opacity: 0.7,
    marginTop: 2,
  },
  indicatorDivider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginVertical: Spacing.s,
  },
  scrollContent: {
    paddingTop: Spacing.m,
  },
  section: {
    paddingHorizontal: Spacing.l,
    marginBottom: Spacing.m,
  },
  // ─── Current Customer ───
  currentCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: Spacing.l,
    ...Shadow.floating,
    borderLeftWidth: 4,
    borderLeftColor: Colors.success,
  },
  currentTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.m,
  },
  currentTokenBox: {},
  currentTokenText: {
    fontSize: 48,
    fontWeight: '900',
    color: Colors.accent,
    letterSpacing: -2,
    lineHeight: 52,
  },
  sourceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.s,
    paddingVertical: 4,
    borderRadius: Radius.full,
  },
  currentTimeRow: {
    flexDirection: 'row',
    backgroundColor: Colors.background,
    borderRadius: Radius.m,
    padding: Spacing.m,
    marginBottom: Spacing.l,
  },
  currentTimeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: Spacing.xl,
  },
  doneButton: {
    backgroundColor: Colors.success,
    borderRadius: Radius.l,
    paddingVertical: Spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.m,
    ...Shadow.card,
  },
  doneButtonText: {
    color: Colors.surface,
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginLeft: Spacing.s,
  },
  secondaryActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: Colors.borderSubtle,
    paddingTop: Spacing.m,
  },
  secondaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.s,
  },
  idleCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: Spacing.xl,
    alignItems: 'center',
    ...Shadow.card,
  },
  callNextInlineBtn: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.l,
    paddingVertical: Spacing.l,
    paddingHorizontal: Spacing.xl,
    marginTop: Spacing.l,
  },
  // ─── Queue List ───
  queueListHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.l,
    marginBottom: Spacing.s,
  },
  queueCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radius.l,
    padding: Spacing.m,
    ...Shadow.card,
  },
  queueToken: {
    width: 52,
    height: 52,
    borderRadius: Radius.m,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.m,
  },
  queueInfo: {
    flex: 1,
    marginRight: Spacing.s,
  },
  queueTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  miniSourceBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: Spacing.s,
  },
  queueRight: {
    alignItems: 'flex-end',
  },
  queueStatusBadge: {
    paddingHorizontal: Spacing.s,
    paddingVertical: 3,
    borderRadius: Radius.s,
    marginBottom: Spacing.xs,
  },
  queueAction: {
    padding: Spacing.xs,
  },
  emptyQueue: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xxxxxl,
  },
  // ─── Quick Action Bar ───
  quickBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    paddingTop: Spacing.m,
    paddingHorizontal: Spacing.m,
    borderTopWidth: 1,
    borderTopColor: Colors.borderSubtle,
    ...Shadow.floating,
  },
  quickBarBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.m,
    borderRadius: Radius.m,
    marginHorizontal: 3,
  },
  quickBarBtnPrimary: {
    backgroundColor: Colors.primary,
    flex: 1.4,
  },
  quickBarBtnText: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 3,
    fontWeight: '600',
  },
  quickBarBtnTextPrimary: {
    ...Typography.caption,
    color: Colors.surface,
    marginTop: 3,
    fontWeight: '700',
  },
  // ─── Bottom Sheets ───
  sheetOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
  },
  sheetBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  sheet: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    padding: Spacing.xl,
    paddingBottom: Spacing.xxxxxl,
  },
  walkInSheet: {
    paddingBottom: Spacing.xxxl,
  },
  sheetHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.border,
    alignSelf: 'center',
    marginBottom: Spacing.l,
  },
  sheetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.m,
  },
  sheetDivider: {
    height: 1,
    backgroundColor: Colors.borderSubtle,
    marginVertical: Spacing.l,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: Spacing.m,
  },
  notesBox: {
    backgroundColor: Colors.background,
    borderRadius: Radius.m,
    padding: Spacing.m,
    marginTop: Spacing.s,
  },
  sheetActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sheetActionBtn: {
    flex: 1,
    alignItems: 'center',
    padding: Spacing.m,
    borderRadius: Radius.m,
    marginHorizontal: 4,
  },
  // ─── Walk-in ───
  walkInLabel: {
    ...Typography.bodyS,
    color: Colors.textSecondary,
    fontWeight: '600',
    marginBottom: Spacing.xs,
    marginTop: Spacing.m,
  },
  walkInInput: {
    backgroundColor: Colors.background,
    borderRadius: Radius.m,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.l,
    paddingVertical: Spacing.m,
    fontSize: 16,
    color: Colors.textPrimary,
  },
  serviceChip: {
    paddingHorizontal: Spacing.l,
    paddingVertical: Spacing.s,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    marginRight: Spacing.s,
  },
  serviceChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  addWalkInBtn: {
    backgroundColor: Colors.success,
    borderRadius: Radius.l,
    paddingVertical: Spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.xl,
  },
  addWalkInBtnText: {
    color: Colors.surface,
    fontSize: 17,
    fontWeight: '800',
    marginLeft: Spacing.s,
  },
});

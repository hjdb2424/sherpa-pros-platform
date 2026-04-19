import { useState, useRef, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  TextInput,
  Alert,
  StyleSheet,
  Animated,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, shadows, typography } from '@/lib/theme';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface Material {
  id: string;
  name: string;
  qty: number;
  unit: string;
  price: number;
}

interface MaterialsFlowProps {
  materials: Material[];
  onComplete: () => void;
}

type Step = 1 | 2 | 3 | 4 | 5;
type PaymentMethod = 'card' | 'wisetack';
type DeliveryOption = 'pro-pickup' | 'hd-delivery' | 'gig-delivery' | 'pros-choice';

const SERVICE_FEE_RATE = 0.18;

const DELIVERY_OPTIONS: {
  key: DeliveryOption;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  eta: string;
  fee: string;
}[] = [
  { key: 'pro-pickup', label: 'Pro Pickup', icon: 'storefront-outline', eta: '30 min', fee: 'Free' },
  { key: 'hd-delivery', label: 'HD Delivery', icon: 'cube-outline', eta: '1-3 days', fee: 'Free' },
  { key: 'gig-delivery', label: 'Gig Delivery', icon: 'flash-outline', eta: '1-2 hrs', fee: '$15-25' },
  { key: 'pros-choice', label: "Pro's Choice", icon: 'person-outline', eta: 'Varies', fee: '' },
];

// ---------------------------------------------------------------------------
// Progress Bar
// ---------------------------------------------------------------------------

function ProgressBar({ currentStep }: { currentStep: Step }) {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.35, duration: 800, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [pulseAnim]);

  return (
    <View style={pStyles.container}>
      {[1, 2, 3, 4, 5].map((step, index) => {
        const isDone = step < currentStep;
        const isCurrent = step === currentStep;
        const isFuture = step > currentStep;
        return (
          <View key={step} style={pStyles.stepRow}>
            {index > 0 && (
              <View
                style={[
                  pStyles.line,
                  isDone || isCurrent ? pStyles.lineDone : pStyles.lineFuture,
                ]}
              />
            )}
            {isCurrent ? (
              <Animated.View
                style={[
                  pStyles.dot,
                  pStyles.dotCurrent,
                  { transform: [{ scale: pulseAnim }] },
                ]}
              />
            ) : (
              <View
                style={[
                  pStyles.dot,
                  isDone && pStyles.dotDone,
                  isFuture && pStyles.dotFuture,
                ]}
              >
                {isDone && (
                  <Ionicons name="checkmark" size={10} color={colors.textInverse} />
                )}
              </View>
            )}
          </View>
        );
      })}
    </View>
  );
}

const pStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  line: {
    flex: 1,
    height: 2,
    marginHorizontal: 2,
  },
  lineDone: {
    backgroundColor: colors.success,
  },
  lineFuture: {
    backgroundColor: colors.borderMedium,
  },
  dot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotCurrent: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.primary,
  },
  dotDone: {
    backgroundColor: colors.success,
  },
  dotFuture: {
    backgroundColor: colors.borderMedium,
  },
});

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function MaterialsFlow({ materials, onComplete }: MaterialsFlowProps) {
  const [step, setStep] = useState<Step>(1);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);
  const [deliveryOption, setDeliveryOption] = useState<DeliveryOption | null>(null);
  const [cardLast4, setCardLast4] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [wisetackLoading, setWisetackLoading] = useState(false);
  const [wisetackApproved, setWisetackApproved] = useState(false);

  const subtotal = materials.reduce((sum, m) => sum + m.price, 0);
  const serviceFee = Math.round(subtotal * SERVICE_FEE_RATE * 100) / 100;
  const total = Math.round((subtotal + serviceFee) * 100) / 100;
  const monthlyPayment = Math.round((total / 24) * 100) / 100;

  // Confirm checkmark animation
  const checkScale = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (step === 5) {
      Animated.spring(checkScale, {
        toValue: 1,
        friction: 4,
        tension: 60,
        useNativeDriver: true,
      }).start();
    }
  }, [step, checkScale]);

  const advance = useCallback((next: Step) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setStep(next);
  }, []);

  // --- Step 1: Review Materials ---
  const renderStep1 = () => (
    <>
      <Text style={styles.stepTitle}>Review Materials</Text>
      {materials.map((mat) => (
        <Card key={mat.id} style={styles.materialCard} variant="elevated">
          <View style={styles.materialRow}>
            <View style={styles.materialInfo}>
              <Text style={styles.materialName}>{mat.name}</Text>
              <Text style={styles.materialSpec}>
                {mat.qty} {mat.unit}
              </Text>
            </View>
            <Text style={styles.materialPrice}>${mat.price}</Text>
          </View>
        </Card>
      ))}
      <View style={styles.bottomAction}>
        <Button
          title="Approve Materials"
          onPress={() => advance(2)}
          variant="primary"
          fullWidth
        />
      </View>
    </>
  );

  // --- Step 2: Choose Payment ---
  const renderStep2 = () => (
    <>
      <Text style={styles.stepTitle}>Choose Payment</Text>
      <View style={styles.paymentCards}>
        <Pressable
          style={[
            styles.paymentOption,
            paymentMethod === 'card' && styles.paymentOptionSelected,
          ]}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setPaymentMethod('card');
          }}
        >
          <View style={[styles.paymentIconCircle, { backgroundColor: '#e0f4ff' }]}>
            <Ionicons name="card-outline" size={28} color={colors.primary} />
          </View>
          <Text style={styles.paymentOptionTitle}>Pay with Card</Text>
          <Text style={styles.paymentOptionDesc}>Funds held until work is approved</Text>
        </Pressable>

        <Pressable
          style={[
            styles.paymentOption,
            paymentMethod === 'wisetack' && styles.paymentOptionSelected,
          ]}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setPaymentMethod('wisetack');
          }}
        >
          <View style={[styles.paymentIconCircle, { backgroundColor: colors.successLight }]}>
            <Ionicons name="cash-outline" size={28} color={colors.success} />
          </View>
          <Text style={styles.paymentOptionTitle}>Finance with Wisetack</Text>
          <Text style={styles.paymentOptionDesc}>Apply in seconds, pay over time</Text>
        </Pressable>
      </View>

      {/* Fee breakdown */}
      <Card style={styles.feeCard} variant="elevated">
        <View style={styles.feeRow}>
          <Text style={styles.feeLabel}>Materials Subtotal</Text>
          <Text style={styles.feeValue}>${subtotal.toFixed(2)}</Text>
        </View>
        <View style={styles.feeRow}>
          <Text style={styles.feeLabel}>Sherpa Service Fee (18%)</Text>
          <Text style={styles.feeValue}>${serviceFee.toFixed(2)}</Text>
        </View>
        <View style={[styles.feeRow, styles.feeTotalRow]}>
          <Text style={styles.feeTotalLabel}>Total</Text>
          <Text style={styles.feeTotalValue}>${total.toFixed(2)}</Text>
        </View>
      </Card>

      <View style={styles.bottomAction}>
        <Button
          title="Continue"
          onPress={() => advance(3)}
          variant="primary"
          fullWidth
          disabled={!paymentMethod}
        />
      </View>
    </>
  );

  // --- Step 3: Payment Processing ---
  const renderCardForm = () => (
    <Card style={styles.formCard} variant="elevated">
      <Text style={styles.formLabel}>Card Number (last 4)</Text>
      <TextInput
        style={styles.textInput}
        placeholder="1234"
        keyboardType="number-pad"
        maxLength={4}
        value={cardLast4}
        onChangeText={setCardLast4}
        placeholderTextColor={colors.textMuted}
      />
      <View style={styles.formRow}>
        <View style={styles.formHalf}>
          <Text style={styles.formLabel}>Expiry</Text>
          <TextInput
            style={styles.textInput}
            placeholder="MM/YY"
            maxLength={5}
            value={cardExpiry}
            onChangeText={setCardExpiry}
            placeholderTextColor={colors.textMuted}
          />
        </View>
        <View style={styles.formHalf}>
          <Text style={styles.formLabel}>CVV</Text>
          <TextInput
            style={styles.textInput}
            placeholder="123"
            keyboardType="number-pad"
            maxLength={3}
            value={cardCvv}
            onChangeText={setCardCvv}
            secureTextEntry
            placeholderTextColor={colors.textMuted}
          />
        </View>
      </View>
      <View style={{ marginTop: spacing.lg }}>
        <Button
          title={`Authorize $${total.toFixed(2)}`}
          onPress={() => advance(4)}
          variant="primary"
          fullWidth
          disabled={cardLast4.length < 4 || cardExpiry.length < 4 || cardCvv.length < 3}
        />
      </View>
    </Card>
  );

  const renderWisetack = () => {
    if (!wisetackApproved && !wisetackLoading) {
      // Start the mock loading
      setWisetackLoading(true);
      setTimeout(() => {
        setWisetackLoading(false);
        setWisetackApproved(true);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }, 2000);
    }

    if (wisetackLoading) {
      return (
        <Card style={styles.formCard} variant="elevated">
          <View style={styles.wisetackCenter}>
            <Ionicons name="hourglass-outline" size={40} color={colors.primary} />
            <Text style={styles.wisetackLoadingText}>Checking eligibility...</Text>
          </View>
        </Card>
      );
    }

    return (
      <Card style={styles.formCard} variant="elevated">
        <View style={styles.wisetackCenter}>
          <Ionicons name="checkmark-circle" size={48} color={colors.success} />
          <Text style={styles.wisetackApprovedTitle}>Approved!</Text>
          <Text style={styles.wisetackApprovedDetail}>
            ${monthlyPayment.toFixed(2)}/mo for 24 months at 9.99% APR
          </Text>
        </View>
        <View style={{ marginTop: spacing.lg }}>
          <Button
            title="Continue"
            onPress={() => advance(4)}
            variant="primary"
            fullWidth
          />
        </View>
      </Card>
    );
  };

  const renderStep3 = () => (
    <>
      <Text style={styles.stepTitle}>
        {paymentMethod === 'card' ? 'Card Payment' : 'Wisetack Financing'}
      </Text>
      {paymentMethod === 'card' ? renderCardForm() : renderWisetack()}
    </>
  );

  // --- Step 4: Choose Delivery ---
  const renderStep4 = () => (
    <>
      <Text style={styles.stepTitle}>Choose Delivery</Text>
      <View style={styles.deliveryGrid}>
        {DELIVERY_OPTIONS.map((opt) => (
          <Pressable
            key={opt.key}
            style={[
              styles.deliveryCard,
              deliveryOption === opt.key && styles.deliveryCardSelected,
            ]}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setDeliveryOption(opt.key);
            }}
          >
            <View
              style={[
                styles.deliveryIconCircle,
                deliveryOption === opt.key
                  ? { backgroundColor: colors.primaryLight }
                  : { backgroundColor: colors.surfaceSecondary },
              ]}
            >
              <Ionicons
                name={opt.icon}
                size={24}
                color={deliveryOption === opt.key ? colors.primary : colors.textMuted}
              />
            </View>
            <Text style={styles.deliveryLabel}>{opt.label}</Text>
            <Text style={styles.deliveryEta}>{opt.eta}</Text>
            {opt.fee ? (
              <Text
                style={[
                  styles.deliveryFee,
                  opt.fee === 'Free' ? { color: colors.success } : { color: colors.textSecondary },
                ]}
              >
                {opt.fee}
              </Text>
            ) : null}
          </Pressable>
        ))}
      </View>

      <View style={styles.bottomAction}>
        <Button
          title="Confirm Order"
          onPress={() => advance(5)}
          variant="primary"
          fullWidth
          disabled={!deliveryOption}
        />
      </View>
    </>
  );

  // --- Step 5: Confirmation ---
  const renderStep5 = () => {
    const deliveryLabel =
      DELIVERY_OPTIONS.find((d) => d.key === deliveryOption)?.label ?? '';
    const paymentLabel =
      paymentMethod === 'card' ? `Card ending ${cardLast4 || '****'}` : 'Wisetack Financing';
    const showTrack = deliveryOption === 'gig-delivery';

    return (
      <>
        <View style={styles.confirmCenter}>
          <Animated.View
            style={[
              styles.confirmCheckCircle,
              { transform: [{ scale: checkScale }] },
            ]}
          >
            <Ionicons name="checkmark" size={48} color={colors.textInverse} />
          </Animated.View>
          <Text style={styles.confirmTitle}>Materials Ordered!</Text>
        </View>

        <Card style={styles.confirmCard} variant="elevated">
          <View style={styles.confirmRow}>
            <Text style={styles.confirmLabel}>Items</Text>
            <Text style={styles.confirmValue}>{materials.length} materials</Text>
          </View>
          <View style={styles.confirmRow}>
            <Text style={styles.confirmLabel}>Delivery</Text>
            <Text style={styles.confirmValue}>{deliveryLabel}</Text>
          </View>
          <View style={styles.confirmRow}>
            <Text style={styles.confirmLabel}>Payment</Text>
            <Text style={styles.confirmValue}>{paymentLabel}</Text>
          </View>
          <View style={[styles.confirmRow, styles.confirmTotalRow]}>
            <Text style={styles.confirmTotalLabel}>Total</Text>
            <Text style={styles.confirmTotalValue}>${total.toFixed(2)}</Text>
          </View>
        </Card>

        <View style={styles.bottomAction}>
          <Button
            title={showTrack ? 'Track Delivery' : 'View Job'}
            onPress={() => {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              onComplete();
            }}
            variant="primary"
            fullWidth
          />
        </View>
      </>
    );
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      case 4:
        return renderStep4();
      case 5:
        return renderStep5();
    }
  };

  return (
    <View style={styles.container}>
      <ProgressBar currentStep={step} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {renderStep()}
      </ScrollView>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxxl,
  },

  // Step title
  stepTitle: {
    ...typography.heading,
    color: colors.text,
    marginBottom: spacing.lg,
  },

  // Materials list (step 1)
  materialCard: {
    marginBottom: spacing.sm,
  },
  materialRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  materialInfo: {
    flex: 1,
    marginRight: spacing.md,
  },
  materialName: {
    ...typography.bodySmall,
    fontWeight: '600',
    color: colors.text,
  },
  materialSpec: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 2,
  },
  materialPrice: {
    ...typography.bodySmall,
    fontWeight: '600',
    color: colors.text,
  },

  // Payment selection (step 2)
  paymentCards: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  paymentOption: {
    flex: 1,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    borderColor: colors.borderMedium,
    backgroundColor: colors.surface,
    alignItems: 'center',
    ...shadows.sm,
  },
  paymentOptionSelected: {
    borderColor: colors.primary,
  },
  paymentIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  paymentOptionTitle: {
    ...typography.bodySmall,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  paymentOptionDesc: {
    ...typography.caption,
    color: colors.textMuted,
    textAlign: 'center',
  },

  // Fee breakdown
  feeCard: {
    marginBottom: spacing.lg,
  },
  feeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs,
  },
  feeLabel: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  feeValue: {
    ...typography.bodySmall,
    fontWeight: '600',
    color: colors.text,
  },
  feeTotalRow: {
    marginTop: spacing.sm,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  feeTotalLabel: {
    ...typography.subheading,
    color: colors.text,
  },
  feeTotalValue: {
    ...typography.heading,
    color: colors.primary,
  },

  // Card form (step 3)
  formCard: {
    marginBottom: spacing.lg,
  },
  formLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
    marginTop: spacing.md,
  },
  textInput: {
    borderWidth: 1,
    borderColor: colors.borderMedium,
    borderRadius: borderRadius.sm,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    ...typography.body,
    color: colors.text,
  },
  formRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  formHalf: {
    flex: 1,
  },

  // Wisetack
  wisetackCenter: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  wisetackLoadingText: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.md,
  },
  wisetackApprovedTitle: {
    ...typography.heading,
    color: colors.success,
    marginTop: spacing.md,
  },
  wisetackApprovedDetail: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginTop: spacing.sm,
    textAlign: 'center',
  },

  // Delivery (step 4)
  deliveryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  deliveryCard: {
    width: '47%',
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    borderColor: colors.borderMedium,
    backgroundColor: colors.surface,
    alignItems: 'center',
    ...shadows.sm,
  },
  deliveryCardSelected: {
    borderColor: colors.primary,
  },
  deliveryIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  deliveryLabel: {
    ...typography.bodySmall,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
  },
  deliveryEta: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 2,
  },
  deliveryFee: {
    ...typography.caption,
    fontWeight: '600',
    marginTop: 2,
  },

  // Confirmation (step 5)
  confirmCenter: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  confirmCheckCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.success,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  confirmTitle: {
    ...typography.heading,
    color: colors.text,
  },
  confirmCard: {
    marginBottom: spacing.lg,
  },
  confirmRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
  },
  confirmLabel: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  confirmValue: {
    ...typography.bodySmall,
    fontWeight: '600',
    color: colors.text,
  },
  confirmTotalRow: {
    marginTop: spacing.sm,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  confirmTotalLabel: {
    ...typography.subheading,
    color: colors.text,
  },
  confirmTotalValue: {
    ...typography.heading,
    color: colors.primary,
  },

  // Bottom action
  bottomAction: {
    marginTop: spacing.md,
  },
});

import { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  TextInput,
  Alert,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, shadows, typography } from '@/lib/theme';
import Card from '@/components/common/Card';
import Badge from '@/components/common/Badge';
import Button from '@/components/common/Button';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface LineItem {
  id: string;
  category: 'labor' | 'materials' | 'equipment' | 'permit';
  description: string;
  qty: number;
  unit: string;
  unitCost: number; // cents
  markup: number; // percentage
}

interface QuoteBuilderProps {
  jobId: string;
}

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

const INITIAL_LINE_ITEMS: LineItem[] = [
  { id: 'l1', category: 'labor', description: 'Demolition & removal', qty: 8, unit: 'hrs', unitCost: 7500, markup: 30 },
  { id: 'l2', category: 'labor', description: 'Rough plumbing', qty: 12, unit: 'hrs', unitCost: 7500, markup: 30 },
  { id: 'l3', category: 'labor', description: 'Tile installation', qty: 16, unit: 'hrs', unitCost: 7500, markup: 30 },
  { id: 'l4', category: 'labor', description: 'Fixture install & finish', qty: 6, unit: 'hrs', unitCost: 7500, markup: 30 },
  { id: 'm1', category: 'materials', description: 'Cement board (3x5)', qty: 4, unit: 'sheets', unitCost: 5200, markup: 20 },
  { id: 'm2', category: 'materials', description: 'Waterproof membrane', qty: 1, unit: 'roll', unitCost: 8900, markup: 20 },
  { id: 'm3', category: 'materials', description: 'Subway tile (white 3x6)', qty: 80, unit: 'sqft', unitCost: 400, markup: 20 },
  { id: 'm4', category: 'materials', description: 'Matte black shower valve', qty: 1, unit: 'each', unitCost: 18900, markup: 20 },
  { id: 'p1', category: 'permit', description: 'Plumbing permit', qty: 1, unit: 'each', unitCost: 15000, markup: 0 },
  { id: 'e1', category: 'equipment', description: 'Dumpster rental (demo debris)', qty: 1, unit: 'each', unitCost: 35000, markup: 10 },
];

const CATEGORIES: { key: LineItem['category']; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { key: 'labor', label: 'Labor', icon: 'people-outline' },
  { key: 'materials', label: 'Materials', icon: 'cube-outline' },
  { key: 'equipment', label: 'Equipment', icon: 'construct-outline' },
  { key: 'permit', label: 'Permits', icon: 'document-text-outline' },
];

const PAYMENT_OPTIONS = [
  '50% deposit / 50% completion',
  'Due on completion',
  '3 equal milestones',
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatCents(cents: number): string {
  return (cents / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}

function lineTotal(item: LineItem): number {
  return Math.round(item.qty * item.unitCost * (1 + item.markup / 100));
}

function lineCost(item: LineItem): number {
  return item.qty * item.unitCost;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function QuoteBuilder({ jobId }: QuoteBuilderProps) {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [step, setStep] = useState(0);
  const [items, setItems] = useState<LineItem[]>(INITIAL_LINE_ITEMS);
  const [globalDiscount, setGlobalDiscount] = useState(0);
  const [taxEnabled, setTaxEnabled] = useState(false);
  const [taxRate, setTaxRate] = useState(0);
  const [scope, setScope] = useState(
    'Full bathroom remodel including demo, rough plumbing, tile, fixtures, and paint.',
  );
  const [timeline, setTimeline] = useState('5-7 business days');
  const [paymentTerms, setPaymentTerms] = useState(PAYMENT_OPTIONS[0]);
  const [validFor, setValidFor] = useState('30');
  const [editingCost, setEditingCost] = useState<string | null>(null);
  const [editCostValue, setEditCostValue] = useState('');

  // -- Calculated totals --
  const totals = useMemo(() => {
    let totalCost = 0;
    let totalWithMarkup = 0;
    items.forEach((item) => {
      totalCost += lineCost(item);
      totalWithMarkup += lineTotal(item);
    });
    const discountAmount = Math.round(totalWithMarkup * (globalDiscount / 100));
    const afterDiscount = totalWithMarkup - discountAmount;
    const taxAmount = taxEnabled ? Math.round(afterDiscount * (taxRate / 100)) : 0;
    const grandTotal = afterDiscount + taxAmount;
    const markupAmount = totalWithMarkup - totalCost;
    const markupPercent = totalCost > 0 ? Math.round((markupAmount / totalCost) * 100) : 0;
    return { totalCost, totalWithMarkup, markupAmount, markupPercent, discountAmount, afterDiscount, taxAmount, grandTotal };
  }, [items, globalDiscount, taxEnabled, taxRate]);

  // -- Category subtotals --
  const categoryTotals = useMemo(() => {
    const map: Record<string, number> = {};
    items.forEach((item) => {
      map[item.category] = (map[item.category] || 0) + lineTotal(item);
    });
    return map;
  }, [items]);

  // -- Handlers --

  const handleBack = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (step > 0) {
      setStep(step - 1);
    } else {
      router.back();
    }
  }, [step, router]);

  const handleNext = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setStep((s) => Math.min(s + 1, 3));
  }, []);

  const handleGoToStep = useCallback((s: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setStep(s);
  }, []);

  const adjustMarkup = useCallback((id: string, delta: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, markup: Math.max(0, Math.min(100, item.markup + delta)) } : item,
      ),
    );
  }, []);

  const startEditCost = useCallback((id: string, currentCost: number) => {
    setEditingCost(id);
    setEditCostValue((currentCost / 100).toFixed(2));
  }, []);

  const commitEditCost = useCallback(() => {
    if (editingCost) {
      const parsed = parseFloat(editCostValue);
      if (!isNaN(parsed) && parsed >= 0) {
        const cents = Math.round(parsed * 100);
        setItems((prev) =>
          prev.map((item) => (item.id === editingCost ? { ...item, unitCost: cents } : item)),
        );
      }
      setEditingCost(null);
      setEditCostValue('');
    }
  }, [editingCost, editCostValue]);

  const addItem = useCallback((category: LineItem['category']) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const newId = `new-${Date.now()}`;
    const defaultMarkup = category === 'permit' ? 0 : category === 'equipment' ? 10 : category === 'labor' ? 30 : 20;
    setItems((prev) => [
      ...prev,
      {
        id: newId,
        category,
        description: 'New item',
        qty: 1,
        unit: 'each',
        unitCost: 0,
        markup: defaultMarkup,
      },
    ]);
  }, []);

  const handleSendQuote = useCallback(() => {
    Alert.alert(
      'Send Quote',
      'Send this quote to John Davidson?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Send',
          onPress: () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            Alert.alert('Quote Sent', 'Your quote has been sent to the client.');
            router.back();
          },
        },
      ],
    );
  }, [router]);

  const handleSaveDraft = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Alert.alert('Draft Saved', 'Your quote has been saved as a draft.');
    router.back();
  }, [router]);

  // -- Market range check --
  const isOutsideMarketRange = totals.grandTotal < 800000 || totals.grandTotal > 1500000;

  // ---------------------------------------------------------------------------
  // Step 1: Line Items
  // ---------------------------------------------------------------------------

  const renderLineItems = () => (
    <ScrollView style={styles.stepContent} showsVerticalScrollIndicator={false}>
      {CATEGORIES.map((cat) => {
        const catItems = items.filter((i) => i.category === cat.key);
        if (catItems.length === 0 && cat.key !== 'equipment' && cat.key !== 'permit') return null;
        return (
          <View key={cat.key} style={styles.categoryGroup}>
            <View style={styles.categoryHeader}>
              <View style={styles.categoryTitleRow}>
                <Ionicons name={cat.icon} size={18} color={colors.primary} />
                <Text style={styles.categoryTitle}>{cat.label}</Text>
              </View>
              {categoryTotals[cat.key] != null && (
                <Text style={styles.categorySubtotal}>{formatCents(categoryTotals[cat.key])}</Text>
              )}
            </View>

            {catItems.map((item) => (
              <Card key={item.id} style={styles.lineItemCard} variant="elevated">
                <Text style={styles.lineItemDesc}>{item.description}</Text>
                <View style={styles.lineItemMeta}>
                  <Text style={styles.lineItemQty}>
                    {item.qty} {item.unit}
                  </Text>
                  <Text style={styles.lineItemX}> x </Text>
                  {editingCost === item.id ? (
                    <TextInput
                      style={styles.costInput}
                      value={editCostValue}
                      onChangeText={setEditCostValue}
                      onBlur={commitEditCost}
                      onSubmitEditing={commitEditCost}
                      keyboardType="decimal-pad"
                      autoFocus
                      selectTextOnFocus
                    />
                  ) : (
                    <Pressable onPress={() => startEditCost(item.id, item.unitCost)}>
                      <Text style={styles.lineItemCost}>{formatCents(item.unitCost)}</Text>
                    </Pressable>
                  )}
                </View>

                <View style={styles.markupRow}>
                  <Text style={styles.markupLabel}>Markup</Text>
                  <View style={styles.markupControls}>
                    <Pressable
                      style={styles.markupBtn}
                      onPress={() => adjustMarkup(item.id, -5)}
                      hitSlop={8}
                    >
                      <Ionicons name="remove" size={14} color={colors.text} />
                    </Pressable>
                    <Text style={styles.markupValue}>{item.markup}%</Text>
                    <Pressable
                      style={styles.markupBtn}
                      onPress={() => adjustMarkup(item.id, 5)}
                      hitSlop={8}
                    >
                      <Ionicons name="add" size={14} color={colors.text} />
                    </Pressable>
                  </View>
                  <Text style={styles.lineItemTotal}>{formatCents(lineTotal(item))}</Text>
                </View>
              </Card>
            ))}

            <Pressable
              style={styles.addItemBtn}
              onPress={() => addItem(cat.key)}
            >
              <Ionicons name="add-circle-outline" size={18} color={colors.primary} />
              <Text style={styles.addItemText}>Add {cat.label} Item</Text>
            </Pressable>
          </View>
        );
      })}

      <View style={{ height: 120 }} />
    </ScrollView>
  );

  // ---------------------------------------------------------------------------
  // Step 2: Margin Overview
  // ---------------------------------------------------------------------------

  const renderMarginOverview = () => {
    const costPct = totals.totalCost > 0 ? Math.round((totals.totalCost / totals.totalWithMarkup) * 100) : 0;
    const marginPct = 100 - costPct;

    return (
      <ScrollView style={styles.stepContent} showsVerticalScrollIndicator={false}>
        {/* Visual breakdown bar */}
        <Card style={styles.section} variant="elevated">
          <Text style={styles.sectionTitle}>Cost vs Margin</Text>
          <View style={styles.breakdownBar}>
            <View style={[styles.breakdownCost, { flex: costPct }]}>
              <Text style={styles.breakdownBarLabel}>{costPct}%</Text>
            </View>
            <View style={[styles.breakdownMargin, { flex: marginPct || 1 }]}>
              <Text style={styles.breakdownBarLabel}>{marginPct}%</Text>
            </View>
          </View>
          <View style={styles.breakdownLegend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: colors.textMuted }]} />
              <Text style={styles.legendText}>Cost</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: colors.success }]} />
              <Text style={styles.legendText}>Margin</Text>
            </View>
          </View>
        </Card>

        {/* Totals breakdown */}
        <Card style={styles.section} variant="elevated">
          <View style={styles.totalLine}>
            <Text style={styles.totalLineLabel}>Total Cost</Text>
            <Text style={styles.totalLineValue}>{formatCents(totals.totalCost)}</Text>
          </View>
          <View style={styles.totalLine}>
            <Text style={styles.totalLineLabel}>Your Markup</Text>
            <Text style={[styles.totalLineValue, { color: colors.success }]}>
              {formatCents(totals.markupAmount)} ({totals.markupPercent}%)
            </Text>
          </View>
          <View style={[styles.totalLine, styles.grandTotalLine]}>
            <Text style={styles.grandTotalLabel}>Grand Total</Text>
            <Text style={styles.grandTotalValue}>{formatCents(totals.grandTotal)}</Text>
          </View>
        </Card>

        {/* Market rate suggestion */}
        <Card style={{...styles.section, ...styles.wiseSuggestion}} variant="outlined">
          <View style={styles.wiseSuggestionRow}>
            <Ionicons name="bulb-outline" size={20} color={colors.primary} />
            <View style={styles.wiseSuggestionText}>
              <Text style={styles.wiseSuggestionTitle}>Market Insight</Text>
              <Text style={styles.wiseSuggestionBody}>
                Market rate for bathroom remodels in your area: $8,000 - $15,000
              </Text>
            </View>
          </View>
          {isOutsideMarketRange && (
            <View style={styles.warningBanner}>
              <Ionicons name="warning-outline" size={16} color={colors.warning} />
              <Text style={styles.warningText}>
                Your total is outside the typical market range
              </Text>
            </View>
          )}
        </Card>

        {/* Discount */}
        <Card style={styles.section} variant="elevated">
          <Text style={styles.sectionTitle}>Adjustments</Text>
          <View style={styles.adjustRow}>
            <Text style={styles.adjustLabel}>Global Discount (%)</Text>
            <View style={styles.markupControls}>
              <Pressable
                style={styles.markupBtn}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setGlobalDiscount((d) => Math.max(0, d - 1));
                }}
                hitSlop={8}
              >
                <Ionicons name="remove" size={14} color={colors.text} />
              </Pressable>
              <Text style={styles.markupValue}>{globalDiscount}%</Text>
              <Pressable
                style={styles.markupBtn}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setGlobalDiscount((d) => Math.min(50, d + 1));
                }}
                hitSlop={8}
              >
                <Ionicons name="add" size={14} color={colors.text} />
              </Pressable>
            </View>
          </View>
          {globalDiscount > 0 && (
            <Text style={styles.discountNote}>
              Discount: -{formatCents(totals.discountAmount)}
            </Text>
          )}

          <View style={[styles.adjustRow, { marginTop: spacing.md }]}>
            <Text style={styles.adjustLabel}>Tax</Text>
            <Pressable
              style={[styles.togglePill, taxEnabled && styles.togglePillActive]}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setTaxEnabled((e) => !e);
              }}
            >
              <Text style={[styles.togglePillText, taxEnabled && styles.togglePillTextActive]}>
                {taxEnabled ? 'ON' : 'OFF'}
              </Text>
            </Pressable>
          </View>
          {taxEnabled && (
            <View style={styles.adjustRow}>
              <Text style={styles.adjustLabel}>Tax Rate (%)</Text>
              <View style={styles.markupControls}>
                <Pressable
                  style={styles.markupBtn}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setTaxRate((r) => Math.max(0, r - 0.5));
                  }}
                  hitSlop={8}
                >
                  <Ionicons name="remove" size={14} color={colors.text} />
                </Pressable>
                <Text style={styles.markupValue}>{taxRate.toFixed(1)}%</Text>
                <Pressable
                  style={styles.markupBtn}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setTaxRate((r) => Math.min(20, r + 0.5));
                  }}
                  hitSlop={8}
                >
                  <Ionicons name="add" size={14} color={colors.text} />
                </Pressable>
              </View>
            </View>
          )}
        </Card>

        <View style={{ height: 120 }} />
      </ScrollView>
    );
  };

  // ---------------------------------------------------------------------------
  // Step 3: Scope & Terms
  // ---------------------------------------------------------------------------

  const renderScopeTerms = () => (
    <ScrollView style={styles.stepContent} showsVerticalScrollIndicator={false}>
      <Card style={styles.section} variant="elevated">
        <Text style={styles.sectionTitle}>Scope of Work</Text>
        <TextInput
          style={styles.scopeInput}
          value={scope}
          onChangeText={setScope}
          multiline
          textAlignVertical="top"
          placeholderTextColor={colors.textMuted}
        />
      </Card>

      <Card style={styles.section} variant="elevated">
        <Text style={styles.sectionTitle}>Estimated Timeline</Text>
        <TextInput
          style={styles.fieldInput}
          value={timeline}
          onChangeText={setTimeline}
          placeholderTextColor={colors.textMuted}
        />
      </Card>

      <Card style={styles.section} variant="elevated">
        <Text style={styles.sectionTitle}>Payment Terms</Text>
        {PAYMENT_OPTIONS.map((option) => {
          const active = paymentTerms === option;
          return (
            <Pressable
              key={option}
              style={[styles.paymentOption, active && styles.paymentOptionActive]}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setPaymentTerms(option);
              }}
            >
              <Ionicons
                name={active ? 'radio-button-on' : 'radio-button-off'}
                size={20}
                color={active ? colors.primary : colors.textMuted}
              />
              <Text style={[styles.paymentOptionText, active && styles.paymentOptionTextActive]}>
                {option}
              </Text>
            </Pressable>
          );
        })}
      </Card>

      <Card style={styles.section} variant="elevated">
        <Text style={styles.sectionTitle}>Valid For</Text>
        <View style={styles.validForRow}>
          <TextInput
            style={[styles.fieldInput, { width: 60, textAlign: 'center' }]}
            value={validFor}
            onChangeText={setValidFor}
            keyboardType="number-pad"
            placeholderTextColor={colors.textMuted}
          />
          <Text style={styles.validForSuffix}>days</Text>
        </View>
      </Card>

      <View style={{ height: 120 }} />
    </ScrollView>
  );

  // ---------------------------------------------------------------------------
  // Step 4: Preview & Send
  // ---------------------------------------------------------------------------

  const validUntilDate = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + (parseInt(validFor, 10) || 30));
    return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  }, [validFor]);

  const renderPreview = () => (
    <ScrollView style={styles.stepContent} showsVerticalScrollIndicator={false}>
      <Card style={{...styles.section, ...styles.previewCard}} variant="elevated">
        {/* Header */}
        <View style={styles.previewHeader}>
          <Text style={styles.previewEstimateLabel}>ESTIMATE</Text>
          <Text style={styles.previewQuoteNo}>#QT-2024-001</Text>
        </View>

        <View style={styles.previewParties}>
          <View style={{ flex: 1 }}>
            <Text style={styles.previewPartyLabel}>From</Text>
            <Text style={styles.previewPartyName}>Carlos Rivera</Text>
            <Text style={styles.previewPartyDetail}>General Contractor</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.previewPartyLabel}>To</Text>
            <Text style={styles.previewPartyName}>John Davidson</Text>
            <Text style={styles.previewPartyDetail}>Bathroom Remodel</Text>
          </View>
        </View>

        {/* Line items by category */}
        {CATEGORIES.map((cat) => {
          const catItems = items.filter((i) => i.category === cat.key);
          if (catItems.length === 0) return null;
          return (
            <View key={cat.key} style={styles.previewCategory}>
              <Text style={styles.previewCatLabel}>{cat.label}</Text>
              {catItems.map((item) => (
                <View key={item.id} style={styles.previewLineItem}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.previewLineDesc}>{item.description}</Text>
                    <Text style={styles.previewLineQty}>
                      {item.qty} {item.unit} x {formatCents(item.unitCost)}
                    </Text>
                  </View>
                  <Text style={styles.previewLineTotal}>{formatCents(lineTotal(item))}</Text>
                </View>
              ))}
              <View style={styles.previewCatSubtotalRow}>
                <Text style={styles.previewCatSubtotalLabel}>{cat.label} Subtotal</Text>
                <Text style={styles.previewCatSubtotalValue}>
                  {formatCents(categoryTotals[cat.key] || 0)}
                </Text>
              </View>
            </View>
          );
        })}

        {/* Totals */}
        <View style={styles.previewTotals}>
          <View style={styles.previewTotalLine}>
            <Text style={styles.previewTotalLineLabel}>Subtotal</Text>
            <Text style={styles.previewTotalLineValue}>{formatCents(totals.totalWithMarkup)}</Text>
          </View>
          {globalDiscount > 0 && (
            <View style={styles.previewTotalLine}>
              <Text style={styles.previewTotalLineLabel}>Discount ({globalDiscount}%)</Text>
              <Text style={[styles.previewTotalLineValue, { color: colors.danger }]}>
                -{formatCents(totals.discountAmount)}
              </Text>
            </View>
          )}
          {taxEnabled && taxRate > 0 && (
            <View style={styles.previewTotalLine}>
              <Text style={styles.previewTotalLineLabel}>Tax ({taxRate.toFixed(1)}%)</Text>
              <Text style={styles.previewTotalLineValue}>{formatCents(totals.taxAmount)}</Text>
            </View>
          )}
          <View style={[styles.previewTotalLine, styles.previewGrandTotal]}>
            <Text style={styles.previewGrandTotalLabel}>Grand Total</Text>
            <Text style={styles.previewGrandTotalValue}>{formatCents(totals.grandTotal)}</Text>
          </View>
        </View>

        {/* Scope, timeline, payment, valid */}
        <View style={styles.previewTerms}>
          <Text style={styles.previewTermTitle}>Scope of Work</Text>
          <Text style={styles.previewTermBody}>{scope}</Text>

          <Text style={[styles.previewTermTitle, { marginTop: spacing.md }]}>Timeline</Text>
          <Text style={styles.previewTermBody}>{timeline}</Text>

          <Text style={[styles.previewTermTitle, { marginTop: spacing.md }]}>Payment Terms</Text>
          <Text style={styles.previewTermBody}>{paymentTerms}</Text>

          <Text style={[styles.previewTermTitle, { marginTop: spacing.md }]}>Valid Until</Text>
          <Text style={styles.previewTermBody}>{validUntilDate}</Text>
        </View>
      </Card>

      {/* View full estimate document */}
      <Pressable
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          router.push('/(pro)/estimate-preview');
        }}
        style={styles.viewEstimateLink}
      >
        <Ionicons name="document-text-outline" size={18} color={colors.primary} />
        <Text style={styles.viewEstimateLinkText}>View Full Estimate Document</Text>
        <Ionicons name="chevron-forward" size={16} color={colors.primary} />
      </Pressable>

      {/* Edit button */}
      <Pressable onPress={() => handleGoToStep(0)} style={styles.editLink}>
        <Ionicons name="create-outline" size={16} color={colors.primary} />
        <Text style={styles.editLinkText}>Edit Quote</Text>
      </Pressable>

      <View style={{ height: 120 }} />
    </ScrollView>
  );

  // ---------------------------------------------------------------------------
  // Step rendering
  // ---------------------------------------------------------------------------

  const STEP_LABELS = ['Line Items', 'Margins', 'Scope & Terms', 'Preview'];

  const renderStepContent = () => {
    switch (step) {
      case 0:
        return renderLineItems();
      case 1:
        return renderMarginOverview();
      case 2:
        return renderScopeTerms();
      case 3:
        return renderPreview();
      default:
        return null;
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={handleBack} hitSlop={12}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>{STEP_LABELS[step]}</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Progress bar */}
      <View style={styles.progressRow}>
        {STEP_LABELS.map((label, i) => (
          <Pressable
            key={label}
            style={styles.progressStep}
            onPress={() => handleGoToStep(i)}
          >
            <View style={[styles.progressDot, i <= step && styles.progressDotActive]} />
            <Text style={[styles.progressLabel, i <= step && styles.progressLabelActive]}>
              {label}
            </Text>
          </Pressable>
        ))}
      </View>
      <View style={styles.progressBarTrack}>
        <View style={[styles.progressBarFill, { width: `${((step + 1) / 4) * 100}%` }]} />
      </View>

      {/* Content */}
      {renderStepContent()}

      {/* Bottom bar */}
      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + spacing.md }]}>
        {step < 3 ? (
          <>
            <View style={styles.runningTotal}>
              <Text style={styles.runningTotalLabel}>Total</Text>
              <Text style={styles.runningTotalValue}>{formatCents(totals.grandTotal)}</Text>
            </View>
            <View style={{ width: 140 }}>
              <Button title="Next" onPress={handleNext} variant="primary" fullWidth />
            </View>
          </>
        ) : (
          <View style={{ flex: 1 }}>
            <Button title="Send Quote" onPress={handleSendQuote} variant="primary" fullWidth />
            <Pressable onPress={handleSaveDraft} style={styles.saveDraftLink}>
              <Text style={styles.saveDraftText}>Save Draft</Text>
            </Pressable>
          </View>
        )}
      </View>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surfaceSecondary,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.background,
  },
  headerTitle: {
    ...typography.subheading,
    color: colors.text,
  },

  // Progress
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    backgroundColor: colors.background,
  },
  progressStep: {
    alignItems: 'center',
    gap: 4,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.borderMedium,
  },
  progressDotActive: {
    backgroundColor: colors.primary,
  },
  progressLabel: {
    ...typography.caption,
    color: colors.textMuted,
    fontSize: 10,
  },
  progressLabelActive: {
    color: colors.primary,
    fontWeight: '700',
  },
  progressBarTrack: {
    height: 3,
    backgroundColor: colors.borderLight,
    marginTop: spacing.sm,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 2,
  },

  // Content
  stepContent: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },

  // Categories & line items
  categoryGroup: {
    marginBottom: spacing.xl,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  categoryTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  categoryTitle: {
    ...typography.subheading,
    color: colors.text,
    fontSize: 16,
  },
  categorySubtotal: {
    ...typography.bodySmall,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  lineItemCard: {
    marginBottom: spacing.sm,
    padding: spacing.md,
  },
  lineItemDesc: {
    ...typography.bodySmall,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  lineItemMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  lineItemQty: {
    ...typography.caption,
    color: colors.textMuted,
  },
  lineItemX: {
    ...typography.caption,
    color: colors.textMuted,
  },
  lineItemCost: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  costInput: {
    ...typography.caption,
    color: colors.text,
    backgroundColor: colors.primaryLight,
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    minWidth: 70,
    fontWeight: '600',
  },
  markupRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  markupLabel: {
    ...typography.caption,
    color: colors.textMuted,
  },
  markupControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  markupBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  markupValue: {
    ...typography.bodySmall,
    fontWeight: '600',
    color: colors.text,
    minWidth: 36,
    textAlign: 'center',
  },
  lineItemTotal: {
    ...typography.bodySmall,
    fontWeight: '700',
    color: colors.text,
    minWidth: 70,
    textAlign: 'right',
  },
  addItemBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
  },
  addItemText: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '600',
  },

  // Section
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.subheading,
    color: colors.text,
    marginBottom: spacing.md,
    fontSize: 16,
  },

  // Margin overview
  breakdownBar: {
    flexDirection: 'row',
    height: 32,
    borderRadius: borderRadius.sm,
    overflow: 'hidden',
    marginBottom: spacing.md,
  },
  breakdownCost: {
    backgroundColor: colors.textMuted,
    justifyContent: 'center',
    alignItems: 'center',
  },
  breakdownMargin: {
    backgroundColor: colors.success,
    justifyContent: 'center',
    alignItems: 'center',
  },
  breakdownBarLabel: {
    ...typography.caption,
    color: colors.textInverse,
    fontWeight: '700',
    fontSize: 11,
  },
  breakdownLegend: {
    flexDirection: 'row',
    gap: spacing.lg,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    ...typography.caption,
    color: colors.textSecondary,
  },

  // Totals
  totalLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  totalLineLabel: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  totalLineValue: {
    ...typography.bodySmall,
    fontWeight: '600',
    color: colors.text,
  },
  grandTotalLine: {
    borderTopWidth: 2,
    borderTopColor: colors.borderMedium,
    marginTop: spacing.sm,
    paddingTop: spacing.md,
  },
  grandTotalLabel: {
    ...typography.subheading,
    color: colors.text,
  },
  grandTotalValue: {
    ...typography.heading,
    color: colors.primary,
  },

  // Wise suggestion
  wiseSuggestion: {
    borderColor: colors.primaryLight,
    backgroundColor: colors.primaryLight,
  },
  wiseSuggestionRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  wiseSuggestionText: {
    flex: 1,
  },
  wiseSuggestionTitle: {
    ...typography.bodySmall,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 2,
  },
  wiseSuggestionBody: {
    ...typography.caption,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  warningBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.warningLight,
  },
  warningText: {
    ...typography.caption,
    color: colors.warning,
    fontWeight: '600',
  },

  // Adjustments
  adjustRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  adjustLabel: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  discountNote: {
    ...typography.caption,
    color: colors.danger,
    marginTop: spacing.xs,
  },
  togglePill: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    backgroundColor: colors.borderLight,
  },
  togglePillActive: {
    backgroundColor: colors.primary,
  },
  togglePillText: {
    ...typography.caption,
    fontWeight: '600',
    color: colors.textMuted,
  },
  togglePillTextActive: {
    color: colors.textInverse,
  },

  // Scope & terms
  scopeInput: {
    ...typography.bodySmall,
    color: colors.text,
    backgroundColor: colors.surfaceSecondary,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    minHeight: 100,
    borderWidth: 1,
    borderColor: colors.borderMedium,
    textAlignVertical: 'top',
  },
  fieldInput: {
    ...typography.bodySmall,
    color: colors.text,
    backgroundColor: colors.surfaceSecondary,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderMedium,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  paymentOptionActive: {
    backgroundColor: colors.primaryLight,
    marginHorizontal: -spacing.lg,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    borderBottomColor: 'transparent',
  },
  paymentOptionText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  paymentOptionTextActive: {
    color: colors.primary,
    fontWeight: '600',
  },
  validForRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  validForSuffix: {
    ...typography.bodySmall,
    color: colors.textMuted,
  },

  // Preview
  previewCard: {
    padding: spacing.xl,
  },
  previewHeader: {
    alignItems: 'center',
    marginBottom: spacing.xl,
    paddingBottom: spacing.lg,
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },
  previewEstimateLabel: {
    ...typography.heading,
    color: colors.primary,
    letterSpacing: 4,
  },
  previewQuoteNo: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  previewParties: {
    flexDirection: 'row',
    marginBottom: spacing.xl,
  },
  previewPartyLabel: {
    ...typography.caption,
    color: colors.textMuted,
    marginBottom: 2,
    textTransform: 'uppercase',
  },
  previewPartyName: {
    ...typography.bodySmall,
    fontWeight: '600',
    color: colors.text,
  },
  previewPartyDetail: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  previewCategory: {
    marginBottom: spacing.lg,
  },
  previewCatLabel: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: spacing.sm,
    letterSpacing: 1,
  },
  previewLineItem: {
    flexDirection: 'row',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  previewLineDesc: {
    ...typography.bodySmall,
    color: colors.text,
  },
  previewLineQty: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 2,
  },
  previewLineTotal: {
    ...typography.bodySmall,
    fontWeight: '600',
    color: colors.text,
    marginLeft: spacing.md,
  },
  previewCatSubtotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
  },
  previewCatSubtotalLabel: {
    ...typography.caption,
    color: colors.textMuted,
    fontWeight: '600',
  },
  previewCatSubtotalValue: {
    ...typography.bodySmall,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  previewTotals: {
    marginTop: spacing.lg,
    paddingTop: spacing.lg,
    borderTopWidth: 2,
    borderTopColor: colors.borderMedium,
  },
  previewTotalLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs,
  },
  previewTotalLineLabel: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  previewTotalLineValue: {
    ...typography.bodySmall,
    fontWeight: '600',
    color: colors.text,
  },
  previewGrandTotal: {
    marginTop: spacing.sm,
    paddingTop: spacing.md,
    borderTopWidth: 2,
    borderTopColor: colors.text,
  },
  previewGrandTotalLabel: {
    ...typography.subheading,
    color: colors.text,
  },
  previewGrandTotalValue: {
    ...typography.heading,
    color: colors.primary,
  },
  previewTerms: {
    marginTop: spacing.xl,
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  previewTermTitle: {
    ...typography.caption,
    color: colors.textMuted,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  previewTermBody: {
    ...typography.bodySmall,
    color: colors.text,
    lineHeight: 20,
  },
  viewEstimateLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.lg,
    marginTop: spacing.md,
    backgroundColor: colors.primaryLight,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  viewEstimateLinkText: {
    ...typography.bodySmall,
    color: colors.primary,
    fontWeight: '700',
    flex: 1,
  },
  editLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.md,
  },
  editLinkText: {
    ...typography.bodySmall,
    color: colors.primary,
    fontWeight: '600',
  },

  // Bottom bar
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    ...shadows.md,
  },
  runningTotal: {
    flex: 1,
  },
  runningTotalLabel: {
    ...typography.caption,
    color: colors.textMuted,
  },
  runningTotalValue: {
    ...typography.subheading,
    color: colors.text,
  },
  saveDraftLink: {
    alignItems: 'center',
    paddingTop: spacing.md,
  },
  saveDraftText: {
    ...typography.bodySmall,
    color: colors.textMuted,
  },
});

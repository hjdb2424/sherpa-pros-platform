import { useState, useEffect, useCallback } from 'react';
import {
  View, Text, TextInput, ScrollView, Pressable, Modal, StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as SecureStore from 'expo-secure-store';
import { Ionicons } from '@expo/vector-icons';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const US_STATES = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA',
  'KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ',
  'NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT',
  'VA','WA','WV','WI','WY',
];

const TRADES = [
  'Plumber','Electrician','HVAC','General Contractor','Painter','Roofer',
  'Landscaper','Carpenter','Handyman','Appliance Repair','Other',
];

const PROPERTY_TYPES_PM = [
  'Residential','Commercial','Mixed-use','Student Housing','Senior Living','Vacation/Short-term',
];
const PM_PRIORITIES = [
  'Financial reporting','Maintenance efficiency','Vendor management','Tenant satisfaction','Compliance',
];
const CLIENT_PROPERTY_TYPES = ['House','Condo/Apartment','Rental Property','Commercial'];
const CLIENT_REASONS = [
  'Specific repair needed','Home renovation','Regular maintenance','Emergency','Just browsing',
];

const BRAND = '#00a9e0';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type Role = 'pm' | 'pro' | 'client';
interface Props { role: Role; onComplete: () => void; }

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function Field({ label, value, onChangeText, placeholder, keyboardType, required }: {
  label: string; value: string; onChangeText: (t: string) => void;
  placeholder?: string; keyboardType?: 'default' | 'email-address' | 'phone-pad' | 'numeric';
  required?: boolean;
}) {
  return (
    <View style={s.field}>
      <Text style={s.label}>{label}{required ? ' *' : ''}</Text>
      <TextInput
        style={s.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#a1a1aa"
        keyboardType={keyboardType || 'default'}
        autoCapitalize={keyboardType === 'email-address' ? 'none' : 'words'}
      />
    </View>
  );
}

function Picker({ label, value, options, onSelect, required }: {
  label: string; value: string; options: string[];
  onSelect: (v: string) => void; required?: boolean;
}) {
  const [open, setOpen] = useState(false);
  return (
    <View style={s.field}>
      <Text style={s.label}>{label}{required ? ' *' : ''}</Text>
      <Pressable style={s.input} onPress={() => setOpen(true)}>
        <Text style={[s.inputText, !value && { color: '#a1a1aa' }]}>{value || 'Select...'}</Text>
        <Ionicons name="chevron-down" size={16} color="#a1a1aa" />
      </Pressable>
      <Modal visible={open} transparent animationType="slide">
        <View style={s.pickerOverlay}>
          <View style={s.pickerSheet}>
            <View style={s.pickerHeader}>
              <Text style={s.pickerTitle}>{label}</Text>
              <Pressable onPress={() => setOpen(false)}><Text style={s.pickerDone}>Done</Text></Pressable>
            </View>
            <ScrollView style={s.pickerList}>
              {options.map((o) => (
                <Pressable key={o} style={[s.pickerItem, value === o && s.pickerItemActive]}
                  onPress={() => { onSelect(o); setOpen(false); }}>
                  <Text style={[s.pickerItemText, value === o && { color: BRAND, fontWeight: '600' }]}>{o}</Text>
                  {value === o && <Ionicons name="checkmark" size={18} color={BRAND} />}
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

function ChipGroup({ label, options, selected, onChange }: {
  label: string; options: string[]; selected: string[]; onChange: (v: string[]) => void;
}) {
  const toggle = (o: string) => onChange(selected.includes(o) ? selected.filter((s) => s !== o) : [...selected, o]);
  return (
    <View style={s.field}>
      <Text style={s.label}>{label}</Text>
      <View style={s.chipRow}>
        {options.map((o) => (
          <Pressable key={o} style={[s.chip, selected.includes(o) && s.chipActive]} onPress={() => toggle(o)}>
            <Text style={[s.chipText, selected.includes(o) && { color: BRAND }]}>{o}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

function RadioList({ label, options, value, onChange }: {
  label: string; options: string[]; value: string; onChange: (v: string) => void;
}) {
  return (
    <View style={s.field}>
      <Text style={s.label}>{label}</Text>
      {options.map((o) => (
        <Pressable key={o} style={[s.radioRow, value === o && s.radioRowActive]} onPress={() => onChange(o)}>
          <View style={[s.radioDot, value === o && s.radioDotActive]} />
          <Text style={[s.radioText, value === o && { color: BRAND }]}>{o}</Text>
        </Pressable>
      ))}
    </View>
  );
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

export default function OnboardingWizard({ role, onComplete }: Props) {
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState(0);
  const [data, setData] = useState<Record<string, any>>({});
  const totalSteps = role === 'client' ? 2 : 3;

  const set = useCallback((k: string, v: unknown) => setData((p) => ({ ...p, [k]: v })), []);

  const finish = useCallback(async () => {
    await SecureStore.setItemAsync('sherpa_user_profile', JSON.stringify({ ...data, role }));
    await SecureStore.setItemAsync('sherpa_onboarding_complete', 'true');
    const name = data.fullName || data.name || '';
    if (name) {
      await SecureStore.setItemAsync('sherpa_name', name);
      await SecureStore.setItemAsync('sherpa_test_name', name);
    }
    if (data.email) await SecureStore.setItemAsync('sherpa_email', data.email);
    onComplete();
  }, [data, role, onComplete]);

  const skip = useCallback(async () => {
    await SecureStore.setItemAsync('sherpa_onboarding_skipped', 'true');
    await SecureStore.setItemAsync('sherpa_onboarding_complete', 'true');
    onComplete();
  }, [onComplete]);

  const titles: Record<Role, string[]> = {
    pm: ["Let's set up your account", 'Tell us about your portfolio', 'Almost done!'],
    pro: ['Welcome, Pro!', 'Your trade', 'Service details'],
    client: ["Let's get you started", 'What do you need?'],
  };

  const cta = step < totalSteps - 1 ? 'Continue' : role === 'pm' ? 'Get Started' : role === 'pro' ? 'Start Finding Jobs' : 'Find Pros';

  const renderContent = () => {
    if (role === 'pm') {
      if (step === 0) return <>
        <Field label="Company Name" value={data.companyName || ''} onChangeText={(v) => set('companyName', v)} placeholder="Sunrise Properties" required />
        <Field label="Your Name" value={data.name || ''} onChangeText={(v) => set('name', v)} placeholder="Lisa Park" required />
        <Field label="Email" value={data.email || ''} onChangeText={(v) => set('email', v)} placeholder="lisa@sunrise.com" keyboardType="email-address" required />
        <Field label="Phone" value={data.phone || ''} onChangeText={(v) => set('phone', v)} placeholder="(603) 555-0000" keyboardType="phone-pad" />
      </>;
      if (step === 1) return <>
        <Picker label="Number of Properties" value={data.propertyCount || ''} options={['1-5','6-20','21-50','50+']} onSelect={(v) => set('propertyCount', v)} />
        <Picker label="Total Units Managed" value={data.unitCount || ''} options={['1-25','26-100','101-500','500+']} onSelect={(v) => set('unitCount', v)} />
        <Field label="Primary City" value={data.city || ''} onChangeText={(v) => set('city', v)} placeholder="Manchester" />
        <Picker label="State" value={data.state || ''} options={US_STATES} onSelect={(v) => set('state', v)} />
      </>;
      return <>
        <ChipGroup label="Property Types Managed" options={PROPERTY_TYPES_PM} selected={data.propertyTypes || []} onChange={(v) => set('propertyTypes', v)} />
        <RadioList label="What's most important to you?" options={PM_PRIORITIES} value={data.priority || ''} onChange={(v) => set('priority', v)} />
      </>;
    }
    if (role === 'pro') {
      if (step === 0) return <>
        <Field label="Full Name" value={data.fullName || ''} onChangeText={(v) => set('fullName', v)} placeholder="Marcus Rivera" required />
        <Field label="Business Name" value={data.businessName || ''} onChangeText={(v) => set('businessName', v)} placeholder="Rivera Plumbing (optional)" />
        <Field label="Email" value={data.email || ''} onChangeText={(v) => set('email', v)} placeholder="marcus@email.com" keyboardType="email-address" required />
        <Field label="Phone" value={data.phone || ''} onChangeText={(v) => set('phone', v)} placeholder="(603) 555-0000" keyboardType="phone-pad" />
      </>;
      if (step === 1) return <>
        <Picker label="Primary Trade" value={data.trade || ''} options={TRADES} onSelect={(v) => set('trade', v)} required />
        <Picker label="Years of Experience" value={data.experience || ''} options={['1-3','4-7','8-15','15+']} onSelect={(v) => set('experience', v)} />
        <Field label="License Number" value={data.licenseNumber || ''} onChangeText={(v) => set('licenseNumber', v)} placeholder="Optional" />
        <Field label="City" value={data.city || ''} onChangeText={(v) => set('city', v)} placeholder="Portsmouth" />
        <Picker label="State" value={data.state || ''} options={US_STATES} onSelect={(v) => set('state', v)} />
      </>;
      return <>
        <Picker label="Service Radius" value={data.serviceRadius || ''} options={['10mi','25mi','50mi','100mi','Nationwide']} onSelect={(v) => set('serviceRadius', v)} />
        <Picker label="Availability" value={data.availability || ''} options={['Full-time','Part-time','Weekends only','Emergency only']} onSelect={(v) => set('availability', v)} />
        <View style={s.field}>
          <Text style={s.label}>Hourly Rate Range ($)</Text>
          <View style={s.rateRow}>
            <TextInput style={[s.input, { flex: 1 }]} value={data.rateMin || ''} onChangeText={(v) => set('rateMin', v)} placeholder="Min" keyboardType="numeric" placeholderTextColor="#a1a1aa" />
            <Text style={s.rateDash}>-</Text>
            <TextInput style={[s.input, { flex: 1 }]} value={data.rateMax || ''} onChangeText={(v) => set('rateMax', v)} placeholder="Max" keyboardType="numeric" placeholderTextColor="#a1a1aa" />
          </View>
        </View>
      </>;
    }
    // client
    if (step === 0) return <>
      <Field label="Full Name" value={data.fullName || ''} onChangeText={(v) => set('fullName', v)} placeholder="Jamie Davis" required />
      <Field label="Email" value={data.email || ''} onChangeText={(v) => set('email', v)} placeholder="jamie@email.com" keyboardType="email-address" required />
      <Field label="Phone" value={data.phone || ''} onChangeText={(v) => set('phone', v)} placeholder="(603) 555-0000" keyboardType="phone-pad" />
      <Field label="City" value={data.city || ''} onChangeText={(v) => set('city', v)} placeholder="Nashua" />
      <Picker label="State" value={data.state || ''} options={US_STATES} onSelect={(v) => set('state', v)} />
    </>;
    return <>
      <RadioList label="Property Type" options={CLIENT_PROPERTY_TYPES} value={data.propertyType || ''} onChange={(v) => set('propertyType', v)} />
      <RadioList label="What brings you here?" options={CLIENT_REASONS} value={data.reason || ''} onChange={(v) => set('reason', v)} />
    </>;
  };

  return (
    <Modal visible animationType="slide" presentationStyle="fullScreen">
      <View style={[s.container, { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 16 }]}>
        {/* Header */}
        <View style={s.header}>
          <View style={s.dots}>
            {Array.from({ length: totalSteps }).map((_, i) => (
              <View key={i} style={[s.dot, i === step ? s.dotActive : i < step ? s.dotDone : null]} />
            ))}
          </View>
          <Pressable onPress={skip} hitSlop={12}>
            <Text style={s.skipText}>I'll do this later</Text>
          </Pressable>
        </View>

        <Text style={s.title}>{titles[role][step]}</Text>
        <Text style={s.subtitle}>Step {step + 1} of {totalSteps}</Text>

        <ScrollView style={s.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          {renderContent()}
          <View style={{ height: 40 }} />
        </ScrollView>

        {/* Footer */}
        <View style={s.footer}>
          {step > 0 ? (
            <Pressable style={s.backBtn} onPress={() => setStep((s) => s - 1)}>
              <Text style={s.backText}>Back</Text>
            </Pressable>
          ) : <View />}
          <Pressable style={s.ctaBtn} onPress={() => { step < totalSteps - 1 ? setStep((s) => s + 1) : finish(); }}>
            <Text style={s.ctaText}>{cta}</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff', paddingHorizontal: 24 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  dots: { flexDirection: 'row', gap: 6 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#e4e4e7' },
  dotActive: { width: 24, backgroundColor: BRAND },
  dotDone: { backgroundColor: `${BRAND}66` },
  skipText: { fontSize: 13, color: '#a1a1aa' },
  title: { fontSize: 22, fontWeight: '700', color: '#18181b', marginBottom: 4 },
  subtitle: { fontSize: 14, color: '#71717a', marginBottom: 20 },
  content: { flex: 1 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 16, borderTopWidth: 1, borderTopColor: '#f4f4f5' },
  backBtn: { paddingVertical: 10, paddingHorizontal: 16 },
  backText: { fontSize: 15, fontWeight: '500', color: '#52525b' },
  ctaBtn: { backgroundColor: BRAND, borderRadius: 12, paddingVertical: 12, paddingHorizontal: 24 },
  ctaText: { fontSize: 15, fontWeight: '600', color: '#ffffff' },

  // Fields
  field: { marginBottom: 16 },
  label: { fontSize: 13, fontWeight: '500', color: '#52525b', marginBottom: 6 },
  input: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 1, borderColor: '#e4e4e7', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, fontSize: 15, color: '#18181b' },
  inputText: { fontSize: 15, color: '#18181b' },

  // Rate row
  rateRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  rateDash: { fontSize: 16, color: '#a1a1aa' },

  // Chips
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { borderWidth: 1, borderColor: '#e4e4e7', borderRadius: 9999, paddingHorizontal: 14, paddingVertical: 8 },
  chipActive: { borderColor: BRAND, backgroundColor: `${BRAND}15` },
  chipText: { fontSize: 13, fontWeight: '500', color: '#52525b' },

  // Radio
  radioRow: { flexDirection: 'row', alignItems: 'center', gap: 10, borderWidth: 1, borderColor: '#e4e4e7', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, marginBottom: 8 },
  radioRowActive: { borderColor: BRAND, backgroundColor: `${BRAND}08` },
  radioDot: { width: 16, height: 16, borderRadius: 8, borderWidth: 2, borderColor: '#d4d4d8' },
  radioDotActive: { borderColor: BRAND, backgroundColor: BRAND },
  radioText: { fontSize: 14, color: '#3f3f46' },

  // Picker modal
  pickerOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.4)' },
  pickerSheet: { backgroundColor: '#ffffff', borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: '60%' },
  pickerHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#f4f4f5' },
  pickerTitle: { fontSize: 17, fontWeight: '600', color: '#18181b' },
  pickerDone: { fontSize: 15, fontWeight: '600', color: BRAND },
  pickerList: { paddingHorizontal: 20 },
  pickerItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#f4f4f5' },
  pickerItemActive: {},
  pickerItemText: { fontSize: 15, color: '#3f3f46' },
});

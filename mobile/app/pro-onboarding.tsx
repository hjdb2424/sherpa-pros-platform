import { useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Pressable,
  Switch,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Image,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import * as ImagePicker from 'expo-image-picker';
import * as SecureStore from 'expo-secure-store';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Circle } from 'react-native-maps';
import { colors, spacing, borderRadius, shadows, typography } from '@/lib/theme';
import { useAuth } from '@/lib/auth';
import Slider from '@/components/common/Slider';

const TOTAL_STEPS = 6;

const TRADES = [
  'Plumbing',
  'Electrical',
  'HVAC',
  'Carpentry',
  'Painting',
  'Roofing',
  'General',
  'Other',
] as const;

type Trade = (typeof TRADES)[number];

const LICENSE_STATES = ['NH', 'ME', 'MA', 'RI'] as const;

// Portsmouth NH center
const PORTSMOUTH_CENTER = {
  latitude: 43.0718,
  longitude: -70.7626,
  latitudeDelta: 0.8,
  longitudeDelta: 0.8,
};

// Miles to meters for map circle
function milesToMeters(miles: number): number {
  return miles * 1609.34;
}

// ------------------------------------------------------------------
// Progress Bar
// ------------------------------------------------------------------
function ProgressBar({ currentStep }: { currentStep: number }) {
  return (
    <View style={progressStyles.container}>
      {Array.from({ length: TOTAL_STEPS }, (_, i) => {
        const stepNum = i + 1;
        const isCompleted = stepNum < currentStep;
        const isActive = stepNum === currentStep;
        return (
          <View key={i} style={progressStyles.stepRow}>
            <View
              style={[
                progressStyles.dot,
                isCompleted && progressStyles.dotCompleted,
                isActive && progressStyles.dotActive,
              ]}
            >
              {isCompleted && (
                <Ionicons name="checkmark" size={10} color="#fff" />
              )}
            </View>
            {i < TOTAL_STEPS - 1 && (
              <View
                style={[
                  progressStyles.line,
                  stepNum < currentStep && progressStyles.lineCompleted,
                ]}
              />
            )}
          </View>
        );
      })}
    </View>
  );
}

const progressStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  dot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.borderMedium,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotActive: {
    backgroundColor: colors.primary,
    ...shadows.primaryGlow,
  },
  dotCompleted: {
    backgroundColor: colors.success,
  },
  line: {
    flex: 1,
    height: 2,
    backgroundColor: colors.borderMedium,
    marginHorizontal: 4,
  },
  lineCompleted: {
    backgroundColor: colors.success,
  },
});

// ------------------------------------------------------------------
// Main Onboarding Screen
// ------------------------------------------------------------------
export default function ProOnboardingScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { userName } = useAuth();

  const [step, setStep] = useState(1);

  // Step 1: Personal info
  const [displayName, setDisplayName] = useState(userName ?? '');
  const [phone, setPhone] = useState('');
  const [bio, setBio] = useState('');

  // Step 2: Trade selection
  const [selectedTrades, setSelectedTrades] = useState<Trade[]>([]);

  // Step 3: License & Insurance
  const [licenseNumber, setLicenseNumber] = useState('');
  const [licenseState, setLicenseState] = useState<string>('NH');
  const [insuranceProvider, setInsuranceProvider] = useState('');
  const [insuranceExpiry, setInsuranceExpiry] = useState('');
  const [hasInsurance, setHasInsurance] = useState(false);

  // Step 4: Service area
  const [serviceRadius, setServiceRadius] = useState(25);

  // Step 5: Profile photo
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);

  const mapRef = useRef<MapView>(null);

  // ------------------------------------------------------------------
  // Navigation
  // ------------------------------------------------------------------
  const canProceed = useCallback((): boolean => {
    switch (step) {
      case 1:
        return displayName.trim().length > 0 && phone.trim().length > 0;
      case 2:
        return selectedTrades.length > 0;
      case 3:
        return true; // All optional
      case 4:
        return true;
      case 5:
        return true; // Photo is optional
      case 6:
        return true;
      default:
        return false;
    }
  }, [step, displayName, phone, selectedTrades]);

  const goNext = useCallback(() => {
    if (!canProceed()) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (step < TOTAL_STEPS) {
      setStep(step + 1);
    }
  }, [step, canProceed]);

  const goBack = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (step > 1) {
      setStep(step - 1);
    } else {
      router.back();
    }
  }, [step, router]);

  const goToStep = useCallback(
    (target: number) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setStep(target);
    },
    [],
  );

  // ------------------------------------------------------------------
  // Trade toggle
  // ------------------------------------------------------------------
  const toggleTrade = useCallback(
    (trade: Trade) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setSelectedTrades((prev) =>
        prev.includes(trade) ? prev.filter((t) => t !== trade) : [...prev, trade],
      );
    },
    [],
  );

  // ------------------------------------------------------------------
  // Photo
  // ------------------------------------------------------------------
  const takePhoto = useCallback(async () => {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) {
      Alert.alert('Camera access required', 'Please enable camera permissions in Settings.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled && result.assets[0]) {
      setProfilePhoto(result.assets[0].uri);
    }
  }, []);

  const pickFromLibrary = useCallback(async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert('Library access required', 'Please enable photo library permissions in Settings.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled && result.assets[0]) {
      setProfilePhoto(result.assets[0].uri);
    }
  }, []);

  // ------------------------------------------------------------------
  // Submit
  // ------------------------------------------------------------------
  const handleSubmit = useCallback(async () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    // Save onboarding complete flag
    await SecureStore.setItemAsync('sherpa_onboarding_complete', 'true');
    await SecureStore.setItemAsync('sherpa_display_name', displayName);
    router.replace('/(pro)');
  }, [displayName, router]);

  // ------------------------------------------------------------------
  // Step Content
  // ------------------------------------------------------------------
  const renderStep = () => {
    switch (step) {
      case 1:
        return <StepPersonalInfo
          displayName={displayName}
          setDisplayName={setDisplayName}
          phone={phone}
          setPhone={setPhone}
          bio={bio}
          setBio={setBio}
        />;
      case 2:
        return <StepTradeSelection
          selectedTrades={selectedTrades}
          toggleTrade={toggleTrade}
        />;
      case 3:
        return <StepLicenseInsurance
          licenseNumber={licenseNumber}
          setLicenseNumber={setLicenseNumber}
          licenseState={licenseState}
          setLicenseState={setLicenseState}
          insuranceProvider={insuranceProvider}
          setInsuranceProvider={setInsuranceProvider}
          insuranceExpiry={insuranceExpiry}
          setInsuranceExpiry={setInsuranceExpiry}
          hasInsurance={hasInsurance}
          setHasInsurance={setHasInsurance}
        />;
      case 4:
        return <StepServiceArea
          serviceRadius={serviceRadius}
          setServiceRadius={setServiceRadius}
          mapRef={mapRef}
        />;
      case 5:
        return <StepProfilePhoto
          profilePhoto={profilePhoto}
          takePhoto={takePhoto}
          pickFromLibrary={pickFromLibrary}
          setProfilePhoto={setProfilePhoto}
        />;
      case 6:
        return <StepReview
          displayName={displayName}
          phone={phone}
          bio={bio}
          selectedTrades={selectedTrades}
          licenseNumber={licenseNumber}
          licenseState={licenseState}
          insuranceProvider={insuranceProvider}
          insuranceExpiry={insuranceExpiry}
          hasInsurance={hasInsurance}
          serviceRadius={serviceRadius}
          profilePhoto={profilePhoto}
          goToStep={goToStep}
        />;
      default:
        return null;
    }
  };

  const isOptionalStep = step === 5;

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={[styles.container, { paddingTop: insets.top }]}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={goBack} style={styles.backButton} hitSlop={12}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </Pressable>
          <Text style={styles.headerTitle}>
            {step === 6 ? 'Review' : `Step ${step} of ${TOTAL_STEPS}`}
          </Text>
          {isOptionalStep ? (
            <Pressable onPress={goNext} hitSlop={12}>
              <Text style={styles.skipText}>Skip</Text>
            </Pressable>
          ) : (
            <View style={styles.headerSpacer} />
          )}
        </View>

        <ProgressBar currentStep={step} />

        {/* Content */}
        <ScrollView
          style={styles.flex}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: insets.bottom + 100 },
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {renderStep()}
        </ScrollView>

        {/* Bottom Action */}
        <View style={[styles.bottomBar, { paddingBottom: insets.bottom + spacing.md }]}>
          {step < TOTAL_STEPS ? (
            <Pressable
              onPress={goNext}
              disabled={!canProceed()}
              style={[
                styles.nextButton,
                !canProceed() && styles.nextButtonDisabled,
              ]}
            >
              <Text style={styles.nextButtonText}>Continue</Text>
              <Ionicons name="arrow-forward" size={18} color="#fff" />
            </Pressable>
          ) : (
            <Pressable onPress={handleSubmit} style={styles.submitButton}>
              <Text style={styles.submitButtonText}>Complete Profile</Text>
            </Pressable>
          )}
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

// ------------------------------------------------------------------
// Step 1: Personal Info
// ------------------------------------------------------------------
function StepPersonalInfo({
  displayName,
  setDisplayName,
  phone,
  setPhone,
  bio,
  setBio,
}: {
  displayName: string;
  setDisplayName: (v: string) => void;
  phone: string;
  setPhone: (v: string) => void;
  bio: string;
  setBio: (v: string) => void;
}) {
  return (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Personal Info</Text>
      <Text style={styles.stepSubtitle}>Tell us about yourself and your business</Text>

      <View style={styles.fieldGroup}>
        <Text style={styles.fieldLabel}>Business / Display Name *</Text>
        <TextInput
          style={styles.textInput}
          value={displayName}
          onChangeText={setDisplayName}
          placeholder="e.g. Mike's Plumbing"
          placeholderTextColor={colors.textMuted}
          autoCapitalize="words"
          returnKeyType="next"
        />
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.fieldLabel}>Phone Number *</Text>
        <TextInput
          style={styles.textInput}
          value={phone}
          onChangeText={setPhone}
          placeholder="(603) 555-1234"
          placeholderTextColor={colors.textMuted}
          keyboardType="phone-pad"
          returnKeyType="next"
        />
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.fieldLabel}>Bio</Text>
        <TextInput
          style={[styles.textInput, styles.textArea]}
          value={bio}
          onChangeText={(text) => {
            if (text.length <= 200) setBio(text);
          }}
          placeholder="A short description of your services..."
          placeholderTextColor={colors.textMuted}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          returnKeyType="default"
        />
        <Text style={styles.charCounter}>{bio.length}/200</Text>
      </View>
    </View>
  );
}

// ------------------------------------------------------------------
// Step 2: Trade Selection
// ------------------------------------------------------------------
function StepTradeSelection({
  selectedTrades,
  toggleTrade,
}: {
  selectedTrades: Trade[];
  toggleTrade: (trade: Trade) => void;
}) {
  return (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Your Trades</Text>
      <Text style={styles.stepSubtitle}>Select all trades you offer (at least one)</Text>

      <View style={styles.tradeGrid}>
        {TRADES.map((trade) => {
          const isSelected = selectedTrades.includes(trade);
          return (
            <Pressable
              key={trade}
              style={[
                styles.tradeButton,
                isSelected && styles.tradeButtonSelected,
              ]}
              onPress={() => toggleTrade(trade)}
            >
              <View style={styles.tradeContent}>
                <Ionicons
                  name={getTradeIcon(trade)}
                  size={24}
                  color={isSelected ? colors.primary : colors.textMuted}
                />
                <Text
                  style={[
                    styles.tradeLabel,
                    isSelected && styles.tradeLabelSelected,
                  ]}
                >
                  {trade}
                </Text>
              </View>
              {isSelected && (
                <View style={styles.tradeCheck}>
                  <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
                </View>
              )}
            </Pressable>
          );
        })}
      </View>

      {selectedTrades.length > 0 && (
        <Text style={styles.selectionSummary}>
          {selectedTrades.length} trade{selectedTrades.length > 1 ? 's' : ''} selected
        </Text>
      )}
    </View>
  );
}

function getTradeIcon(trade: Trade): keyof typeof Ionicons.glyphMap {
  const icons: Record<Trade, keyof typeof Ionicons.glyphMap> = {
    Plumbing: 'water-outline',
    Electrical: 'flash-outline',
    HVAC: 'thermometer-outline',
    Carpentry: 'hammer-outline',
    Painting: 'color-palette-outline',
    Roofing: 'home-outline',
    General: 'construct-outline',
    Other: 'ellipsis-horizontal-circle-outline',
  };
  return icons[trade];
}

// ------------------------------------------------------------------
// Step 3: License & Insurance
// ------------------------------------------------------------------
function StepLicenseInsurance({
  licenseNumber,
  setLicenseNumber,
  licenseState,
  setLicenseState,
  insuranceProvider,
  setInsuranceProvider,
  insuranceExpiry,
  setInsuranceExpiry,
  hasInsurance,
  setHasInsurance,
}: {
  licenseNumber: string;
  setLicenseNumber: (v: string) => void;
  licenseState: string;
  setLicenseState: (v: string) => void;
  insuranceProvider: string;
  setInsuranceProvider: (v: string) => void;
  insuranceExpiry: string;
  setInsuranceExpiry: (v: string) => void;
  hasInsurance: boolean;
  setHasInsurance: (v: boolean) => void;
}) {
  return (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>License & Insurance</Text>
      <Text style={styles.stepSubtitle}>Add your credentials (all optional)</Text>

      <View style={styles.fieldGroup}>
        <Text style={styles.fieldLabel}>License Number</Text>
        <TextInput
          style={styles.textInput}
          value={licenseNumber}
          onChangeText={setLicenseNumber}
          placeholder="e.g. PL-12345"
          placeholderTextColor={colors.textMuted}
          autoCapitalize="characters"
        />
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.fieldLabel}>License State</Text>
        <View style={styles.stateRow}>
          {LICENSE_STATES.map((st) => (
            <Pressable
              key={st}
              style={[
                styles.stateChip,
                licenseState === st && styles.stateChipSelected,
              ]}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setLicenseState(st);
              }}
            >
              <Text
                style={[
                  styles.stateChipText,
                  licenseState === st && styles.stateChipTextSelected,
                ]}
              >
                {st}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.fieldLabel}>Insurance Provider</Text>
        <TextInput
          style={styles.textInput}
          value={insuranceProvider}
          onChangeText={setInsuranceProvider}
          placeholder="e.g. State Farm"
          placeholderTextColor={colors.textMuted}
        />
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.fieldLabel}>Insurance Expiry Date</Text>
        <TextInput
          style={styles.textInput}
          value={insuranceExpiry}
          onChangeText={setInsuranceExpiry}
          placeholder="MM/DD/YYYY"
          placeholderTextColor={colors.textMuted}
          keyboardType="numbers-and-punctuation"
        />
      </View>

      <View style={styles.switchRow}>
        <Text style={styles.switchLabel}>I have active insurance</Text>
        <Switch
          value={hasInsurance}
          onValueChange={(val) => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setHasInsurance(val);
          }}
          trackColor={{ false: colors.borderMedium, true: colors.primaryLight }}
          thumbColor={hasInsurance ? colors.primary : '#f4f3f4'}
        />
      </View>
    </View>
  );
}

// ------------------------------------------------------------------
// Step 4: Service Area
// ------------------------------------------------------------------
function StepServiceArea({
  serviceRadius,
  setServiceRadius,
  mapRef,
}: {
  serviceRadius: number;
  setServiceRadius: (v: number) => void;
  mapRef: React.RefObject<MapView | null>;
}) {
  return (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Service Area</Text>
      <Text style={styles.stepSubtitle}>Set how far you're willing to travel for jobs</Text>

      <View style={styles.mapContainer}>
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={PORTSMOUTH_CENTER}
          scrollEnabled={false}
          zoomEnabled={false}
          rotateEnabled={false}
          pitchEnabled={false}
        >
          <Circle
            center={{
              latitude: PORTSMOUTH_CENTER.latitude,
              longitude: PORTSMOUTH_CENTER.longitude,
            }}
            radius={milesToMeters(serviceRadius)}
            fillColor="rgba(0, 169, 224, 0.12)"
            strokeColor={colors.primary}
            strokeWidth={2}
          />
        </MapView>
      </View>

      <View style={styles.sliderSection}>
        <View style={styles.sliderHeader}>
          <Text style={styles.sliderLabel}>Radius</Text>
          <View style={styles.radiusValueBadge}>
            <Text style={styles.radiusValueText}>{serviceRadius} miles</Text>
          </View>
        </View>
        <Slider
          value={serviceRadius}
          minimumValue={10}
          maximumValue={50}
          step={5}
          onValueChange={setServiceRadius}
        />
        <View style={styles.sliderRange}>
          <Text style={styles.sliderRangeText}>10 mi</Text>
          <Text style={styles.sliderRangeText}>50 mi</Text>
        </View>
      </View>

      <Text style={styles.serviceAreaHint}>
        You'll receive jobs within this radius of your location
      </Text>
    </View>
  );
}

// ------------------------------------------------------------------
// Step 5: Profile Photo
// ------------------------------------------------------------------
function StepProfilePhoto({
  profilePhoto,
  takePhoto,
  pickFromLibrary,
  setProfilePhoto,
}: {
  profilePhoto: string | null;
  takePhoto: () => void;
  pickFromLibrary: () => void;
  setProfilePhoto: (v: string | null) => void;
}) {
  return (
    <View style={[styles.stepContainer, styles.centeredStep]}>
      <Text style={styles.stepTitle}>Profile Photo</Text>
      <Text style={styles.stepSubtitle}>Add a photo so clients can recognize you</Text>

      <View style={styles.avatarContainer}>
        {profilePhoto ? (
          <Image source={{ uri: profilePhoto }} style={styles.avatarImage} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Ionicons name="person" size={48} color={colors.textMuted} />
          </View>
        )}
      </View>

      {profilePhoto && (
        <Pressable
          onPress={() => setProfilePhoto(null)}
          style={styles.changePhotoLink}
        >
          <Text style={styles.changePhotoText}>Change</Text>
        </Pressable>
      )}

      <View style={styles.photoButtons}>
        <Pressable style={styles.photoButton} onPress={takePhoto}>
          <Ionicons name="camera" size={22} color={colors.primary} />
          <Text style={styles.photoButtonText}>Take Photo</Text>
        </Pressable>
        <Pressable style={styles.photoButton} onPress={pickFromLibrary}>
          <Ionicons name="images" size={22} color={colors.primary} />
          <Text style={styles.photoButtonText}>Choose from Library</Text>
        </Pressable>
      </View>

      <Pressable style={styles.skipPhotoLink}>
        <Text style={styles.skipPhotoText}>Add photo later</Text>
      </Pressable>
    </View>
  );
}

// ------------------------------------------------------------------
// Step 6: Review & Submit
// ------------------------------------------------------------------
function StepReview({
  displayName,
  phone,
  bio,
  selectedTrades,
  licenseNumber,
  licenseState,
  insuranceProvider,
  insuranceExpiry,
  hasInsurance,
  serviceRadius,
  profilePhoto,
  goToStep,
}: {
  displayName: string;
  phone: string;
  bio: string;
  selectedTrades: Trade[];
  licenseNumber: string;
  licenseState: string;
  insuranceProvider: string;
  insuranceExpiry: string;
  hasInsurance: boolean;
  serviceRadius: number;
  profilePhoto: string | null;
  goToStep: (step: number) => void;
}) {
  return (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Review Your Profile</Text>
      <Text style={styles.stepSubtitle}>Make sure everything looks good</Text>

      {/* Personal Info */}
      <ReviewSection title="Personal Info" onEdit={() => goToStep(1)}>
        <ReviewRow label="Name" value={displayName} />
        <ReviewRow label="Phone" value={phone} />
        {bio ? <ReviewRow label="Bio" value={bio} /> : null}
      </ReviewSection>

      {/* Trades */}
      <ReviewSection title="Trades" onEdit={() => goToStep(2)}>
        <Text style={styles.reviewValue}>{selectedTrades.join(', ')}</Text>
      </ReviewSection>

      {/* License & Insurance */}
      <ReviewSection title="License & Insurance" onEdit={() => goToStep(3)}>
        {licenseNumber ? (
          <ReviewRow label="License" value={`${licenseNumber} (${licenseState})`} />
        ) : (
          <ReviewRow label="License" value="Not provided" muted />
        )}
        {insuranceProvider ? (
          <ReviewRow label="Insurance" value={insuranceProvider} />
        ) : (
          <ReviewRow label="Insurance" value="Not provided" muted />
        )}
        {insuranceExpiry ? (
          <ReviewRow label="Expiry" value={insuranceExpiry} />
        ) : null}
        <ReviewRow label="Active Insurance" value={hasInsurance ? 'Yes' : 'No'} />
      </ReviewSection>

      {/* Service Area */}
      <ReviewSection title="Service Area" onEdit={() => goToStep(4)}>
        <ReviewRow label="Radius" value={`${serviceRadius} miles`} />
      </ReviewSection>

      {/* Photo */}
      <ReviewSection title="Profile Photo" onEdit={() => goToStep(5)}>
        {profilePhoto ? (
          <Image source={{ uri: profilePhoto }} style={styles.reviewPhoto} />
        ) : (
          <Text style={[styles.reviewValue, styles.reviewMuted]}>No photo added</Text>
        )}
      </ReviewSection>
    </View>
  );
}

function ReviewSection({
  title,
  onEdit,
  children,
}: {
  title: string;
  onEdit: () => void;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.reviewCard}>
      <View style={styles.reviewCardHeader}>
        <Text style={styles.reviewCardTitle}>{title}</Text>
        <Pressable onPress={onEdit} hitSlop={8}>
          <Text style={styles.reviewEditText}>Edit</Text>
        </Pressable>
      </View>
      <View style={styles.reviewCardBody}>{children}</View>
    </View>
  );
}

function ReviewRow({
  label,
  value,
  muted = false,
}: {
  label: string;
  value: string;
  muted?: boolean;
}) {
  return (
    <View style={styles.reviewRow}>
      <Text style={styles.reviewLabel}>{label}</Text>
      <Text style={[styles.reviewValue, muted && styles.reviewMuted]} numberOfLines={2}>
        {value}
      </Text>
    </View>
  );
}

// ------------------------------------------------------------------
// Styles
// ------------------------------------------------------------------
const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    ...typography.subheading,
    color: colors.text,
  },
  headerSpacer: {
    width: 40,
  },
  skipText: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.primary,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  stepContainer: {
    gap: spacing.lg,
  },
  centeredStep: {
    alignItems: 'center',
  },
  stepTitle: {
    ...typography.heading,
    color: colors.text,
  },
  stepSubtitle: {
    ...typography.body,
    color: colors.textMuted,
    marginTop: -spacing.sm,
  },

  // Fields
  fieldGroup: {
    gap: spacing.xs,
  },
  fieldLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  textInput: {
    backgroundColor: colors.surfaceSecondary,
    borderWidth: 1,
    borderColor: colors.borderMedium,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    fontSize: 16,
    color: colors.text,
  },
  textArea: {
    minHeight: 100,
    paddingTop: spacing.md,
  },
  charCounter: {
    ...typography.caption,
    color: colors.textMuted,
    textAlign: 'right',
    marginTop: 2,
  },

  // Trade grid
  tradeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  tradeButton: {
    width: '47%',
    backgroundColor: colors.surfaceSecondary,
    borderWidth: 1.5,
    borderColor: colors.borderMedium,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tradeButtonSelected: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  tradeContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  tradeLabel: {
    ...typography.body,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  tradeLabelSelected: {
    color: colors.primary,
    fontWeight: '600',
  },
  tradeCheck: {
    marginLeft: 'auto',
  },
  selectionSummary: {
    ...typography.bodySmall,
    color: colors.primary,
    fontWeight: '600',
    textAlign: 'center',
  },

  // License states
  stateRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  stateChip: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1.5,
    borderColor: colors.borderMedium,
    alignItems: 'center',
    backgroundColor: colors.surfaceSecondary,
  },
  stateChipSelected: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  stateChipText: {
    ...typography.body,
    fontWeight: '600',
    color: colors.textMuted,
  },
  stateChipTextSelected: {
    color: colors.primary,
  },

  // Switch
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surfaceSecondary,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderMedium,
  },
  switchLabel: {
    ...typography.body,
    color: colors.text,
  },

  // Map / Service area
  mapContainer: {
    height: 240,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.borderMedium,
  },
  map: {
    flex: 1,
  },
  sliderSection: {
    gap: spacing.xs,
  },
  sliderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sliderLabel: {
    ...typography.body,
    color: colors.text,
    fontWeight: '600',
  },
  radiusValueBadge: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  radiusValueText: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '700',
  },
  sliderRange: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sliderRangeText: {
    ...typography.caption,
    color: colors.textMuted,
  },
  serviceAreaHint: {
    ...typography.bodySmall,
    color: colors.textMuted,
    textAlign: 'center',
    fontStyle: 'italic',
  },

  // Photo
  avatarContainer: {
    marginVertical: spacing.lg,
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.surfaceSecondary,
    borderWidth: 2,
    borderColor: colors.borderMedium,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: colors.primary,
  },
  changePhotoLink: {
    marginTop: -spacing.sm,
  },
  changePhotoText: {
    ...typography.bodySmall,
    color: colors.primary,
    fontWeight: '600',
  },
  photoButtons: {
    gap: spacing.md,
    width: '100%',
    paddingHorizontal: spacing.xl,
    marginTop: spacing.lg,
  },
  photoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.lg,
    borderRadius: borderRadius.md,
    borderWidth: 1.5,
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  photoButtonText: {
    ...typography.body,
    color: colors.primary,
    fontWeight: '600',
  },
  skipPhotoLink: {
    marginTop: spacing.xl,
  },
  skipPhotoText: {
    ...typography.bodySmall,
    color: colors.textMuted,
    textDecorationLine: 'underline',
  },

  // Bottom action bar
  bottomBar: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    backgroundColor: colors.background,
  },
  nextButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.full,
    paddingVertical: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    ...shadows.primaryGlow,
  },
  nextButtonDisabled: {
    opacity: 0.5,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  submitButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.full,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.primaryGlow,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },

  // Review
  reviewCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.borderMedium,
    ...shadows.sm,
    overflow: 'hidden',
  },
  reviewCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
    backgroundColor: colors.surfaceSecondary,
  },
  reviewCardTitle: {
    ...typography.subheading,
    color: colors.text,
    fontSize: 15,
  },
  reviewEditText: {
    ...typography.bodySmall,
    color: colors.primary,
    fontWeight: '600',
  },
  reviewCardBody: {
    padding: spacing.lg,
    gap: spacing.sm,
  },
  reviewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  reviewLabel: {
    ...typography.bodySmall,
    color: colors.textMuted,
    flex: 1,
  },
  reviewValue: {
    ...typography.bodySmall,
    color: colors.text,
    fontWeight: '500',
    flex: 2,
    textAlign: 'right',
  },
  reviewMuted: {
    color: colors.textMuted,
    fontStyle: 'italic',
  },
  reviewPhoto: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: colors.primary,
  },
});

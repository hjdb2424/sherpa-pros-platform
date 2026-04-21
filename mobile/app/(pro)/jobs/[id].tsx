import { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Alert,
  Image,
  Modal,
  TextInput,
  Dimensions,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, shadows, typography } from '@/lib/theme';
import Card from '@/components/common/Card';
import Badge from '@/components/common/Badge';
import Button from '@/components/common/Button';
import FinancingOptions from '@/components/pro/FinancingOptions';
import TaggingSystem from '@/components/social/TaggingSystem';
import type { Tag } from '@/components/social/TaggingSystem';

const SCREEN_WIDTH = Dimensions.get('window').width;

// ---------------------------------------------------------------------------
// Mock data (inline)
// ---------------------------------------------------------------------------

interface ChecklistItem {
  id: string;
  phase: string;
  label: string;
  completed: boolean;
  photoRequired: boolean;
  isQualityGate?: boolean;
}

interface MaterialItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  price: number;
  review: 'approved' | 'warning' | 'flagged';
  reviewNote?: string;
}

const MOCK_JOB = {
  id: 'c1',
  title: 'Bathroom Remodel - Phase 1',
  category: 'General',
  status: 'in_progress' as const,
  client: { name: 'John Davidson', initials: 'JD' },
  budget: '$8,000 - $15,000',
  urgency: 'standard',
  location: '42 Maple St, Portsmouth, NH',
  description:
    'Full bathroom remodel including demo, tile, fixtures, and paint. Client wants modern farmhouse style with subway tile and matte black fixtures.',
  milestoneProgress: 3,
  totalMilestones: 5,
  checklist: [
    { id: 'ck1', phase: 'Demo', label: 'Remove existing fixtures', completed: true, photoRequired: true },
    { id: 'ck2', phase: 'Demo', label: 'Remove tile and drywall', completed: true, photoRequired: true },
    { id: 'ck3', phase: 'Rough-in', label: 'Rough plumbing inspection', completed: true, photoRequired: true, isQualityGate: true },
    { id: 'ck4', phase: 'Rough-in', label: 'Install cement board', completed: false, photoRequired: false },
    { id: 'ck5', phase: 'Finish', label: 'Install tile', completed: false, photoRequired: true },
    { id: 'ck6', phase: 'Finish', label: 'Install fixtures', completed: false, photoRequired: true },
    { id: 'ck7', phase: 'Finish', label: 'Final inspection', completed: false, photoRequired: true, isQualityGate: true },
  ] as ChecklistItem[],
  materials: [
    { id: 'm1', name: 'Cement board (3x5)', quantity: 4, unit: 'sheets', price: 52, review: 'approved' },
    { id: 'm2', name: 'Waterproof membrane', quantity: 1, unit: 'roll', price: 89, review: 'approved' },
    { id: 'm3', name: 'Subway tile (white 3x6)', quantity: 80, unit: 'sqft', price: 320, review: 'approved' },
    { id: 'm4', name: 'Thinset mortar', quantity: 2, unit: 'bags', price: 48, review: 'warning', reviewNote: 'Consider upgrading to modified thinset for shower walls' },
    { id: 'm5', name: 'Matte black shower valve', quantity: 1, unit: 'each', price: 189, review: 'approved' },
  ] as MaterialItem[],
};

// ---------------------------------------------------------------------------
// Photos & Notes mock data
// ---------------------------------------------------------------------------

interface JobPhoto {
  id: string;
  title: string;
  uri: string;
  phase: string;
  date: string;
}

const JOB_PHOTOS: JobPhoto[] = [
  { id: 'p1', title: 'Before - existing fixtures', uri: 'https://picsum.photos/400/300?random=1', phase: 'Demo', date: 'Apr 10' },
  { id: 'p2', title: 'Demo complete', uri: 'https://picsum.photos/400/300?random=2', phase: 'Demo', date: 'Apr 11' },
  { id: 'p3', title: 'Rough plumbing', uri: 'https://picsum.photos/400/300?random=3', phase: 'Rough-in', date: 'Apr 13' },
  { id: 'p4', title: 'Cement board installed', uri: 'https://picsum.photos/400/300?random=4', phase: 'Rough-in', date: 'Apr 14' },
  { id: 'p5', title: 'Tile in progress', uri: 'https://picsum.photos/400/300?random=5', phase: 'Finish', date: 'Apr 16' },
  { id: 'p6', title: 'Waterproof membrane', uri: 'https://picsum.photos/400/300?random=6', phase: 'Rough-in', date: 'Apr 13' },
];

interface JobNote {
  id: string;
  text: string;
  date: string;
  author: string;
}

const INITIAL_NOTES: JobNote[] = [
  { id: 'n1', text: 'Client wants matte black fixtures throughout. Confirmed Moen Align series.', date: 'Apr 10', author: 'You' },
  { id: 'n2', text: 'Discovered rot behind shower wall. Need additional cement board. Updated materials list.', date: 'Apr 13', author: 'You' },
  { id: 'n3', text: 'Client approved additional $320 for extra materials. Change order #1.', date: 'Apr 14', author: 'Sherpa Platform' },
];

const PHOTO_PHASES = ['All', 'Demo', 'Rough-in', 'Finish'];

// HD Pricing mock data for enhanced materials
const HD_PRICES: Record<string, number> = {
  m1: 12.98,
  m2: 89.0,
  m3: 3.99,
  m4: 23.97,
  m5: 189.0,
};

const CATEGORY_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  Plumbing: 'water-outline',
  Electrical: 'flash-outline',
  HVAC: 'thermometer-outline',
  Painting: 'color-palette-outline',
  Roofing: 'home-outline',
  General: 'construct-outline',
  Carpentry: 'hammer-outline',
};

const REVIEW_BADGE: Record<string, { label: string; variant: 'success' | 'warning' | 'danger' }> = {
  approved: { label: 'Approved', variant: 'success' },
  warning: { label: 'Warning', variant: 'warning' },
  flagged: { label: 'Flagged', variant: 'danger' },
};

type TabKey = 'overview' | 'checklist' | 'materials' | 'photos';

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function ProJobDetailScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<TabKey>('overview');
  const [checklistState, setChecklistState] = useState(
    MOCK_JOB.checklist.map((item) => ({ ...item })),
  );
  const [photos, setPhotos] = useState<JobPhoto[]>(JOB_PHOTOS);
  const [photoFilter, setPhotoFilter] = useState('All');
  const [selectedPhoto, setSelectedPhoto] = useState<JobPhoto | null>(null);
  const [notes, setNotes] = useState<JobNote[]>(INITIAL_NOTES);
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [newNoteText, setNewNoteText] = useState('');
  const [quoteSent, setQuoteSent] = useState(false);

  const job = MOCK_JOB; // In production, fetch by `id`

  const handleBack = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  }, [router]);

  const toggleChecklist = useCallback((ckId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setChecklistState((prev) =>
      prev.map((item) => (item.id === ckId ? { ...item, completed: !item.completed } : item)),
    );
  }, []);

  const handleCamera = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Alert.alert('Camera', 'Photo capture coming soon');
  }, []);

  const handleMessage = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Alert.alert('Message', 'Messaging client coming soon');
  }, []);

  const handleUploadPhoto = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Alert.alert('Upload', 'Photo upload coming soon');
  }, []);

  const handleGetPricing = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert('HD Pricing', 'Pricing integration coming soon');
  }, []);

  const handleSendToClient = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert(
      'Send Materials',
      'Send this materials list to the client for approval?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Send',
          onPress: () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            Alert.alert('Sent', 'Materials sent to client for approval!');
          },
        },
      ],
    );
  }, []);

  // --- Group checklist by phase ---
  const phases = checklistState.reduce<Record<string, ChecklistItem[]>>((acc, item) => {
    if (!acc[item.phase]) acc[item.phase] = [];
    acc[item.phase].push(item);
    return acc;
  }, {});

  // --- Materials total ---
  const materialsTotal = job.materials.reduce((sum, m) => sum + m.price, 0);

  // --- Milestone progress ---
  const milestoneRatio = job.milestoneProgress / job.totalMilestones;

  // ======= TABS =======

  const TABS: { key: TabKey; label: string }[] = [
    { key: 'overview', label: 'Overview' },
    { key: 'checklist', label: 'Checklist' },
    { key: 'materials', label: 'Materials' },
    { key: 'photos', label: 'Photos' },
  ];

  // ======= RENDER SECTIONS =======

  const renderOverview = () => (
    <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
      {/* Job Info Card */}
      <Card style={styles.section} variant="elevated">
        <View style={styles.infoRow}>
          <Ionicons
            name={CATEGORY_ICONS[job.category] ?? 'construct-outline'}
            size={32}
            color={colors.primary}
          />
          <View style={styles.infoText}>
            <Text style={styles.infoTitle}>{job.title}</Text>
            <Text style={styles.infoCategory}>{job.category}</Text>
          </View>
        </View>

        <View style={styles.detailGrid}>
          <View style={styles.detailItem}>
            <Ionicons name="person-outline" size={16} color={colors.textMuted} />
            <Text style={styles.detailLabel}>{job.client.name}</Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="cash-outline" size={16} color={colors.textMuted} />
            <Text style={styles.detailLabel}>{job.budget}</Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="location-outline" size={16} color={colors.textMuted} />
            <Text style={styles.detailLabel}>{job.location}</Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="time-outline" size={16} color={colors.textMuted} />
            <Text style={styles.detailLabel}>
              {job.urgency.charAt(0).toUpperCase() + job.urgency.slice(1)}
            </Text>
          </View>
        </View>

        <Text style={styles.descriptionText}>{job.description}</Text>
      </Card>

      {/* Quote Action */}
      {quoteSent ? (
        <Card style={styles.section} variant="elevated">
          <View style={styles.quoteSentRow}>
            <Badge label="Quote Sent" variant="success" />
            <Pressable
              style={styles.viewQuoteBtn}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                router.push({ pathname: '/(pro)/quote', params: { jobId: id } });
              }}
            >
              <Ionicons name="document-text-outline" size={16} color={colors.primary} />
              <Text style={styles.viewQuoteBtnText}>View Quote</Text>
            </Pressable>
          </View>
        </Card>
      ) : (
        <Pressable
          style={styles.sendQuoteBtn}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            router.push({ pathname: '/(pro)/quote', params: { jobId: id } });
          }}
        >
          <Ionicons name="document-text-outline" size={18} color={colors.textInverse} />
          <Text style={styles.sendQuoteBtnText}>Send Quote</Text>
        </Pressable>
      )}

      {/* Milestone Progress */}
      <Card style={styles.section} variant="elevated">
        <Text style={styles.sectionTitle}>Milestone Progress</Text>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${milestoneRatio * 100}%` }]} />
        </View>
        <Text style={styles.progressLabel}>
          {job.milestoneProgress} of {job.totalMilestones} milestones complete
        </Text>
      </Card>

      {/* Job Notes */}
      <Card style={styles.section} variant="elevated">
        <View style={styles.notesSectionHeader}>
          <Text style={styles.sectionTitle}>Job Notes</Text>
          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setShowNoteInput(true);
            }}
            style={styles.addNoteBtn}
          >
            <Ionicons name="add-circle-outline" size={20} color={colors.primary} />
            <Text style={styles.addNoteBtnText}>Add Note</Text>
          </Pressable>
        </View>
        {notes.map((note) => (
          <View key={note.id} style={styles.noteItem}>
            <View style={styles.noteHeader}>
              <Badge
                label={note.author}
                variant={note.author === 'You' ? 'primary' : 'neutral'}
              />
              <Text style={styles.noteDate}>{note.date}</Text>
            </View>
            <Text style={styles.noteText}>{note.text}</Text>
          </View>
        ))}
      </Card>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <Button title="Message Client" onPress={handleMessage} variant="secondary" fullWidth />
        <View style={{ height: spacing.md }} />
        <Button title="Upload Photo" onPress={handleUploadPhoto} variant="primary" fullWidth />
      </View>

      <View style={{ height: spacing.xxxl }} />
    </ScrollView>
  );

  const renderChecklist = () => (
    <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
      {Object.entries(phases).map(([phase, items]) => {
        const doneCount = items.filter((i) => i.completed).length;
        return (
          <View key={phase} style={styles.phaseGroup}>
            <View style={styles.phaseHeader}>
              <Text style={styles.phaseTitle}>{phase}</Text>
              <Text style={styles.phaseCount}>
                {doneCount}/{items.length}
              </Text>
            </View>

            {items.map((item) => (
              <Pressable
                key={item.id}
                style={[
                  styles.checklistItem,
                  item.isQualityGate && styles.qualityGateItem,
                ]}
                onPress={() => toggleChecklist(item.id)}
              >
                <Ionicons
                  name={item.completed ? 'checkbox' : 'checkbox-outline'}
                  size={24}
                  color={item.completed ? colors.success : colors.textMuted}
                />
                <Text
                  style={[
                    styles.checklistLabel,
                    item.completed && styles.checklistLabelDone,
                  ]}
                >
                  {item.label}
                </Text>
                {item.photoRequired && (
                  <Pressable onPress={handleCamera} hitSlop={8}>
                    <Ionicons name="camera-outline" size={20} color={colors.textMuted} />
                  </Pressable>
                )}
              </Pressable>
            ))}
          </View>
        );
      })}
      <View style={{ height: spacing.xxxl }} />
    </ScrollView>
  );

  const handleMaterialTap = useCallback((item: MaterialItem) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const badge = REVIEW_BADGE[item.review];
    const hdPrice = HD_PRICES[item.id] ?? 0;
    const total = hdPrice * item.quantity;
    Alert.alert(
      item.name,
      `Quantity: ${item.quantity} ${item.unit}\nSpec: Standard\nPrice: $${item.price}\nHD Unit Price: $${hdPrice.toFixed(2)}\nHD Total: $${total.toFixed(2)}\n\nReview: ${badge.label}${item.reviewNote ? '\nNote: ' + item.reviewNote : ''}\n\nView on homedepot.com`,
      [{ text: 'Close' }],
    );
  }, []);

  const sherpaFee = Math.round(materialsTotal * 0.08);
  const grandTotal = materialsTotal + sherpaFee;

  const renderMaterials = () => (
    <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
      {/* Column headers */}
      <View style={styles.matHeaderRow}>
        <Text style={[styles.matHeaderText, { flex: 1 }]}>Item</Text>
        <Text style={[styles.matHeaderText, { width: 60, textAlign: 'right' }]}>HD Price</Text>
        <Text style={[styles.matHeaderText, { width: 60, textAlign: 'right' }]}>Total</Text>
      </View>

      {job.materials.map((mat) => {
        const badge = REVIEW_BADGE[mat.review];
        const hdPrice = HD_PRICES[mat.id] ?? 0;
        const lineTotal = hdPrice * mat.quantity;
        return (
          <Pressable key={mat.id} onPress={() => handleMaterialTap(mat)}>
            <Card style={styles.materialCard} variant="elevated">
              <View style={styles.materialRow}>
                <View style={styles.materialInfo}>
                  <Text style={styles.materialName}>{mat.name}</Text>
                  <View style={styles.materialMetaRow}>
                    <Text style={styles.materialSpec}>
                      {mat.quantity} {mat.unit}
                    </Text>
                    <Badge label={badge.label} variant={badge.variant} />
                  </View>
                  {mat.reviewNote && (
                    <Text style={styles.materialNote}>{mat.reviewNote}</Text>
                  )}
                </View>
                <Text style={styles.materialHdPrice}>${hdPrice.toFixed(2)}</Text>
                <Text style={styles.materialLineTotal}>${lineTotal.toFixed(0)}</Text>
              </View>
            </Card>
          </Pressable>
        );
      })}

      {/* Subtotal + Sherpa Fee + Grand Total */}
      <Card style={styles.totalCard} variant="elevated">
        <View style={styles.subtotalRow}>
          <Text style={styles.subtotalLabel}>Subtotal</Text>
          <Text style={styles.subtotalValue}>${materialsTotal.toLocaleString()}</Text>
        </View>
        <View style={styles.subtotalRow}>
          <Text style={styles.subtotalLabel}>Sherpa Platform Fee (8%)</Text>
          <Text style={styles.subtotalValue}>${sherpaFee.toLocaleString()}</Text>
        </View>
        <View style={[styles.totalRow, { borderTopWidth: 2, borderTopColor: colors.borderMedium, paddingTop: spacing.md, marginTop: spacing.sm }]}>
          <Text style={styles.totalLabel}>Grand Total</Text>
          <Text style={styles.totalValue}>${grandTotal.toLocaleString()}</Text>
        </View>
      </Card>

      <View style={styles.actionButtons}>
        <Button title="Get HD Pricing" onPress={handleGetPricing} variant="accent" fullWidth />
        <View style={{ height: spacing.md }} />
        <Button title="Send to Client" onPress={handleSendToClient} variant="primary" fullWidth />
      </View>

      <View style={{ height: spacing.xl }} />

      <FinancingOptions />

      <View style={{ height: spacing.xxxl }} />
    </ScrollView>
  );

  // --- Photo picker ---
  const handleAddPhoto = useCallback(async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });
    if (!result.canceled && result.assets.length > 0) {
      const asset = result.assets[0];
      const newPhoto: JobPhoto = {
        id: `p-${Date.now()}`,
        title: 'New photo',
        uri: asset.uri,
        phase: 'Finish',
        date: 'Apr 15',
      };
      setPhotos((prev) => [newPhoto, ...prev]);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  }, []);

  // --- Add note handler ---
  const handleAddNote = useCallback(() => {
    if (!newNoteText.trim()) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    const note: JobNote = {
      id: `n-${Date.now()}`,
      text: newNoteText.trim(),
      date: 'Apr 15',
      author: 'You',
    };
    setNotes((prev) => [note, ...prev]);
    setNewNoteText('');
    setShowNoteInput(false);
  }, [newNoteText]);

  // --- Filtered photos ---
  const filteredPhotos = photoFilter === 'All' ? photos : photos.filter((p) => p.phase === photoFilter);

  const renderPhotos = () => (
    <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
      {/* Phase filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.photoFilterRow}
      >
        {PHOTO_PHASES.map((phase) => {
          const active = photoFilter === phase;
          return (
            <Pressable
              key={phase}
              style={[styles.photoFilterChip, active && styles.photoFilterChipActive]}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setPhotoFilter(phase);
              }}
            >
              <Text style={[styles.photoFilterText, active && styles.photoFilterTextActive]}>
                {phase}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* Photo grid */}
      <View style={styles.photoGrid}>
        {filteredPhotos.map((photo) => (
          <Pressable
            key={photo.id}
            style={styles.photoThumb}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setSelectedPhoto(photo);
            }}
          >
            <Image source={{ uri: photo.uri }} style={styles.photoImage} />
            <Text style={styles.photoLabel} numberOfLines={1}>{photo.title}</Text>
            <Text style={styles.photoDate}>{photo.date}</Text>
          </Pressable>
        ))}
      </View>

      {/* Add Photo + Tag a Pro buttons */}
      <View style={styles.actionButtons}>
        <View style={styles.photoActionsRow}>
          <View style={{ flex: 1 }}>
            <Button title="Add Photo" onPress={handleAddPhoto} variant="primary" fullWidth />
          </View>
          <TaggingSystem
            photoId={`job-${id}-photos`}
            onTagAdded={(tag: Tag) => {
              // In production, persist the tag
            }}
          />
        </View>
      </View>

      <View style={{ height: spacing.xxxl }} />
    </ScrollView>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'checklist':
        return renderChecklist();
      case 'materials':
        return renderMaterials();
      case 'photos':
        return renderPhotos();
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={handleBack} hitSlop={12} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </Pressable>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {job.title}
          </Text>
        </View>
        <Badge label="In Progress" variant="warning" />
      </View>

      {/* Tab bar */}
      <View style={styles.tabBar}>
        {TABS.map((tab) => {
          const active = activeTab === tab.key;
          return (
            <Pressable
              key={tab.key}
              style={[styles.tab, active && styles.tabActive]}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setActiveTab(tab.key);
              }}
            >
              <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Content */}
      {renderTabContent()}

      {/* Photo Full-Screen Viewer */}
      <Modal visible={!!selectedPhoto} animationType="fade" transparent>
        <View style={styles.photoModal}>
          <Pressable
            style={styles.photoModalClose}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setSelectedPhoto(null);
            }}
          >
            <Ionicons name="close-circle" size={32} color={colors.textInverse} />
          </Pressable>
          {selectedPhoto && (
            <>
              <Image
                source={{ uri: selectedPhoto.uri }}
                style={styles.photoModalImage}
                resizeMode="contain"
              />
              <View style={styles.photoModalInfo}>
                <Text style={styles.photoModalTitle}>{selectedPhoto.title}</Text>
                <Text style={styles.photoModalDate}>{selectedPhoto.phase} - {selectedPhoto.date}</Text>
              </View>
            </>
          )}
        </View>
      </Modal>

      {/* Add Note Modal */}
      <Modal visible={showNoteInput} animationType="slide" transparent>
        <View style={styles.noteModal}>
          <View style={[styles.noteModalContent, { paddingBottom: insets.bottom + spacing.lg }]}>
            <View style={styles.noteModalHeader}>
              <Text style={styles.noteModalTitle}>Add Note</Text>
              <Pressable onPress={() => setShowNoteInput(false)}>
                <Ionicons name="close" size={24} color={colors.text} />
              </Pressable>
            </View>
            <TextInput
              style={styles.noteInput}
              placeholder="Type your note..."
              placeholderTextColor={colors.textMuted}
              value={newNoteText}
              onChangeText={setNewNoteText}
              multiline
              autoFocus
              textAlignVertical="top"
            />
            <Button
              title="Save Note"
              onPress={handleAddNote}
              variant="primary"
              fullWidth
            />
          </View>
        </View>
      </Modal>
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
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  backButton: {
    marginRight: spacing.sm,
  },
  headerCenter: {
    flex: 1,
    marginRight: spacing.sm,
  },
  headerTitle: {
    ...typography.subheading,
    color: colors.text,
  },

  // Tab bar
  tabBar: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: colors.primary,
  },
  tabLabel: {
    ...typography.caption,
    color: colors.textMuted,
  },
  tabLabelActive: {
    color: colors.primary,
    fontWeight: '700',
  },

  // Scroll content
  scrollContent: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },

  // Sections
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.subheading,
    color: colors.text,
    marginBottom: spacing.md,
  },

  // Info card
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  infoText: {
    flex: 1,
    marginLeft: spacing.md,
  },
  infoTitle: {
    ...typography.subheading,
    color: colors.text,
  },
  infoCategory: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 2,
  },
  detailGrid: {
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  detailLabel: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  descriptionText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    lineHeight: 20,
    marginTop: spacing.sm,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },

  // Milestone progress
  progressBar: {
    height: 8,
    backgroundColor: colors.borderLight,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  progressLabel: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: spacing.sm,
  },

  // Actions
  actionButtons: {
    marginTop: spacing.md,
    paddingHorizontal: spacing.xs,
  },

  // Checklist
  phaseGroup: {
    marginBottom: spacing.xl,
  },
  phaseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  phaseTitle: {
    ...typography.subheading,
    color: colors.text,
  },
  phaseCount: {
    ...typography.caption,
    color: colors.textMuted,
  },
  checklistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
    gap: spacing.md,
    ...shadows.sm,
  },
  qualityGateItem: {
    borderLeftWidth: 3,
    borderLeftColor: colors.accent,
  },
  checklistLabel: {
    ...typography.bodySmall,
    color: colors.text,
    flex: 1,
  },
  checklistLabelDone: {
    textDecorationLine: 'line-through',
    color: colors.textMuted,
  },

  // Materials
  matHeaderRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.sm,
    marginBottom: spacing.sm,
  },
  matHeaderText: {
    ...typography.caption,
    color: colors.textMuted,
    textTransform: 'uppercase',
  },
  materialCard: {
    marginBottom: spacing.md,
  },
  materialRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  materialInfo: {
    flex: 1,
    marginRight: spacing.md,
  },
  materialMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: 2,
  },
  materialName: {
    ...typography.bodySmall,
    fontWeight: '600',
    color: colors.text,
  },
  materialSpec: {
    ...typography.caption,
    color: colors.textMuted,
  },
  materialNote: {
    ...typography.caption,
    color: colors.warning,
    marginTop: spacing.xs,
    fontStyle: 'italic',
  },
  materialRight: {
    alignItems: 'flex-end',
    gap: spacing.xs,
  },
  materialPrice: {
    ...typography.bodySmall,
    fontWeight: '600',
    color: colors.text,
  },
  materialHdPrice: {
    ...typography.caption,
    color: colors.textSecondary,
    width: 60,
    textAlign: 'right',
  },
  materialLineTotal: {
    ...typography.bodySmall,
    fontWeight: '600',
    color: colors.text,
    width: 60,
    textAlign: 'right',
  },

  // Total
  totalCard: {
    marginBottom: spacing.md,
    backgroundColor: colors.primaryLight,
  },
  subtotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  subtotalLabel: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  subtotalValue: {
    ...typography.bodySmall,
    fontWeight: '600',
    color: colors.text,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    ...typography.subheading,
    color: colors.text,
  },
  totalValue: {
    ...typography.heading,
    color: colors.primary,
  },

  // Notes
  notesSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  addNoteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  addNoteBtnText: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '600',
  },
  noteItem: {
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  noteHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  noteDate: {
    ...typography.caption,
    color: colors.textMuted,
  },
  noteText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    lineHeight: 20,
  },

  // Photo actions row
  photoActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },

  // Photos
  photoFilterRow: {
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  photoFilterChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: colors.borderLight,
  },
  photoFilterChipActive: {
    backgroundColor: colors.primary,
  },
  photoFilterText: {
    ...typography.caption,
    color: colors.textMuted,
  },
  photoFilterTextActive: {
    color: colors.textInverse,
    fontWeight: '700',
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  photoThumb: {
    width: (SCREEN_WIDTH - spacing.lg * 2 - spacing.sm * 2) / 3,
    marginBottom: spacing.sm,
  },
  photoImage: {
    width: '100%',
    aspectRatio: 4 / 3,
    borderRadius: borderRadius.md,
    backgroundColor: colors.borderLight,
  },
  photoLabel: {
    ...typography.caption,
    color: colors.text,
    marginTop: spacing.xs,
    fontWeight: '600',
  },
  photoDate: {
    ...typography.caption,
    color: colors.textMuted,
    fontSize: 10,
  },

  // Photo Modal
  photoModal: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoModalClose: {
    position: 'absolute',
    top: 60,
    right: 20,
    zIndex: 10,
  },
  photoModalImage: {
    width: SCREEN_WIDTH - 32,
    height: SCREEN_WIDTH - 32,
  },
  photoModalInfo: {
    marginTop: spacing.lg,
    alignItems: 'center',
  },
  photoModalTitle: {
    ...typography.subheading,
    color: colors.textInverse,
  },
  photoModalDate: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },

  // Note Modal
  noteModal: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  noteModalContent: {
    backgroundColor: colors.background,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    padding: spacing.lg,
  },
  noteModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  noteModalTitle: {
    ...typography.subheading,
    color: colors.text,
  },
  noteInput: {
    ...typography.bodySmall,
    color: colors.text,
    backgroundColor: colors.surfaceSecondary,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    minHeight: 120,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.borderMedium,
  },

  // Quote
  sendQuoteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.full,
    marginBottom: spacing.lg,
    ...shadows.primaryGlow,
  },
  sendQuoteBtnText: {
    ...typography.bodySmall,
    fontWeight: '600',
    color: colors.textInverse,
  },
  quoteSentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  viewQuoteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  viewQuoteBtnText: {
    ...typography.bodySmall,
    color: colors.primary,
    fontWeight: '600',
  },
});

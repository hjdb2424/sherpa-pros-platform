import { useRef, useEffect } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  type NativeSyntheticEvent,
  type TextInputKeyPressEventData,
} from 'react-native';
import { colors, borderRadius } from '@/lib/theme';

const CODE_LENGTH = 6;

interface CodeInputProps {
  value: string;
  onChangeText: (s: string) => void;
  onComplete?: (s: string) => void;
  disabled?: boolean;
}

/**
 * 6-box numeric code input. Auto-advances focus on type, supports
 * backspace-to-prior-box, and splits a 6-digit paste across all boxes.
 *
 * Value is the canonical source of truth — each box renders a single
 * digit derived from `value`. We keep a refs array so we can move
 * focus programmatically.
 */
export default function CodeInput({
  value,
  onChangeText,
  onComplete,
  disabled = false,
}: CodeInputProps) {
  const inputRefs = useRef<Array<TextInput | null>>([]);

  // Fire onComplete when all 6 digits are filled.
  useEffect(() => {
    const digits = value.replace(/\D/g, '').slice(0, CODE_LENGTH);
    if (digits.length === CODE_LENGTH) {
      onComplete?.(digits);
    }
  }, [value, onComplete]);

  const handleChangeText = (index: number, text: string) => {
    const cleaned = text.replace(/\D/g, '');

    // Paste case: a multi-character string landed in a single box.
    // Distribute starting at the current box, capped at CODE_LENGTH.
    if (cleaned.length > 1) {
      const before = value.slice(0, index);
      const combined = (before + cleaned).slice(0, CODE_LENGTH);
      onChangeText(combined);
      const focusIdx = Math.min(combined.length, CODE_LENGTH - 1);
      inputRefs.current[focusIdx]?.focus();
      return;
    }

    // Single character typed (or cleared by selecting and replacing).
    const chars = value.split('');
    while (chars.length < CODE_LENGTH) chars.push('');
    chars[index] = cleaned;

    // Compact: trim trailing empty slots so `value` length === filled count.
    let next = chars.join('');
    while (next.length > 0 && next[next.length - 1] === '') {
      next = next.slice(0, -1);
    }
    onChangeText(next);

    if (cleaned.length === 1 && index < CODE_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (
    index: number,
    e: NativeSyntheticEvent<TextInputKeyPressEventData>
  ) => {
    if (e.nativeEvent.key === 'Backspace') {
      const chars = value.split('');
      if (!chars[index] && index > 0) {
        // Current box is empty — clear prior and focus it.
        const prev = chars.slice(0, index - 1).join('');
        onChangeText(prev);
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const digits: string[] = [];
  for (let i = 0; i < CODE_LENGTH; i++) {
    digits.push(value[i] ?? '');
  }

  return (
    <View style={styles.row}>
      {digits.map((digit, i) => (
        <TextInput
          key={i}
          ref={(r) => {
            inputRefs.current[i] = r;
          }}
          value={digit}
          onChangeText={(t) => handleChangeText(i, t)}
          onKeyPress={(e) => handleKeyPress(i, e)}
          onFocus={() => {
            // If user taps a box that's ahead of the filled prefix,
            // bounce them back to the next-empty position so input
            // always lands at the correct slot.
            if (i > value.length) {
              inputRefs.current[Math.min(value.length, CODE_LENGTH - 1)]?.focus();
            }
          }}
          editable={!disabled}
          keyboardType="number-pad"
          textContentType={i === 0 ? 'oneTimeCode' : 'none'}
          autoComplete={i === 0 ? 'sms-otp' : 'off'}
          maxLength={CODE_LENGTH}
          selectTextOnFocus
          style={[
            styles.box,
            digit ? styles.boxFilled : null,
            disabled ? styles.boxDisabled : null,
          ]}
          accessibilityLabel={`Verification code digit ${i + 1}`}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 8,
  },
  box: {
    flex: 1,
    height: 56,
    borderWidth: 1.5,
    borderColor: colors.borderMedium,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.background,
    fontSize: 22,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
  },
  boxFilled: {
    borderColor: colors.primary,
  },
  boxDisabled: {
    opacity: 0.5,
  },
});
